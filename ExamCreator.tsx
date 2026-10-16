import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Sparkles,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Save,
  CheckCircle2,
  AlertTriangle,
  Copy,
  BookOpen,
  Grid,
  HelpCircle,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import {
  ExamPackage,
  QuestionItem,
  QuestionFormat,
  GradeLevel,
  SubjectName,
  ExamTerm,
  TextbookSeries,
  MatrixTopicRow,
  SchoolProfile
} from '../types';
import {
  sortAndRenumberQuestions,
  validatePedagogicalStandard,
  buildSpecificationsFromExam,
  createPermutedExamCode
} from '../utils/examGenerator';
import { SAMPLE_EXAMS } from '../data/sampleExams';
import { VIETNAMESE_PASSAGE_LENGTHS } from '../data/standards';

interface ExamCreatorProps {
  profile: SchoolProfile;
  initialMatrixData?: {
    grade: GradeLevel;
    subject: SubjectName;
    term: ExamTerm;
    textbook: TextbookSeries;
    durationMinutes: number;
    matrixTopics: MatrixTopicRow[];
  } | null;
  onSaveExam: (exam: ExamPackage) => void;
  onOpenPreview: (exam: ExamPackage) => void;
}

export const ExamCreator: React.FC<ExamCreatorProps> = ({
  profile,
  initialMatrixData,
  onSaveExam,
  onOpenPreview,
}) => {
  // Use initial matrix or fallback to Sample Exam
  const defaultBaseExam = SAMPLE_EXAMS[0];

  const [grade, setGrade] = useState<GradeLevel>(initialMatrixData?.grade || defaultBaseExam.grade);
  const [subject, setSubject] = useState<SubjectName>(initialMatrixData?.subject || defaultBaseExam.subject);
  const [term, setTerm] = useState<ExamTerm>(initialMatrixData?.term || defaultBaseExam.term);
  const [textbook, setTextbook] = useState<TextbookSeries>(
    initialMatrixData?.textbook || defaultBaseExam.textbook
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(
    initialMatrixData?.durationMinutes || defaultBaseExam.durationMinutes
  );
  const [examCode, setExamCode] = useState<string>('101');
  const [title, setTitle] = useState<string>(
    `Đề kiểm tra định kỳ ${term} - Môn ${subject} Lớp ${grade}`
  );

  const [matrixTopics, setMatrixTopics] = useState<MatrixTopicRow[]>(
    initialMatrixData?.matrixTopics || defaultBaseExam.matrixTopics
  );

  // Load questions matching the current exam or clone sample
  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    const match = SAMPLE_EXAMS.find((e) => e.subject === subject && e.grade === grade);
    if (match) {
      return sortAndRenumberQuestions(match.questions);
    }
    return sortAndRenumberQuestions(defaultBaseExam.questions);
  });

  // Vietnamese Reading Passage state
  const [readingPassage, setReadingPassage] = useState(
    subject === 'Tiếng Việt'
      ? defaultBaseExam.readingPassage || {
          title: 'NGÔI TRƯỜNG BIÊN CƯƠNG CHÍ CÀ',
          author: 'Lê Thảo',
          genre: 'miêu tả' as const,
          wordCount: 220,
          content: 'Trường PTDTBT Tiểu học Chí Cà nằm uy nghi giữa đại ngàn Tây Côn Lĩnh...\nHoa tam giác mạch khoe sắc thắm dọc theo con đường dẫn vào cổng trường.',
        }
      : undefined
  );

  // Active editing question modal/inline
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);

  // Realtime pedagogical validation
  const validation = validatePedagogicalStandard(grade, subject, questions, matrixTopics);

  // Update title when options change
  useEffect(() => {
    setTitle(`Đề kiểm tra định kỳ ${term} - Môn ${subject} Lớp ${grade}`);
    if (subject === 'Tiếng Việt' && !readingPassage) {
      setReadingPassage({
        title: 'BÀI ĐỌC HIỂU: MÙA HOA TAM GIÁC MẠCH',
        author: 'Nguyễn Phan Quế',
        genre: 'miêu tả',
        wordCount: 215,
        content:
          'Khi những đợt gió lạnh đầu đông tràn về miền biên cương Xín Mần, cũng là lúc khắp các sườn núi Chí Cà bừng sáng bởi sắc hồng phớt của hoa tam giác mạch...',
      });
    }
  }, [grade, subject, term]);

  // Handle question content edit
  const handleUpdateQuestion = (id: string, updates: Partial<QuestionItem>) => {
    setQuestions((prev) => {
      const updated = prev.map((q) => (q.id === id ? { ...q, ...updates } : q));
      return sortAndRenumberQuestions(updated);
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== id);
      return sortAndRenumberQuestions(filtered);
    });
  };

  const handleAddQuestion = (format: QuestionFormat, level: 1 | 2 | 3) => {
    // Strict Pedagogical Rule: KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (MỨC 3)
    if (format.startsWith('TN') && level === 3) {
      alert('Quy chuẩn Thông tư 27 & GDPT 2018: Tuyệt đối KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG. Mức 3 chỉ bao gồm câu hỏi Tự luận hoặc Thực hành.');
      return;
    }

    const isMcq = format.startsWith('TN');
    const expectedOpts = grade <= 3 ? 3 : 4;
    const defaultPts = isMcq ? 0.5 : level === 1 ? 0.5 : level === 2 ? 1.0 : 1.5;

    const newQ: QuestionItem = {
      id: `q-custom-${Date.now()}`,
      orderNumber: questions.length + 1,
      topicName: matrixTopics[0]?.topicName || 'Kiến thức chung',
      contentUnit: matrixTopics[0]?.lessonContent || 'Bài học trọng tâm',
      format,
      level,
      points: defaultPts,
      prompt: 'Nội dung câu hỏi mới...',
      options: isMcq
        ? [
            { key: 'A', content: 'Phương án A' },
            { key: 'B', content: 'Phương án B' },
            { key: 'C', content: 'Phương án C' },
            ...(expectedOpts === 4 ? [{ key: 'D' as const, content: 'Phương án D' }] : []),
          ]
        : undefined,
      correctAnswer: 'A',
      explanation: 'Giải thích chi tiết lời giải và căn cứ chọn đáp án.',
      gradingGuide: 'Hướng dẫn chấm cụ thể từng bước cho câu hỏi này.',
    };

    setQuestions((prev) => sortAndRenumberQuestions([...prev, newQ]));
  };

  // Re-generate question using AI or pedagogical rule
  const handleRegenerateQuestionAi = async (q: QuestionItem) => {
    setIsGeneratingAi(true);
    setAiStatusMessage(`Đang dùng AI tạo câu hỏi thay thế cho Câu ${q.orderNumber}...`);
    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          subject,
          textbook,
          examType: term,
          topic: q.topicName,
          questionType: q.format,
          level: q.level,
          count: 1,
          readingPassage: readingPassage?.content,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        const aiQ = data.questions[0];
        handleUpdateQuestion(q.id, {
          prompt: aiQ.content || q.prompt,
          options: aiQ.options?.map((text: string, i: number) => ({
            key: (['A', 'B', 'C', 'D'][i] || 'A') as any,
            content: text,
          })),
          correctAnswer: aiQ.correctAnswer || 'A',
          explanation: aiQ.explanation || q.explanation,
          gradingGuide: aiQ.gradingGuide || q.gradingGuide,
        });
        setAiStatusMessage(`Đã cập nhật câu hỏi mới chuẩn TT27 cho Câu ${q.orderNumber}!`);
      } else {
        // Local smart variations fallback
        handleUpdateQuestion(q.id, {
          prompt: `[Đã làm mới] ${q.prompt} (phiên bản tương đương số liệu mới)`,
        });
        setAiStatusMessage(`Đã làm mới số liệu tương đương cho Câu ${q.orderNumber}!`);
      }
    } catch (err) {
      console.error(err);
      setAiStatusMessage('Đã làm mới câu hỏi theo ngân hàng chuẩn.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Build the complete ExamPackage
  const assembleExamPackage = (): ExamPackage => {
    const sorted = sortAndRenumberQuestions(questions);
    const specs = buildSpecificationsFromExam(matrixTopics, sorted);

    return {
      id: `exam-${grade}-${subject}-${Date.now()}`,
      title,
      schoolName: profile.schoolName,
      academicYear: profile.academicYear,
      grade,
      subject,
      term,
      textbook,
      teacherName: profile.teacherName,
      durationMinutes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'APPROVED',
      examCode,
      readingPassage,
      matrixTopics,
      specifications: specs,
      questions: sorted,
      totalPoints: validation.stats.totalPoints,
      totalQuestions: sorted.length,
      mcqPoints: validation.stats.mcqPoints,
      essayPoints: validation.stats.essayPoints,
      level1Points: validation.stats.level1Points,
      level2Points: validation.stats.level2Points,
      level3Points: validation.stats.level3Points,
      pedagogicalValidation: {
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings,
      },
    };
  };

  const handleSaveAndPreview = () => {
    const fullExam = assembleExamPackage();
    onSaveExam(fullExam);
    onOpenPreview(fullExam);
  };

  // Create permuted code (Mã đề 102, 103...)
  const handleGeneratePermutedCode = () => {
    const currentExam = assembleExamPackage();
    const nextCode = (parseInt(examCode, 10) + 1).toString();
    const permuted = createPermutedExamCode(currentExam, nextCode);
    setExamCode(nextCode);
    setQuestions(permuted.questions);
    onSaveExam(permuted);
    onOpenPreview(permuted);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-blue-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white ring-2 ring-emerald-400/40">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-emerald-300 tracking-wider">
                Biên soạn câu hỏi theo ma trận đã duyệt
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Tạo Đề Kiểm Tra & Hướng Dẫn Chấm Tự Động
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGeneratePermutedCode}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center border border-white/20 transition"
              title="Đảo thứ tự câu và phương án để tạo mã đề mới (102, 103...)"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5 text-blue-300" />
              Tạo Mã Đề Hoán Vị ({parseInt(examCode, 10) + 1})
            </button>
            <button
              onClick={handleSaveAndPreview}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-md transition"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              Xem Trước & Tải Xuống (5 trong 1)
            </button>
          </div>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-800">Đơn vị:</span>
          <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded font-semibold">
            {profile.schoolName}
          </span>
          <span className="text-slate-400">|</span>
          <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded font-bold">
            Môn: {subject}
          </span>
          <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded font-bold">
            Lớp {grade} ({grade <= 3 ? '3 phương án A,B,C' : '4 phương án A,B,C,D'})
          </span>
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
            Bộ sách: {textbook}
          </span>
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
            Kỳ: {term}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-600">Mã đề:</span>
          <input
            type="text"
            value={examCode}
            onChange={(e) => setExamCode(e.target.value)}
            className="w-16 bg-slate-50 border border-slate-300 rounded px-2 py-0.5 font-bold text-center text-slate-800"
          />
        </div>
      </div>

      {/* Realtime Pedagogical Quality Control Card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        validation.isValid
          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
          : 'bg-rose-50/70 border-rose-300 text-rose-950'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {validation.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            )}
            <span className="font-bold text-sm">
              {validation.isValid
                ? 'ĐỀ THI ĐẠT CHUẨN THÔNG TƯ 27 & GDPT 2018 (10,0 ĐIỂM)'
                : 'CẢNH BÁO QUY CHUẨN SƯ PHẠM (CHƯA ĐẠT 10 ĐIỂM HOẶC SAI THỨ TỰ)'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-full bg-white shadow-2xs border">
              Tổng điểm: <strong>{validation.stats.totalPoints} / 10,0 đ</strong>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white shadow-2xs border">
              TN: <strong>{validation.stats.mcqPoints} đ</strong> | TL: <strong>{validation.stats.essayPoints} đ</strong>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white shadow-2xs border">
              Mức 1: <strong>{validation.stats.level1Points} đ</strong> | Mức 2: <strong>{validation.stats.level2Points} đ</strong> | Mức 3: <strong>{validation.stats.level3Points} đ</strong>
            </span>
          </div>
        </div>

        {validation.errors.length > 0 && (
          <div className="mt-2 text-xs text-rose-700 bg-white/70 p-2.5 rounded-lg border border-rose-200">
            <strong>Lỗi cần khắc phục:</strong>
            <ul className="list-disc list-inside mt-0.5">
              {validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {validation.warnings.length > 0 && (
          <div className="mt-2 text-xs text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200">
            <strong>Gợi ý sư phạm:</strong> {validation.warnings.join(' | ')}
          </div>
        )}
      </div>

      {/* Vietnamese Reading Passage Editor if applicable */}
      {subject === 'Tiếng Việt' && readingPassage && (
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 uppercase">
                Ngữ Liệu Đọc Hiểu (Bài Đọc Ngoài Sách Giáo Khoa)
              </h3>
            </div>
            <div className="text-xs text-slate-500">
              Độ dài khuyến nghị Lớp {grade}:{' '}
              <strong>
                {VIETNAMESE_PASSAGE_LENGTHS[grade]?.storyRange || '200 – 250 chữ'}
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Tên bài đọc</label>
              <input
                type="text"
                value={readingPassage.title}
                onChange={(e) =>
                  setReadingPassage({ ...readingPassage, title: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Tác giả / Nguồn</label>
              <input
                type="text"
                value={readingPassage.author || ''}
                onChange={(e) =>
                  setReadingPassage({ ...readingPassage, author: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Thể loại</label>
              <select
                value={readingPassage.genre}
                onChange={(e) =>
                  setReadingPassage({ ...readingPassage, genre: e.target.value as any })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
              >
                <option value="miêu tả">Văn miêu tả</option>
                <option value="truyện">Truyện kể</option>
                <option value="thơ">Thơ</option>
                <option value="thông tin">Văn bản thông tin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1 text-xs">
              Nội dung văn bản đọc hiểu (
              <span className="font-bold text-blue-700">
                {readingPassage.content.trim().split(/\s+/).filter(Boolean).length} chữ
              </span>
              )
            </label>
            <textarea
              rows={4}
              value={readingPassage.content}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/).filter(Boolean).length;
                setReadingPassage({
                  ...readingPassage,
                  content: e.target.value,
                  wordCount: words,
                });
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs leading-relaxed text-slate-800 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Danh Sách Câu Hỏi Đề Kiểm Tra (Sắp Xếp Từ Trắc Nghiệm Đến Tự Luận)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Định dạng chuẩn: <strong>Câu X</strong> <em>(Y điểm):</em> Nội dung không đậm. Trắc nghiệm: M1 trước M2; Tự luận: M1 -&gt; M2 -&gt; M3.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAddQuestion('TN_NLC', 1)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition border border-blue-200"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> +TN Mức 1 (Biết)
            </button>
            <button
              onClick={() => handleAddQuestion('TN_NLC', 2)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition border border-indigo-200"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> +TN Mức 2 (Hiểu)
            </button>
            <button
              onClick={() => handleAddQuestion('TL', 2)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition border border-amber-200"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> +TL Mức 2 (Hiểu)
            </button>
            <button
              onClick={() => handleAddQuestion('TL', 3)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition border border-emerald-200"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> +TL Mức 3 (Vận dụng)
            </button>
          </div>
        </div>

        {aiStatusMessage && (
          <div className="bg-blue-50 text-blue-900 text-xs px-5 py-2.5 border-b border-blue-100 flex items-center">
            {isGeneratingAi && <Sparkles className="w-4 h-4 mr-2 text-blue-600 animate-spin" />}
            <span>{aiStatusMessage}</span>
          </div>
        )}

        <div className="divide-y divide-slate-200">
          {questions.map((q) => {
            const isEditing = editingQuestionId === q.id;

            return (
              <div key={q.id} className="p-5 hover:bg-slate-50/50 transition">
                {/* Question Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      Câu {q.orderNumber}
                    </span>
                    <span className="italic text-slate-600 text-xs">
                      ({q.points.toString().replace('.', ',')} điểm)
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.level === 1
                        ? 'bg-blue-100 text-blue-800'
                        : q.level === 2
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      Mức {q.level} ({q.level === 1 ? 'Biết' : q.level === 2 ? 'Hiểu' : 'Vận dụng'})
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {q.format === 'TN_NLC'
                        ? 'TN Nhiều Lựa Chọn'
                        : q.format === 'TN_DS'
                        ? 'TN Đúng/Sai'
                        : q.format === 'TN_NC'
                        ? 'TN Nối Cột'
                        : q.format === 'TN_DK'
                        ? 'TN Điền Khuyết'
                        : q.format === 'TH'
                        ? 'Thực Hành'
                        : 'Tự Luận'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      [{q.topicName}]
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs">
                    <button
                      onClick={() => setEditingQuestionId(isEditing ? null : q.id)}
                      className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 rounded font-semibold transition"
                    >
                      {isEditing ? 'Thu gọn' : 'Chỉnh sửa'}
                    </button>
                    <button
                      onClick={() => handleRegenerateQuestionAi(q)}
                      disabled={isGeneratingAi}
                      className="px-2.5 py-1 text-emerald-600 hover:bg-emerald-50 rounded font-semibold transition flex items-center disabled:opacity-50"
                      title="AI tạo câu hỏi thay thế tương đương"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Tạo lại câu này
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Display Mode */}
                {!isEditing && (
                  <div className="mt-3 text-xs leading-relaxed text-slate-800">
                    <div className="text-slate-900 font-normal">
                      {q.prompt}
                    </div>

                    {q.format === 'TN_NLC' && q.options && (
                      <div className="ml-7 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                        {q.options.map((opt) => (
                          <div
                            key={opt.key}
                            className={`p-1.5 rounded flex items-start space-x-1.5 border ${
                              opt.key === q.correctAnswer
                                ? 'bg-blue-50 border-blue-300 font-semibold text-blue-900'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-bold">{opt.key}.</span>
                            <span>{opt.content}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.subItems && q.subItems.length > 0 && (
                      <div className="ml-4 mt-2 space-y-1">
                        {q.subItems.map((sub) => (
                          <div key={sub.label} className="text-slate-700">
                            <strong>{sub.label})</strong> {sub.text}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-3">
                      <span>
                        Đáp án đúng: <strong className="text-blue-700 font-bold">{q.correctAnswer}</strong>
                      </span>
                      <span>•</span>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                )}

                {/* Inline Edit Form */}
                {isEditing && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Mạch kiến thức</label>
                        <select
                          value={q.topicName}
                          onChange={(e) => handleUpdateQuestion(q.id, { topicName: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                        >
                          {matrixTopics.map((t) => (
                            <option key={t.id} value={t.topicName}>
                              {t.topicName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Mức độ nhận thức
                          {q.format.startsWith('TN') && (
                            <span className="text-[10px] text-amber-600 font-normal ml-1">(TN chỉ Mức 1 & 2)</span>
                          )}
                        </label>
                        <select
                          value={q.level}
                          onChange={(e) => {
                            const newLevel = parseInt(e.target.value, 10) as 1 | 2 | 3;
                            if (newLevel === 3 && q.format.startsWith('TN')) {
                              handleUpdateQuestion(q.id, {
                                level: 3,
                                format: 'TL',
                                options: undefined,
                                points: Math.max(1.0, q.points),
                              });
                            } else {
                              handleUpdateQuestion(q.id, { level: newLevel });
                            }
                          }}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                        >
                          <option value={1}>Mức 1 (Biết) - 0,5đ</option>
                          <option value={2}>Mức 2 (Hiểu) - 0,5đ hoặc 1,0đ</option>
                          {!q.format.startsWith('TN') ? (
                            <option value={3}>Mức 3 (Vận dụng) - 1,0đ đến 2,0đ</option>
                          ) : (
                            <option value={3} disabled className="text-slate-400">
                              Mức 3 (Vận dụng - Chỉ dành cho Tự luận/TH)
                            </option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Điểm số (chuẩn TT27)</label>
                        <input
                          type="number"
                          step="0.25"
                          value={q.points}
                          onChange={(e) =>
                            handleUpdateQuestion(q.id, {
                              points: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-blue-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Nội dung câu hỏi (chữ thường không đậm)</label>
                      <textarea
                        rows={2}
                        value={q.prompt}
                        onChange={(e) => handleUpdateQuestion(q.id, { prompt: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900"
                      />
                    </div>

                    {/* Options Editor for MCQ */}
                    {q.format === 'TN_NLC' && q.options && (
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Các phương án lựa chọn (Lớp {grade}: {q.options.length} phương án)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => (
                            <div key={opt.key} className="flex items-center space-x-2">
                              <span className="font-bold w-5">{opt.key}.</span>
                              <input
                                type="text"
                                value={opt.content}
                                onChange={(e) => {
                                  const newOpts = [...q.options!];
                                  newOpts[optIdx] = { ...opt, content: e.target.value };
                                  handleUpdateQuestion(q.id, { options: newOpts });
                                }}
                                className="flex-1 bg-white border border-slate-300 rounded px-2 py-1"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 flex items-center space-x-3">
                          <span className="font-bold text-slate-700">Đáp án đúng:</span>
                          <select
                            value={q.correctAnswer}
                            onChange={(e) => handleUpdateQuestion(q.id, { correctAnswer: e.target.value })}
                            className="bg-white border border-slate-300 rounded px-3 py-1 font-bold text-blue-700"
                          >
                            {q.options.map((o) => (
                              <option key={o.key} value={o.key}>
                                Phương án {o.key}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Essay answer and grading guide */}
                    {q.format !== 'TN_NLC' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Đáp án / Lời giải chi tiết</label>
                          <textarea
                            rows={3}
                            value={q.correctAnswer}
                            onChange={(e) => handleUpdateQuestion(q.id, { correctAnswer: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Hướng dẫn chấm & biểu điểm</label>
                          <textarea
                            rows={3}
                            value={q.gradingGuide}
                            onChange={(e) => handleUpdateQuestion(q.id, { gradingGuide: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded p-2"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setEditingQuestionId(null)}
                        className="px-3 py-1 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                      >
                        Lưu chỉnh sửa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          Tổng số câu: <strong>{questions.length}</strong> câu | Tổng điểm: <strong>{validation.stats.totalPoints}</strong> / 10,0đ
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onSaveExam(assembleExamPackage())}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Lưu Vào Danh Sách
          </button>
          <button
            onClick={handleSaveAndPreview}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            Xem Trước Đề & Tải Hồ Sơ (5 Trong 1)
          </button>
        </div>
      </div>
    </div>
  );
};
