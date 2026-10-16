import React, { useState } from 'react';
import {
  X,
  FileDown,
  Printer,
  FileText,
  FileSpreadsheet,
  Archive,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HelpCircle,
  Award,
  Clock,
  BookOpen
} from 'lucide-react';
import { ExamPackage, SchoolProfile } from '../types';
import {
  downloadMatrixDoc,
  downloadMatrixExcel,
  downloadSpecificationDoc,
  downloadExamPaperDoc,
  downloadAnswerDoc,
  downloadFullPackageZip,
  printExamDirectly,
} from '../utils/exportUtils';

interface ExamPreviewModalProps {
  exam: ExamPackage;
  profile: SchoolProfile;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (examId: string) => void;
}

export const ExamPreviewModal: React.FC<ExamPreviewModalProps> = ({
  exam,
  profile,
  isOpen,
  onClose,
  onApprove,
}) => {
  const [activeTab, setActiveTab] = useState<'paper' | 'answer' | 'matrix' | 'spec' | 'audit'>('paper');
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleZipDownload = async () => {
    try {
      setIsZipping(true);
      await downloadFullPackageZip(exam, profile);
    } catch (err) {
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };

  const mcqs = exam.questions.filter((q) => q.format.startsWith('TN'));
  const essays = exam.questions.filter((q) => !q.format.startsWith('TN'));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-600/80 text-blue-100 uppercase tracking-wide">
                Môn: {exam.subject} - Lớp {exam.grade}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                Mã đề: {exam.examCode}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {exam.term} ({profile.academicYear})
              </span>
              {exam.status === 'APPROVED' ? (
                <span className="text-xs flex items-center text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Đã duyệt
                </span>
              ) : (
                <span className="text-xs text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800/80">
                  Chờ duyệt chuyên môn
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {exam.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {onApprove && exam.status !== 'APPROVED' && (
              <button
                onClick={() => onApprove(exam.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center transition shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Phê Duyệt Đề
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              title="Đóng cửa sổ"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 5 Prominent Action Buttons Bar (Requested as 1, 2, 3, 4, 5) */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="font-semibold text-slate-700 flex items-center">
            <FileDown className="w-4 h-4 mr-1.5 text-blue-600" />
            <span>TẢI SẢN PHẨM HỒ SƠ:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Ma trận Word / Excel */}
            <div className="inline-flex rounded-lg shadow-xs border border-slate-300 overflow-hidden bg-white">
              <button
                onClick={() => downloadMatrixDoc(exam, profile)}
                className="px-2.5 py-1.5 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium flex items-center border-r border-slate-200"
                title="Tải ma trận Word"
              >
                <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" />
                1. Ma trận (Word)
              </button>
              <button
                onClick={() => downloadMatrixExcel(exam, profile)}
                className="px-2.5 py-1.5 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-medium flex items-center"
                title="Tải ma trận Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Excel
              </button>
            </div>

            {/* 2. Bảng đặc tả Word */}
            <button
              onClick={() => downloadSpecificationDoc(exam, profile)}
              className="bg-white hover:bg-blue-50 border border-slate-300 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg font-medium flex items-center shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              2. Bảng đặc tả (Word)
            </button>

            {/* 3. Đề kiểm tra hoàn chỉnh Word / Print */}
            <div className="inline-flex rounded-lg shadow-xs border border-slate-300 overflow-hidden bg-white">
              <button
                onClick={() => downloadExamPaperDoc(exam, profile)}
                className="px-2.5 py-1.5 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium flex items-center border-r border-slate-200"
              >
                <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" />
                3. Đề thi (Word)
              </button>
              <button
                onClick={() => printExamDirectly(exam, profile)}
                className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-700 font-medium flex items-center"
                title="In trực tiếp hoặc Lưu PDF"
              >
                <Printer className="w-3.5 h-3.5 mr-1 text-slate-600" />
                In / PDF
              </button>
            </div>

            {/* 4. Đáp án & Hướng dẫn chấm */}
            <button
              onClick={() => downloadAnswerDoc(exam, profile)}
              className="bg-white hover:bg-blue-50 border border-slate-300 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg font-medium flex items-center shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 mr-1 text-teal-600" />
              4. Đáp án & HD chấm (Word)
            </button>

            {/* 5. Tải trọn bộ hồ sơ ZIP */}
            <button
              onClick={handleZipDownload}
              disabled={isZipping}
              className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center shadow-sm disabled:opacity-50"
            >
              <Archive className="w-3.5 h-3.5 mr-1.5" />
              {isZipping ? 'Đang nén ZIP...' : '5. TẢI TRỌN BỘ HỒ SƠ (ZIP)'}
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 flex items-center space-x-1 sm:space-x-4 overflow-x-auto text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('paper')}
            className={`py-3 px-3 border-b-2 flex items-center transition ${
              activeTab === 'paper'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            Đề kiểm tra hoàn chỉnh
          </button>
          <button
            onClick={() => setActiveTab('answer')}
            className={`py-3 px-3 border-b-2 flex items-center transition ${
              activeTab === 'answer'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Đáp án & Hướng dẫn chấm
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-3 border-b-2 flex items-center transition ${
              activeTab === 'matrix'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 mr-1.5" />
            Ma trận đề thi
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            className={`py-3 px-3 border-b-2 flex items-center transition ${
              activeTab === 'spec'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 mr-1.5" />
            Bảng đặc tả ma trận
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3 border-b-2 flex items-center transition ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-500" />
            Kiểm duyệt sư phạm ({exam.pedagogicalValidation.errors.length + exam.pedagogicalValidation.warnings.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200 p-8 sm:p-10 font-serif text-slate-900">

            {/* TAB 1: ĐỀ KIỂM TRA CHÍNH THỨC */}
            {activeTab === 'paper' && (
              <div>
                {/* School Header conforming strictly to user instruction */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-400 text-center font-serif text-[13.5pt] leading-tight">
                  <div>
                    <div className="font-bold uppercase">
                      ỦY BAN NHÂN DÂN XÃ {profile.communeName?.trim() ? profile.communeName.trim().replace(/^xã\s+/i, '').toUpperCase() : '....'}
                    </div>
                    <div className="font-bold uppercase mt-1">
                      TRƯỜNG {profile.schoolName?.trim() ? profile.schoolName.trim().replace(/^trường\s+/i, '').toUpperCase() : '………'}
                    </div>
                    <div className="text-xs font-mono text-slate-500 mt-1 font-normal font-sans">
                      (Mã đề: <strong>{exam.examCode}</strong>)
                    </div>
                  </div>
                  <div>
                    <div className="font-bold uppercase text-[14pt]">
                      ĐỀ KIỂM TRA {exam.term.includes('Cuối HKI') ? 'CUỐI KÌ I' : exam.term.includes('Cuối năm') ? 'CUỐI NĂM HỌC' : exam.term.includes('Giữa HKI') ? 'GIỮA KÌ I' : exam.term.includes('Giữa HKII') ? 'GIỮA KÌ II' : exam.term.toUpperCase()}
                    </div>
                    <div className="font-bold uppercase mt-0.5">
                      MÔN : {exam.subject.toUpperCase()} – LỚP {exam.grade}
                    </div>
                    <div className="text-[13pt] mt-0.5">
                      NĂM HỌC: {profile.academicYear || exam.academicYear || '2025 - 2026'}
                    </div>
                    <div className="text-[11.5pt] italic text-slate-600 mt-0.5">
                      Thời gian làm bài: {exam.durationMinutes} phút (không kể thời gian phát đề)
                    </div>
                  </div>
                </div>

                {/* Student Info & Score Boxes */}
                <div className="font-serif my-4 text-[13.5pt] text-slate-800">
                  <div className="flex justify-between items-center py-1">
                    <div>Họ và tên học sinh: ............................................................................</div>
                    <div>Lớp: <strong>{exam.grade}....</strong></div>
                  </div>
                  <div className="grid grid-cols-3 border border-slate-400 rounded-lg overflow-hidden mt-2 text-center text-xs">
                    <div className="border-r border-slate-400 p-2">
                      <div className="font-bold text-slate-700">ĐIỂM SỐ</div>
                      <div className="h-14 flex items-center justify-center text-slate-400 font-mono text-sm">
                        ... / 10
                      </div>
                    </div>
                    <div className="col-span-2 p-2 text-left">
                      <div className="font-bold text-slate-700 text-center">LỜI NHẬN XÉT CỦA THẦY CÔ GIÁO</div>
                      <div className="h-14 text-slate-400 text-xs italic p-1">
                        ....................................................................................................................
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vietnamese Reading Passage (if applicable) */}
                {exam.readingPassage && (
                  <div className="my-6 p-5 bg-amber-50/50 rounded-xl border border-amber-200/80 font-serif">
                    <div className="text-center font-bold text-base uppercase text-slate-900 mb-1">
                      {exam.readingPassage.title}
                    </div>
                    {exam.readingPassage.author && (
                      <div className="text-right text-xs italic text-slate-600 mb-3">
                        Theo {exam.readingPassage.author}
                      </div>
                    )}
                    <div className="text-sm leading-relaxed text-justify indent-8 text-slate-800 space-y-2 whitespace-pre-wrap">
                      {exam.readingPassage.content}
                    </div>
                    <div className="text-right text-[11px] italic text-slate-500 mt-2 font-sans">
                      (Độ dài: {exam.readingPassage.wordCount} chữ - Chuẩn ngữ liệu GDPT 2018)
                    </div>
                    <div className="mt-3 pt-2 border-t border-amber-200 text-xs font-bold text-slate-700 italic">
                      Dựa vào nội dung bài đọc trên, em hãy thực hiện các yêu cầu dưới đây:
                    </div>
                  </div>
                )}

                {/* Notice: No part headers! Continuous numbering from 1..N */}
                <div className="space-y-6 mt-6">
                  {exam.questions.map((q) => (
                    <div key={q.id} className="text-sm leading-relaxed">
                      {/* Format: Câu 1 (0,5 điểm): ... */}
                      <div className="text-slate-900">
                        <strong className="font-bold font-sans text-slate-950">Câu {q.orderNumber}</strong>{' '}
                        <span className="italic text-slate-600 font-sans">
                          ({q.points.toString().replace('.', ',')} điểm):
                        </span>{' '}
                        <span className="text-slate-900">{q.prompt}</span>
                      </div>

                      {/* Multiple choice options: 1 tab indent (~1cm / 28px) */}
                      {q.format === 'TN_NLC' && q.options && (
                        <div className="ml-7 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 font-sans text-xs">
                          {q.options.map((opt) => (
                            <div key={opt.key} className="flex items-start space-x-1.5">
                              <span className="font-bold text-slate-800">{opt.key}.</span>
                              <span className="text-slate-700">{opt.content}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* True / False or sub-items: aligned to margin, no tab */}
                      {q.subItems && q.subItems.length > 0 && (
                        <div className="ml-5 mt-2 space-y-1 font-sans text-xs">
                          {q.subItems.map((sub) => (
                            <div key={sub.label} className="flex items-center space-x-2">
                              <span className="font-bold text-slate-800">{sub.label})</span>
                              <span className="text-slate-700">{sub.text}</span>
                              <span className="text-slate-400 font-mono">[ ........ ]</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Matching pairs */}
                      {q.format === 'TN_NC' && q.matchPairs && (
                        <div className="ml-5 mt-3 max-w-md bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-sans">
                          <div className="grid grid-cols-2 gap-4 font-bold border-b border-slate-200 pb-1 mb-2">
                            <span>Cột A</span>
                            <span>Cột B</span>
                          </div>
                          {q.matchPairs.map((p) => (
                            <div key={p.leftKey} className="grid grid-cols-2 gap-4 py-1">
                              <div><strong>{p.leftKey}.</strong> {p.leftText}</div>
                              <div><strong>{p.rightKey}.</strong> {p.rightText}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Visual grid for math if enabled */}
                      {q.hasGridVisual && (
                        <div className="ml-7 my-3">
                          <div className="inline-grid grid-cols-5 border border-slate-400 bg-white shadow-xs">
                            {Array.from({ length: 20 }).map((_, i) => (
                              <div key={i} className="w-8 h-8 border border-slate-200"></div>
                            ))}
                          </div>
                          <div className="text-[11px] text-slate-400 italic mt-1 font-sans">
                            (Lưới ô vuông hỗ trợ tính toán / hình học)
                          </div>
                        </div>
                      )}

                      {/* Essay answer lines space */}
                      {(q.format === 'TL' || q.format === 'TH') && (
                        <div className="mt-3 ml-2 font-sans">
                          <div className="text-[11px] text-slate-400 italic mb-1">Bài làm:</div>
                          <div className="space-y-4">
                            {Array.from({ length: q.points >= 2 ? 6 : 4 }).map((_, idx) => (
                              <div key={idx} className="border-b border-dotted border-slate-300 h-4"></div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center font-sans font-bold text-xs text-slate-600 mt-10 pt-4 border-t border-slate-200">
                  ---------- HẾT ----------<br />
                  <span className="font-normal text-[11px] text-slate-400 italic">
                    (Cán bộ coi thi không giải thích gì thêm)
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM */}
            {activeTab === 'answer' && (
              <div className="font-sans">
                <div className="text-center pb-4 border-b border-slate-200">
                  <h3 className="font-bold text-base uppercase text-slate-900">
                    HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM CHI TIẾT
                  </h3>
                  <div className="text-xs text-slate-600 mt-1">
                    Môn: {exam.subject} - Lớp {exam.grade} - Mã đề: {exam.examCode} ({exam.term})
                  </div>
                </div>

                {/* MCQ Answer Table */}
                <div className="mt-6">
                  <h4 className="font-bold text-sm text-blue-900 uppercase flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600" />
                    Phần Câu hỏi Trắc nghiệm ({exam.mcqPoints} điểm)
                  </h4>
                  <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 shadow-xs">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5 text-center w-16">Câu số</th>
                          <th className="p-2.5 text-center w-24">Đáp án đúng</th>
                          <th className="p-2.5 text-center w-20">Thang điểm</th>
                          <th className="p-2.5">Giải thích / Ghi chú sư phạm</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {mcqs.map((q) => (
                          <tr key={q.id} className="hover:bg-slate-50/80">
                            <td className="p-2.5 text-center font-bold text-slate-800">
                              Câu {q.orderNumber}
                            </td>
                            <td className="p-2.5 text-center font-extrabold text-blue-600 text-sm">
                              {q.correctAnswer}
                            </td>
                            <td className="p-2.5 text-center font-medium">
                              {q.points.toString().replace('.', ',')} đ
                            </td>
                            <td className="p-2.5 text-slate-600">
                              {q.explanation || 'Chọn đúng phương án theo quy định.'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Essay Grading Guide */}
                <div className="mt-8">
                  <h4 className="font-bold text-sm text-blue-900 uppercase flex items-center">
                    <Award className="w-4 h-4 mr-1.5 text-blue-600" />
                    Phần Câu hỏi Tự luận / Thực hành ({exam.essayPoints} điểm)
                  </h4>
                  <div className="mt-3 space-y-4">
                    {essays.map((q) => (
                      <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex justify-between items-start font-bold text-slate-900 mb-1">
                          <span>
                            Câu {q.orderNumber} ({q.points.toString().replace('.', ',')} điểm) - [Mức {q.level}]
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                            {q.topicName}
                          </span>
                        </div>
                        <div className="text-slate-600 italic mb-2">
                          <strong>Đề bài:</strong> {q.prompt}
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                          <div>
                            <span className="font-bold text-slate-800">Đáp án / Lời giải chi tiết:</span>
                            <div className="mt-1 whitespace-pre-wrap text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                              {q.correctAnswer}
                            </div>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-800">Hướng dẫn chấm & biểu điểm:</span>
                            <div className="mt-1 whitespace-pre-wrap text-emerald-950 bg-emerald-50/70 p-2 rounded border border-emerald-100 leading-relaxed">
                              {q.gradingGuide || 'Học sinh làm cách khác đúng bản chất vẫn cho điểm tối đa theo từng bước tương đương.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-200 text-center text-xs">
                  <div>
                    <div className="font-bold text-slate-800">TỔ TRƯỞNG CHUYÊN MÔN</div>
                    <div className="text-[11px] italic text-slate-500">(Ký và ghi rõ họ tên)</div>
                    <div className="mt-12 font-bold text-slate-900">{profile.headOfDepartment || '................................'}</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">GIÁO VIÊN SOẠN ĐÁP ÁN</div>
                    <div className="text-[11px] italic text-slate-500">(Ký và ghi rõ họ tên)</div>
                    <div className="mt-12 font-bold text-slate-900">{exam.teacherName || profile.teacherName || '................................'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MA TRẬN ĐỀ THI */}
            {activeTab === 'matrix' && (
              <div className="font-sans">
                <div className="text-center pb-4 border-b border-slate-200">
                  <h3 className="font-bold text-base uppercase text-slate-900">
                    MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ {exam.term.toUpperCase()}
                  </h3>
                  <div className="text-xs text-slate-600 mt-1">
                    Chuẩn Thông tư 27/2020/TT-BGDĐT | Môn {exam.subject} - Lớp {exam.grade}
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-800 font-bold text-center border-b border-slate-300">
                      <tr>
                        <th rowSpan={3} className="p-2 border-r border-slate-300 w-10">TT</th>
                        <th rowSpan={3} className="p-2 border-r border-slate-300 w-44">Mạch kiến thức, kĩ năng</th>
                        <th rowSpan={3} className="p-2 border-r border-slate-300">Nội dung bài học / Yêu cầu cần đạt</th>
                        <th colSpan={6} className="p-1 border-b border-slate-300 bg-blue-50/70">Mức độ nhận thức</th>
                        <th rowSpan={2} colSpan={2} className="p-2 border-r border-slate-300 w-24">Tổng cộng</th>
                        <th rowSpan={3} className="p-2 w-14">Tỉ lệ</th>
                      </tr>
                      <tr>
                        <th colSpan={2} className="p-1 border-r border-slate-300 bg-blue-50/40">Mức 1 (Biết)</th>
                        <th colSpan={2} className="p-1 border-r border-slate-300 bg-blue-50/40">Mức 2 (Hiểu)</th>
                        <th colSpan={2} className="p-1 border-r border-slate-300 bg-amber-100/70 text-amber-950">
                          Mức 3 (Vận dụng - Chỉ TL/TH)
                        </th>
                      </tr>
                      <tr className="bg-slate-50 text-[11px]">
                        <th className="p-1 border-r border-slate-200 w-10">TN</th>
                        <th className="p-1 border-r border-slate-300 w-10">TL</th>
                        <th className="p-1 border-r border-slate-200 w-10">TN</th>
                        <th className="p-1 border-r border-slate-300 w-10">TL</th>
                        <th className="p-1 border-r border-slate-200 w-10 bg-slate-100 text-slate-400 font-normal" title="Không có trắc nghiệm ở Mức 3">
                          TN (—)
                        </th>
                        <th className="p-1 border-r border-slate-300 w-10 bg-amber-50 font-bold text-amber-900">
                          TL / TH
                        </th>
                        <th className="p-1 border-r border-slate-200 w-12">Số câu</th>
                        <th className="p-1 border-r border-slate-300 w-12">Điểm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {exam.matrixTopics.map((t, idx) => {
                        const c = t.cell;
                        const cellQCount =
                          c.level1TNCount + c.level1TLCount + c.level2TNCount + c.level2TLCount + c.level3TNCount + c.level3TLCount;
                        const pct = ((c.totalPoints / 10) * 100).toFixed(0);

                        return (
                          <tr key={t.id} className="hover:bg-slate-50">
                            <td className="p-2 text-center font-bold border-r border-slate-200">{idx + 1}</td>
                            <td className="p-2 font-bold text-slate-900 border-r border-slate-200">{t.topicName}</td>
                            <td className="p-2 text-slate-700 border-r border-slate-200">{t.lessonContent}</td>
                            
                            <td className="p-2 text-center border-r border-slate-200">{c.level1TNCount || '-'}</td>
                            <td className="p-2 text-center border-r border-slate-200">{c.level1TLCount || '-'}</td>
                            <td className="p-2 text-center border-r border-slate-200">{c.level2TNCount || '-'}</td>
                            <td className="p-2 text-center border-r border-slate-200">{c.level2TLCount || '-'}</td>
                            <td className="p-2 text-center border-r border-slate-200 text-slate-400 bg-slate-50 italic" title="Không có trắc nghiệm ở Mức 3">—</td>
                            <td className="p-2 text-center border-r border-slate-200 font-semibold">{c.level3TLCount || '-'}</td>

                            <td className="p-2 text-center font-bold border-r border-slate-200">{cellQCount}</td>
                            <td className="p-2 text-center font-bold text-blue-700 border-r border-slate-200">
                              {c.totalPoints.toFixed(1)}
                            </td>
                            <td className="p-2 text-center font-medium">{pct}%</td>
                          </tr>
                        );
                      })}

                      {/* Summary row */}
                      <tr className="bg-slate-100 font-bold text-slate-900">
                        <td colSpan={3} className="p-2.5 text-center border-r border-slate-200">
                          TỔNG ĐIỂM TOÀN ĐỀ
                        </td>
                        <td colSpan={2} className="p-2 text-center border-r border-slate-200 text-blue-800">
                          {exam.level1Points.toFixed(1)} đ
                        </td>
                        <td colSpan={2} className="p-2 text-center border-r border-slate-200 text-blue-800">
                          {exam.level2Points.toFixed(1)} đ
                        </td>
                        <td colSpan={2} className="p-2 text-center border-r border-slate-200 text-blue-800">
                          {exam.level3Points.toFixed(1)} đ
                        </td>
                        <td className="p-2 text-center border-r border-slate-200">{exam.questions.length}</td>
                        <td className="p-2 text-center text-emerald-700 border-r border-slate-200 font-extrabold">
                          10,0 đ
                        </td>
                        <td className="p-2 text-center">100%</td>
                      </tr>
                      <tr className="bg-blue-50 font-semibold text-blue-950 text-[11px]">
                        <td colSpan={3} className="p-2 text-center border-r border-blue-200">
                          TỈ LỆ % CÁC MỨC ĐỘ
                        </td>
                        <td colSpan={2} className="p-1.5 text-center border-r border-blue-200">
                          {((exam.level1Points / 10) * 100).toFixed(0)}% (Mức 1)
                        </td>
                        <td colSpan={2} className="p-1.5 text-center border-r border-blue-200">
                          {((exam.level2Points / 10) * 100).toFixed(0)}% (Mức 2)
                        </td>
                        <td colSpan={2} className="p-1.5 text-center border-r border-blue-200">
                          {((exam.level3Points / 10) * 100).toFixed(0)}% (Mức 3)
                        </td>
                        <td colSpan={2} className="p-1.5 text-center border-r border-blue-200">
                          TN: {((exam.mcqPoints / 10) * 100).toFixed(0)}%
                        </td>
                        <td className="p-1.5 text-center">
                          TL: {((exam.essayPoints / 10) * 100).toFixed(0)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: BẢNG ĐẶC TẢ MA TRẬN */}
            {activeTab === 'spec' && (
              <div className="font-sans">
                <div className="text-center pb-4 border-b border-slate-200">
                  <h3 className="font-bold text-base uppercase text-slate-900">
                    BẢNG ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ
                  </h3>
                  <div className="text-xs text-slate-600 mt-1">
                    Môn: {exam.subject} - Lớp {exam.grade} | Năm học: {profile.academicYear}
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 shadow-xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-center">
                      <tr>
                        <th className="p-2.5 w-12 border-r border-slate-200">TT</th>
                        <th className="p-2.5 w-36 border-r border-slate-200">Mạch kiến thức</th>
                        <th className="p-2.5 w-40 border-r border-slate-200">Đơn vị kiến thức / Kĩ năng</th>
                        <th className="p-2.5 w-20 border-r border-slate-200">Mức độ</th>
                        <th className="p-2.5 border-r border-slate-200 text-left">Yêu cầu cần đạt (YCCĐ)</th>
                        <th className="p-2.5 w-24 border-r border-slate-200">Hình thức</th>
                        <th className="p-2.5 w-20 border-r border-slate-200">Câu số</th>
                        <th className="p-2.5 w-16">Điểm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {exam.specifications.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-2 text-center font-bold border-r border-slate-200">{idx + 1}</td>
                          <td className="p-2 font-semibold text-slate-900 border-r border-slate-200">{s.topicName}</td>
                          <td className="p-2 text-slate-700 border-r border-slate-200">{s.contentUnit}</td>
                          <td className="p-2 text-center border-r border-slate-200">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 text-[10px]">
                              Mức {s.level}
                            </span>
                          </td>
                          <td className="p-2 text-slate-700 border-r border-slate-200">{s.outcomeRequirement}</td>
                          <td className="p-2 text-center border-r border-slate-200">
                            {s.questionType.startsWith('TN') ? 'Trắc nghiệm' : 'Tự luận'}
                          </td>
                          <td className="p-2 text-center font-bold text-blue-700 border-r border-slate-200">
                            {s.questionNumbers.map((n) => `Câu ${n}`).join(', ')}
                          </td>
                          <td className="p-2 text-center font-medium">
                            {s.points.toString().replace('.', ',')} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: BÁO CÁO KIỂM DUYỆT SƯ PHẠM */}
            {activeTab === 'audit' && (
              <div className="font-sans">
                <div className="flex items-center space-x-2 pb-4 border-b border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Báo Cáo Kiểm Duyệt Sư Phạm & Tiêu Chuẩn Thông Tư 27
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tự động rà soát tổng điểm 10, thứ tự câu hỏi, tỉ lệ mức độ và hình thức thi.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {/* Total score box */}
                  <div className={`p-4 rounded-xl border ${
                    exam.totalPoints === 10
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="text-xs font-semibold uppercase">Tổng Điểm Toàn Đề</div>
                    <div className="text-3xl font-extrabold mt-1">
                      {exam.totalPoints.toFixed(1)} <span className="text-base font-normal">/ 10,0 điểm</span>
                    </div>
                    <div className="text-xs mt-1">
                      {exam.totalPoints === 10 ? '✓ Chuẩn 10 điểm tuyệt đối' : '✕ Sai lệch tổng điểm! Cần điều chỉnh'}
                    </div>
                  </div>

                  {/* Level ratio box */}
                  <div className="p-4 rounded-xl border bg-blue-50 border-blue-200 text-blue-900">
                    <div className="text-xs font-semibold uppercase">Tỉ Lệ Mức Độ (Chuẩn 50-30-20%)</div>
                    <div className="text-2xl font-bold mt-1">
                      {((exam.level1Points / 10) * 100).toFixed(0)}% - {((exam.level2Points / 10) * 100).toFixed(0)}% - {((exam.level3Points / 10) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs mt-1 text-blue-700">
                      M1: {exam.level1Points}đ | M2: {exam.level2Points}đ | M3: {exam.level3Points}đ
                    </div>
                  </div>

                  {/* TN vs TL ratio box */}
                  <div className="p-4 rounded-xl border bg-indigo-50 border-indigo-200 text-indigo-900">
                    <div className="text-xs font-semibold uppercase">Hình Thức (Chuẩn 60-40%)</div>
                    <div className="text-2xl font-bold mt-1">
                      {((exam.mcqPoints / 10) * 100).toFixed(0)}% TN - {((exam.essayPoints / 10) * 100).toFixed(0)}% TL
                    </div>
                    <div className="text-xs mt-1 text-indigo-700">
                      Trắc nghiệm: {exam.mcqPoints}đ | Tự luận: {exam.essayPoints}đ
                    </div>
                  </div>
                </div>

                {/* Audit Checklist */}
                <div className="mt-6 space-y-3">
                  <h4 className="font-bold text-sm text-slate-800">Danh Mục Kiểm Duyệt Quy Chuẩn:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                      <span>Đánh số câu hỏi liên tục từ Câu 1 đến Câu {exam.questions.length} (Không tách phần trắc nghiệm/tự luận).</span>
                    </div>
                    <div className="flex items-center p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                      <span>Các câu hỏi trắc nghiệm xếp trước, tự luận xếp sau. Thứ tự trắc nghiệm: M1 trước M2 (NLC -&gt; ĐS -&gt; NC -&gt; ĐK).</span>
                    </div>
                    <div className="flex items-center p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                      <span>
                        Số lượng phương án trắc nghiệm phù hợp lứa tuổi: Lớp {exam.grade} gồm{' '}
                        {exam.grade <= 3 ? '3 phương án (A, B, C)' : '4 phương án (A, B, C, D)'}.
                      </span>
                    </div>
                    <div className="flex items-center p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                      <span>Không ghép câu thuộc 2 chủ đề khác nhau; mỗi câu hỏi ứng với một đặc tả riêng biệt.</span>
                    </div>
                    <div className="flex items-center p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                      <span>Quy chuẩn Mức 3: Tuyệt đối KHÔNG CÓ câu hỏi trắc nghiệm ở Mức Vận dụng (Mức 3 toàn bộ 100% là câu hỏi Tự luận hoặc Thực hành).</span>
                    </div>
                  </div>

                  {/* Warning Messages if any */}
                  {exam.pedagogicalValidation.warnings.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                      <div className="font-bold flex items-center mb-1">
                        <AlertTriangle className="w-4 h-4 mr-1 text-amber-600" />
                        Gợi ý cải tiến sư phạm:
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {exam.pedagogicalValidation.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exam.pedagogicalValidation.errors.length > 0 && (
                    <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900">
                      <div className="font-bold flex items-center mb-1">
                        <AlertTriangle className="w-4 h-4 mr-1 text-rose-600" />
                        Lỗi bắt buộc phải sửa:
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {exam.pedagogicalValidation.errors.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div>
            Đơn vị: <strong>{profile.schoolName}</strong> - Hệ thống hỗ trợ khảo thí Tiểu học chuẩn GDPT 2018
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
