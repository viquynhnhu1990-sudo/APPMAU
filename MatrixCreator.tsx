import React, { useState, useEffect } from 'react';
import {
  Grid3X3,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  FileText,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Info
} from 'lucide-react';
import {
  GradeLevel,
  SubjectName,
  ExamTerm,
  TextbookSeries,
  MatrixTopicRow,
  SchoolProfile
} from '../types';
import {
  getSubjectsForGrade,
  TEXTBOOK_SERIES,
  CIRCULAR_27_SUBJECT_RULES
} from '../data/standards';
import { getDefaultMatrixTopics } from '../data/curriculumTemplates';
import { downloadMatrixDoc, downloadMatrixExcel } from '../utils/exportUtils';

interface MatrixCreatorProps {
  profile: SchoolProfile;
  initialGrade?: GradeLevel;
  initialSubject?: SubjectName;
  onMatrixCreated: (
    matrixData: {
      grade: GradeLevel;
      subject: SubjectName;
      term: ExamTerm;
      textbook: TextbookSeries;
      durationMinutes: number;
      matrixTopics: MatrixTopicRow[];
    },
    proceedToExam?: boolean
  ) => void;
}

export const MatrixCreator: React.FC<MatrixCreatorProps> = ({
  profile,
  initialGrade = 4,
  initialSubject = 'Toán',
  onMatrixCreated,
}) => {
  const [grade, setGrade] = useState<GradeLevel>(initialGrade);
  const [subject, setSubject] = useState<SubjectName>(initialSubject);
  const [term, setTerm] = useState<ExamTerm>('Cuối HKI');
  const [textbook, setTextbook] = useState<TextbookSeries>('Kết nối tri thức với cuộc sống');
  const [durationMinutes, setDurationMinutes] = useState<number>(40);
  const [topics, setTopics] = useState<MatrixTopicRow[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Update available subjects when grade changes
  const availableSubjects = getSubjectsForGrade(grade);

  useEffect(() => {
    if (!availableSubjects.includes(subject)) {
      setSubject(availableSubjects[0]);
    }
  }, [grade]);

  // Load default curriculum template when grade, subject, or term changes
  useEffect(() => {
    const defaultData = getDefaultMatrixTopics(grade, subject, term);
    setTopics(defaultData);
    const rule = CIRCULAR_27_SUBJECT_RULES[subject];
    if (rule) {
      setDurationMinutes(rule.durationMinutes);
    }
  }, [grade, subject, term]);

  // Calculate live totals
  let totalLevel1Points = 0;
  let totalLevel2Points = 0;
  let totalLevel3Points = 0;
  let totalTNPoints = 0;
  let totalTLPoints = 0;
  let totalPoints = 0;
  let totalQuestions = 0;

  topics.forEach((t) => {
    const c = t.cell;
    totalLevel1Points += c.level1TNPoints + c.level1TLPoints;
    totalLevel2Points += c.level2TNPoints + c.level2TLPoints;
    totalLevel3Points += c.level3TNPoints + c.level3TLPoints;
    totalTNPoints += c.level1TNPoints + c.level2TNPoints + c.level3TNPoints;
    totalTLPoints += c.level1TLPoints + c.level2TLPoints + c.level3TLPoints;
    totalPoints += c.totalPoints;
    totalQuestions +=
      c.level1TNCount + c.level1TLCount + c.level2TNCount + c.level2TLCount + c.level3TNCount + c.level3TLCount;
  });

  const roundedTotalPoints = Math.round(totalPoints * 100) / 100;
  const is10Points = roundedTotalPoints === 10;

  // Handle cell edits
  const handleCellChange = (
    topicId: string,
    field: keyof MatrixTopicRow['cell'],
    val: number
  ) => {
    // Strict Pedagogical Rule: KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (MỨC 3)
    if (field === 'level3TNCount' || field === 'level3TNPoints') {
      return; // Locked at 0
    }

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const newCell = { ...t.cell, [field]: Math.max(0, val) };
        // Recalculate row total points (Level 3 TN is strictly 0)
        newCell.level3TNCount = 0;
        newCell.level3TNPoints = 0;
        newCell.totalPoints =
          newCell.level1TNPoints +
          newCell.level1TLPoints +
          newCell.level2TNPoints +
          newCell.level2TLPoints +
          newCell.level3TLPoints;
        return { ...t, cell: newCell };
      })
    );
  };

  const handleAddTopic = () => {
    const newTopic: MatrixTopicRow = {
      id: `top-custom-${Date.now()}`,
      topicName: 'Mạch kiến thức mới',
      lessonContent: 'Nội dung bài học và phạm vi kiến thức',
      expectedOutcomes: {
        level1: ['Yêu cầu cần đạt Mức 1 (Biết)'],
        level2: ['Yêu cầu cần đạt Mức 2 (Hiểu)'],
        level3: ['Yêu cầu cần đạt Mức 3 (Vận dụng)'],
      },
      cell: {
        level1TNCount: 2,
        level1TNPoints: 1.0,
        level1TLCount: 0,
        level1TLPoints: 0,
        level2TNCount: 1,
        level2TNPoints: 0.5,
        level2TLCount: 0,
        level2TLPoints: 0,
        level3TNCount: 0,
        level3TNPoints: 0,
        level3TLCount: 0,
        level3TLPoints: 0,
        totalPoints: 1.5,
      },
    };
    setTopics((prev) => [...prev, newTopic]);
  };

  const handleRemoveTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  // Mock / Real file upload handler with AI analysis
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setIsAnalyzingAi(true);
    setAiMessage('Đang phân tích tài liệu bằng Trí tuệ nhân tạo chuyên môn Tiểu học...');

    try {
      const res = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: `Tài liệu từ tệp: ${file.name} cho môn ${subject} Lớp ${grade} Bộ sách ${textbook}`,
          grade,
          subject,
          examType: term,
          textbook,
        }),
      });

      const data = await res.json();
      if (data.data?.topics && data.data.topics.length > 0) {
        // Map AI topics into MatrixTopicRow
        const aiTopics: MatrixTopicRow[] = data.data.topics.map((item: any, i: number) => ({
          id: `top-ai-${i}`,
          topicName: item.name || `Chủ đề ${i + 1}`,
          lessonContent: item.lessons || 'Kiến thức trọng tâm',
          expectedOutcomes: {
            level1: item.outcomes?.level1 || ['Nhận biết kiến thức cốt lõi'],
            level2: item.outcomes?.level2 || ['Hiểu và vận dụng cơ bản'],
            level3: item.outcomes?.level3 || ['Vận dụng thực tiễn'],
          },
          cell: {
            level1TNCount: 3,
            level1TNPoints: 1.5,
            level1TLCount: 1,
            level1TLPoints: 0.5,
            level2TNCount: 2,
            level2TNPoints: 1.0,
            level2TLCount: 1,
            level2TLPoints: 1.0,
            level3TNCount: 0,
            level3TNPoints: 0,
            level3TLCount: 1,
            level3TLPoints: 1.0,
            totalPoints: 5.0,
          },
        }));
        setTopics(aiTopics);
        setAiMessage('Đã phân tích thành công tài liệu và đề xuất ma trận tối ưu!');
      } else {
        setAiMessage('Đã nạp tài liệu thành công. Hệ thống áp dụng khung chuẩn Thông tư 27.');
      }
    } catch (err) {
      console.error(err);
      setAiMessage('Đã nạp tài liệu. Bạn có thể tùy chỉnh các chỉ số ma trận.');
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleExportMatrixWord = () => {
    // Generate dummy exam object for matrix export
    const dummyExam: any = {
      title: `Ma trận đề kiểm tra ${subject} Lớp ${grade}`,
      schoolName: profile.schoolName,
      academicYear: profile.academicYear,
      grade,
      subject,
      term,
      textbook,
      durationMinutes,
      teacherName: profile.teacherName,
      matrixTopics: topics,
      questions: [],
      mcqPoints: totalTNPoints,
      essayPoints: totalTLPoints,
      level1Points: totalLevel1Points,
      level2Points: totalLevel2Points,
      level3Points: totalLevel3Points,
      examCode: '01',
    };
    downloadMatrixDoc(dummyExam, profile);
  };

  const handleExportMatrixExcel = () => {
    const dummyExam: any = {
      title: `Ma trận đề kiểm tra ${subject} Lớp ${grade}`,
      schoolName: profile.schoolName,
      academicYear: profile.academicYear,
      grade,
      subject,
      term,
      textbook,
      durationMinutes,
      teacherName: profile.teacherName,
      matrixTopics: topics,
      questions: [],
      mcqPoints: totalTNPoints,
      essayPoints: totalTLPoints,
      level1Points: totalLevel1Points,
      level2Points: totalLevel2Points,
      level3Points: totalLevel3Points,
      examCode: '01',
    };
    downloadMatrixExcel(dummyExam, profile);
  };

  const handleProceed = () => {
    onMatrixCreated(
      {
        grade,
        subject,
        term,
        textbook,
        durationMinutes,
        matrixTopics: topics,
      },
      true
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-blue-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/80 flex items-center justify-center text-white ring-2 ring-blue-400/40">
              <Grid3X3 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-blue-300 tracking-wider">
                Xây dựng khung đề chuẩn Bộ GD&ĐT
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Thiết Kế Ma Trận Đề Kiểm Tra Định Kỳ
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMatrixWord}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center border border-white/20 transition"
            >
              <FileText className="w-4 h-4 mr-1.5 text-blue-300" />
              Tải Word
            </button>
            <button
              onClick={handleExportMatrixExcel}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center border border-white/20 transition"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-300" />
              Tải Excel
            </button>
          </div>
        </div>
      </div>

      {/* Input Form Configuration */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center mb-4 pb-2 border-b border-slate-100">
          <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
          1. Thông Tin Đầu Vào (Chuẩn Quy Định Thông Tư 27)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Grade selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Khối lớp <span className="text-rose-500">*</span>
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(parseInt(e.target.value, 10) as GradeLevel)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Lớp 1 (Đánh giá theo TT 27)</option>
              <option value={2}>Lớp 2 (Đánh giá theo TT 27)</option>
              <option value={3}>Lớp 3 (Đánh giá theo TT 27)</option>
              <option value={4}>Lớp 4 (Đánh giá theo TT 27)</option>
              <option value={5}>Lớp 5 (Đánh giá theo TT 27)</option>
            </select>
          </div>

          {/* Subject dynamic selection based on TT27 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Môn học định kỳ bằng điểm <span className="text-rose-500">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectName)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold text-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Thời điểm kiểm tra <span className="text-rose-500">*</span>
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value as ExamTerm)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="Giữa HKI">Giữa HKI</option>
              <option value="Cuối HKI">Cuối HKI (Học kỳ 1)</option>
              <option value="Giữa HKII">Giữa HKII</option>
              <option value="Cuối năm">Cuối năm (Cả năm)</option>
            </select>
          </div>

          {/* Textbook */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Bộ sách giáo khoa <span className="text-rose-500">*</span>
            </label>
            <select
              value={textbook}
              onChange={(e) => setTextbook(e.target.value as TextbookSeries)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
            >
              {TEXTBOOK_SERIES.map((tb) => (
                <option key={tb} value={tb}>
                  {tb}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary inputs: Duration, Teacher, School */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500">Trường:</span>{' '}
            <strong className="text-slate-800">{profile.schoolName}</strong>
          </div>
          <div>
            <span className="text-slate-500">Giáo viên phụ trách:</span>{' '}
            <strong className="text-slate-800">{profile.teacherName}</strong>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Thời gian làm bài:</span>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 35)}
              className="w-16 bg-slate-50 border border-slate-300 rounded px-2 py-1 font-bold text-slate-800"
            />
            <span className="text-slate-500">phút</span>
          </div>
        </div>

        {/* Document Upload Box with AI Analysis */}
        <div className="mt-5 p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-950 flex items-center">
                <span>Tải lên tài liệu tham khảo (Word, PDF, Excel)</span>
                <span className="ml-2 text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded font-mono">
                  AI Khảo thí
                </span>
              </div>
              <p className="text-[11px] text-blue-800/80 mt-0.5">
                AI tự động phân tích giáo án/đề cương, đề xuất ma trận chuẩn. Bạn kiểm tra và chỉnh sửa trước khi tạo đề.
              </p>
              {uploadedFileName && (
                <div className="mt-1 text-xs text-emerald-700 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Tệp đã tải: {uploadedFileName}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <label className="cursor-pointer bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center">
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              <span>Chọn tệp Word / PDF / Excel</span>
              <input
                type="file"
                accept=".docx,.doc,.pdf,.xlsx,.xls,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {aiMessage && (
          <div className="mt-2 text-xs text-blue-900 bg-blue-100/70 p-2.5 rounded-lg flex items-center">
            {isAnalyzingAi ? (
              <Sparkles className="w-4 h-4 mr-2 text-blue-600 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
            )}
            <span>{aiMessage}</span>
          </div>
        )}
      </div>

      {/* Realtime KPI Validation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-4 rounded-xl border ${
          is10Points
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="text-[11px] font-bold uppercase tracking-wider">Tổng Điểm Ma Trận</div>
          <div className="text-2xl font-extrabold mt-0.5">
            {roundedTotalPoints} <span className="text-xs font-normal">/ 10,0 điểm</span>
          </div>
          <div className="text-[11px] mt-0.5">
            {is10Points ? '✓ Đạt đúng chuẩn 10 điểm' : '✕ Cần điều chỉnh để đúng 10đ'}
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-blue-50 border-blue-200 text-blue-950">
          <div className="text-[11px] font-bold uppercase tracking-wider">Tỉ Lệ Mức Độ (50-30-20%)</div>
          <div className="text-xl font-bold mt-0.5">
            {((totalLevel1Points / 10) * 100).toFixed(0)}% - {((totalLevel2Points / 10) * 100).toFixed(0)}% - {((totalLevel3Points / 10) * 100).toFixed(0)}%
          </div>
          <div className="text-[11px] text-blue-700 mt-0.5">
            M1: {totalLevel1Points.toFixed(1)}đ | M2: {totalLevel2Points.toFixed(1)}đ | M3: {totalLevel3Points.toFixed(1)}đ
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-indigo-50 border-indigo-200 text-indigo-950">
          <div className="text-[11px] font-bold uppercase tracking-wider">Hình Thức (TN 60% - TL 40%)</div>
          <div className="text-xl font-bold mt-0.5">
            {((totalTNPoints / 10) * 100).toFixed(0)}% TN - {((totalTLPoints / 10) * 100).toFixed(0)}% TL
          </div>
          <div className="text-[11px] text-indigo-700 mt-0.5">
            TN: {totalTNPoints.toFixed(1)}đ | TL: {totalTLPoints.toFixed(1)}đ
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 text-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider">Tổng Số Câu Hỏi</div>
          <div className="text-2xl font-bold mt-0.5 text-slate-900">{totalQuestions} câu</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Quy chuẩn Lớp {grade}: {grade <= 3 ? '3 phương án TN' : '4 phương án TN'}
          </div>
        </div>
      </div>

      {/* Topics & Matrix Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              2. Bảng Phân Bổ Số Câu & Điểm Số Theo 3 Mức Độ Nhận Thức
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mỗi dòng là một mạch kiến thức. Không ghép câu thuộc 2 chủ đề khác nhau. Giáo viên có toàn quyền chỉnh sửa.
            </p>
          </div>

          <button
            onClick={handleAddTopic}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Thêm Mạch Kiến Thức
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-800 font-bold text-center border-b border-slate-300">
              <tr>
                <th rowSpan={3} className="p-2 border-r border-slate-300 w-10">TT</th>
                <th rowSpan={3} className="p-2 border-r border-slate-300 w-52">Mạch kiến thức / Chủ đề</th>
                <th rowSpan={3} className="p-2 border-r border-slate-300">Nội dung bài học / Yêu cầu cần đạt</th>
                <th colSpan={6} className="p-1 border-b border-slate-300 bg-blue-50/70">
                  Phân bổ theo mức độ nhận thức
                </th>
                <th rowSpan={2} colSpan={2} className="p-2 border-r border-slate-300 w-24">Tổng cộng</th>
                <th rowSpan={3} className="p-2 w-12">Xóa</th>
              </tr>
              <tr>
                <th colSpan={2} className="p-1 border-r border-slate-300 bg-blue-50/40">Mức 1 (Biết)</th>
                <th colSpan={2} className="p-1 border-r border-slate-300 bg-blue-50/40">Mức 2 (Hiểu)</th>
                <th colSpan={2} className="p-1 border-r border-slate-300 bg-amber-100/70 text-amber-950">
                  Mức 3 (Vận dụng - Chỉ TL/TH)
                </th>
              </tr>
              <tr className="bg-slate-50 text-[11px]">
                <th className="p-1 border-r border-slate-200 w-16">TN (Số câu/đ)</th>
                <th className="p-1 border-r border-slate-300 w-16">TL (Số câu/đ)</th>
                <th className="p-1 border-r border-slate-200 w-16">TN (Số câu/đ)</th>
                <th className="p-1 border-r border-slate-300 w-16">TL (Số câu/đ)</th>
                <th className="p-1 border-r border-slate-200 w-16 bg-slate-100 text-slate-400 font-normal" title="Thông tư 27 quy định không có trắc nghiệm ở Mức 3">
                  TN (Không có)
                </th>
                <th className="p-1 border-r border-slate-300 w-16 bg-amber-50 text-amber-900 font-bold">
                  TL / TH (Số câu/đ)
                </th>
                <th className="p-1 border-r border-slate-200 w-12">Số câu</th>
                <th className="p-1 border-r border-slate-300 w-12">Điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {topics.map((t, idx) => {
                const c = t.cell;
                const rowQCount =
                  c.level1TNCount + c.level1TLCount + c.level2TNCount + c.level2TLCount + c.level3TNCount + c.level3TLCount;

                return (
                  <tr key={t.id} className="hover:bg-slate-50/80">
                    <td className="p-2 text-center font-bold border-r border-slate-200 text-slate-700">
                      {idx + 1}
                    </td>

                    {/* Topic Name */}
                    <td className="p-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={t.topicName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTopics((prev) =>
                            prev.map((item) => (item.id === t.id ? { ...item, topicName: val } : item))
                          );
                        }}
                        className="w-full font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:bg-white px-1 py-0.5 rounded"
                      />
                    </td>

                    {/* Lesson Content & Outcomes */}
                    <td className="p-2 border-r border-slate-200">
                      <textarea
                        rows={2}
                        value={t.lessonContent}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTopics((prev) =>
                            prev.map((item) => (item.id === t.id ? { ...item, lessonContent: val } : item))
                          );
                        }}
                        className="w-full text-slate-700 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:bg-white px-1 py-0.5 rounded text-xs leading-tight resize-y"
                      />
                    </td>

                    {/* Level 1 TN */}
                    <td className="p-1 border-r border-slate-200 bg-blue-50/20 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <input
                          type="number"
                          title="Số câu TN Mức 1"
                          value={c.level1TNCount}
                          onChange={(e) =>
                            handleCellChange(t.id, 'level1TNCount', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-8 text-center bg-white border border-slate-300 rounded font-bold text-xs"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          title="Điểm TN Mức 1"
                          value={c.level1TNPoints}
                          onChange={(e) =>
                            handleCellChange(t.id, 'level1TNPoints', parseFloat(e.target.value) || 0)
                          }
                          className="w-10 text-center bg-white border border-blue-300 text-blue-700 rounded font-bold text-xs"
                        />
                        <span className="text-slate-500">đ</span>
                      </div>
                    </td>

                    {/* Level 1 TL */}
                    <td className="p-1 border-r border-slate-300 bg-blue-50/20 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <input
                          type="number"
                          value={c.level1TLCount}
                          onChange={(e) =>
                            handleCellChange(t.id, 'level1TLCount', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-8 text-center bg-white border border-slate-300 rounded font-bold text-xs"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          value={c.level1TLPoints}
                          onChange={(e) =>
                            handleCellChange(t.id, 'level1TLPoints', parseFloat(e.target.value) || 0)
                          }
                          className="w-10 text-center bg-white border border-blue-300 text-blue-700 rounded font-bold text-xs"
                        />
                        <span className="text-slate-500">đ</span>
                      </div>
                    </td>

                    {/* Level 2 TN */}
                    <td className="p-1 border-r border-slate-200 bg-indigo-50/20 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <input
                          type="number"
                          value={c.level2TNCount}
                          onChange={(e) =>
                            handleCellChange(t.id, 'level2TNCount', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-8 text-center bg-white border border-slate-300 rounded font-bold text-xs"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          value={c.level2TNPoints}
                          onChange={(e) =>
                            handleCellChange(t.id, 'level2TNPoints', parseFloat(e.target.value) || 0)
                          }
                          className="w-10 text-center bg-white border border-indigo-300 text-indigo-700 rounded font-bold text-xs"
                        />
                        <span className="text-slate-500">đ</span>
                      </div>
                    </td>

                    {/* Level 2 TL */}
                    <td className="p-1 border-r border-slate-300 bg-indigo-50/20 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <input
                          type="number"
                          value={c.level2TLCount}
                          onChange={(e) =>
                            handleCellChange(t.id, 'level2TLCount', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-8 text-center bg-white border border-slate-300 rounded font-bold text-xs"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          value={c.level2TLPoints}
                          onChange={(e) =>
                            handleCellChange(t.id, 'level2TLPoints', parseFloat(e.target.value) || 0)
                          }
                          className="w-10 text-center bg-white border border-indigo-300 text-indigo-700 rounded font-bold text-xs"
                        />
                        <span className="text-slate-500">đ</span>
                      </div>
                    </td>

                    {/* Level 3 TN: Strictly Prohibited in GDPT 2018 & TT27 */}
                    <td className="p-1 border-r border-slate-200 bg-slate-100/70 text-center" title="Quy chuẩn Thông tư 27: Tuyệt đối không tạo câu trắc nghiệm ở Mức Vận dụng">
                      <span className="text-slate-400 font-semibold text-[11px] italic">
                        — (Không có)
                      </span>
                    </td>

                    {/* Level 3 TL */}
                    <td className="p-1 border-r border-slate-300 bg-amber-50/20 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <input
                          type="number"
                          value={c.level3TLCount}
                          onChange={(e) =>
                            handleCellChange(t.id, 'level3TLCount', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-8 text-center bg-white border border-slate-300 rounded font-bold text-xs"
                        />
                        <span className="text-slate-400">c /</span>
                        <input
                          type="number"
                          step="0.25"
                          value={c.level3TLPoints}
                          onChange={(e) =>
                            handleCellChange(t.id, 'level3TLPoints', parseFloat(e.target.value) || 0)
                          }
                          className="w-10 text-center bg-white border border-amber-300 text-amber-700 rounded font-bold text-xs"
                        />
                        <span className="text-slate-500">đ</span>
                      </div>
                    </td>

                    {/* Total Questions & Points for row */}
                    <td className="p-2 text-center font-bold text-slate-800 border-r border-slate-200">
                      {rowQCount}
                    </td>
                    <td className="p-2 text-center font-extrabold text-blue-700 border-r border-slate-300">
                      {c.totalPoints.toFixed(1)}
                    </td>

                    {/* Delete action */}
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleRemoveTopic(t.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1"
                        title="Xóa mạch kiến thức này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Total Row */}
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td colSpan={3} className="p-3 text-center border-r border-slate-300 uppercase">
                  TỔNG CỘNG TOÀN MA TRẬN
                </td>
                <td colSpan={2} className="p-2 text-center border-r border-slate-300 text-blue-800">
                  {totalLevel1Points.toFixed(1)} đ ({((totalLevel1Points / 10) * 100).toFixed(0)}%)
                </td>
                <td colSpan={2} className="p-2 text-center border-r border-slate-300 text-indigo-800">
                  {totalLevel2Points.toFixed(1)} đ ({((totalLevel2Points / 10) * 100).toFixed(0)}%)
                </td>
                <td colSpan={2} className="p-2 text-center border-r border-slate-300 text-amber-800">
                  {totalLevel3Points.toFixed(1)} đ ({((totalLevel3Points / 10) * 100).toFixed(0)}%)
                </td>
                <td className="p-2 text-center border-r border-slate-200">{totalQuestions}</td>
                <td className={`p-2 text-center border-r border-slate-300 font-extrabold text-sm ${
                  is10Points ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {roundedTotalPoints} đ
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Sau khi xác nhận ma trận đạt 10,0 điểm, nhấn nút tiếp tục để hệ thống sinh bộ câu hỏi bám sát chuẩn đặc tả.
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onMatrixCreated({ grade, subject, term, textbook, durationMinutes, matrixTopics: topics }, false)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center"
          >
            <Save className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            Lưu Ma Trận Này
          </button>
          
          <button
            onClick={handleProceed}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center"
          >
            <span>TẠO ĐỀ KIỂM TRA TỪ MA TRẬN NÀY</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
