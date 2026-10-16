import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));

// Helper for Gemini AI client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// AI Endpoint: Analyze document or syllabus for matrix recommendation
app.post('/api/ai/analyze-document', async (req: Request, res: Response) => {
  try {
    const { documentText, grade, subject, examType, textbook } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Chưa cấu hình GEMINI_API_KEY, hệ thống kích hoạt bộ gợi ý chuẩn Bộ GD&ĐT.',
        data: null
      });
    }

    const prompt = `Bạn là Chuyên gia Tiểu học am hiểu Chương trình GDPT 2018 và Thông tư 27/2020/TT-BGDĐT.
Hãy phân tích tài liệu sau đây cho môn ${subject}, Lớp ${grade}, Bộ sách: ${textbook}, Kỳ kiểm tra: ${examType}:
Tài liệu giáo viên cung cấp:
"""
${documentText || 'Không có tệp đính kèm, hãy căn cứ theo chương trình chuẩn.'}
"""

Hãy đề xuất các mạch kiến thức/chủ đề chính, các yêu cầu cần đạt (YCCĐ) theo 3 mức độ (Mức 1: Biết, Mức 2: Hiểu, Mức 3: Vận dụng) và phân bổ số câu, điểm số bám sát chuẩn tỉ lệ Mức 1-2-3 (50%-30%-20%), Trắc nghiệm 60% - Tự luận 40%, tổng 10 điểm.
Trả về định dạng JSON thuần túy theo cấu trúc:
{
  "topics": [
    {
      "name": "Tên mạch kiến thức/chủ đề",
      "lessons": "Các bài học trọng tâm",
      "outcomes": {
        "level1": ["Yêu cầu cần đạt Mức 1..."],
        "level2": ["Yêu cầu cần đạt Mức 2..."],
        "level3": ["Yêu cầu cần đạt Mức 3..."]
      },
      "suggestedPoints": 4.0
    }
  ],
  "pedagogicalAdvice": "Lời khuyên sư phạm về độ dài câu hỏi, ngữ liệu..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    return res.status(500).json({ error: error.message || 'Lỗi khi phân tích tài liệu' });
  }
});

// AI Endpoint: Generate or regenerate specific questions
app.post('/api/ai/generate-questions', async (req: Request, res: Response) => {
  try {
    const { grade, subject, textbook, examType, topic, questionType, level, count, readingPassage } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Chế độ câu hỏi từ Ngân hàng đề chuẩn Quốc gia.',
        questions: []
      });
    }

    // Strict Pedagogical Rule: KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (MỨC 3)
    let effectiveQuestionType = questionType;
    if (level === 3 && (questionType.startsWith('TN') || questionType === 'MCQ' || questionType === 'TF' || questionType === 'MATCH' || questionType === 'FILL')) {
      effectiveQuestionType = 'TL';
    }

    const maxOptions = (grade <= 3) ? 3 : 4;
    const optionLabels = (maxOptions === 3) ? 'A, B, C' : 'A, B, C, D';

    const prompt = `Bạn là Chuyên gia Khảo thí Tiểu học, am hiểu sâu sắc Chương trình GDPT 2018 và Thông tư 27.
Nhiệm vụ: Tạo ${count || 1} câu hỏi kiểm tra cho học sinh Lớp ${grade}, Môn ${subject}, Bộ sách ${textbook}, Kỳ ${examType}.
Chủ đề / YCCĐ: ${topic}
Hình thức: ${effectiveQuestionType} (Trắc nghiệm nhiều lựa chọn: MCQ, Đúng - Sai: TF, Nối cột: MATCH, Điền khuyết: FILL, hoặc Tự luận: ESSAY / TL, Thực hành: TH).
Mức độ: Mức ${level} (Mức 1: Biết, Mức 2: Hiểu, Mức 3: Vận dụng).
${readingPassage ? `Ngữ liệu đọc hiểu đính kèm: "${readingPassage}"` : ''}

Quy chuẩn BẮT BUỘC theo Thông tư 27 và GDPT 2018:
1. NGUYÊN TẮC CỐT LÕI: TUYỆT ĐỐI KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (MỨC 3).
   - Ở Mức 3 (Vận dụng): BẮT BUỘC 100% là câu hỏi TỰ LUẬN (hoặc THỰC HÀNH với môn Tin học).
   - Trắc nghiệm CHỈ ĐƯỢC PHÉP xuất hiện ở Mức 1 (Biết) và Mức 2 (Hiểu).
2. Đối với trắc nghiệm (Chỉ ở Mức 1 và Mức 2):
   - Lớp 1, 2, 3: CHỈ ĐƯỢC 3 phương án lựa chọn (${optionLabels}).
   - Lớp 4, 5: 4 phương án lựa chọn (A, B, C, D).
   - Điểm số: 0,5 điểm/câu (hoặc 0,25đ/ý với đúng sai, nối cột, điền khuyết).
3. Đối với tự luận:
   - Mức 1: 0,5đ; Mức 2: 1,0đ; Mức 3: 1,0 - 2,0đ.
   - Hướng dẫn chấm chi tiết từng bước.
4. Ngôn từ trong sáng, chuẩn mực sư phạm tiểu học, gần gũi đời sống. Không đố mẹo.

Trả về mảng JSON chứa các câu hỏi:
[
  {
    "type": "${questionType}",
    "level": ${level},
    "points": 0.5,
    "topic": "${topic}",
    "content": "Nội dung câu hỏi",
    "options": ["Phương án A", "Phương án B", "Phương án C"${maxOptions === 4 ? ', "Phương án D"' : ''}],
    "correctAnswer": "A",
    "explanation": "Lời giải thích hoặc các bước giải chi tiết",
    "gradingGuide": "Hướng dẫn chấm cụ thể cho từng bước để cho điểm"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '[]';
    const questions = JSON.parse(text);
    return res.json({ success: true, questions });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ error: error.message || 'Lỗi khi sinh câu hỏi' });
  }
});

// Start dev or prod server
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Primary Exam System server running on http://0.0.0.0:${port}`);
  });
}

startServer();
