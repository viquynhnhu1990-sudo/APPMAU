import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  Plus,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Trash2,
  Copy,
  Tag
} from 'lucide-react';
import { INITIAL_QUESTION_BANK, BankQuestionRecord } from '../data/questionBank';
import { GradeLevel, SubjectName, QuestionFormat, QuestionLevel } from '../types';

export const QuestionBank: React.FC = () => {
  const [bankQuestions, setBankQuestions] = useState<BankQuestionRecord[]>(INITIAL_QUESTION_BANK);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  // Modal to add a new question
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState<GradeLevel>(4);
  const [newSubject, setNewSubject] = useState<SubjectName>('Toán');
  const [newTopic, setNewTopic] = useState('Số và phép tính');
  const [newPrompt, setNewPrompt] = useState('');
  const [newLevel, setNewLevel] = useState<QuestionLevel>(1);
  const [newFormat, setNewFormat] = useState<QuestionFormat>('TN_NLC');
  const [newPoints, setNewPoints] = useState(0.5);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('A');
  const [newExplanation, setNewExplanation] = useState('');
  const [newGradingGuide, setNewGradingGuide] = useState('');
  const [newOptions, setNewOptions] = useState([
    { key: 'A' as const, content: '' },
    { key: 'B' as const, content: '' },
    { key: 'C' as const, content: '' },
    { key: 'D' as const, content: '' },
  ]);

  // Filter bank questions
  const filtered = bankQuestions.filter((q) => {
    const matchesSearch =
      q.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.contentUnit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || q.grade.toString() === selectedGrade;
    const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'all' || q.level.toString() === selectedLevel;
    const matchesFormat = selectedFormat === 'all' || q.format === selectedFormat;
    return matchesSearch && matchesGrade && matchesSubject && matchesLevel && matchesFormat;
  });

  const handleAddNewQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim()) return;

    // Strict Pedagogical Rule: KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (MỨC 3)
    if (newFormat.startsWith('TN') && newLevel === 3) {
      alert('Quy chuẩn Thông tư 27 & GDPT 2018: Tuyệt đối KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG. Mức 3 chỉ gồm câu hỏi Tự luận hoặc Thực hành.');
      return;
    }

    const optsCount = newGrade <= 3 ? 3 : 4;
    const trimmedOpts = newOptions.slice(0, optsCount);

    const record: BankQuestionRecord = {
      id: `bq-${Date.now()}`,
      grade: newGrade,
      subject: newSubject,
      textbook: 'Kết nối tri thức với cuộc sống',
      usageCount: 1,
      orderNumber: bankQuestions.length + 1,
      topicName: newTopic,
      contentUnit: newTopic,
      format: newFormat,
      level: newLevel,
      points: newPoints,
      prompt: newPrompt,
      options: newFormat === 'TN_NLC' ? trimmedOpts : undefined,
      correctAnswer: newCorrectAnswer,
      explanation: newExplanation || 'Căn cứ theo sách giáo khoa và chuẩn kiến thức kĩ năng.',
      gradingGuide: newGradingGuide || 'Hướng dẫn chấm chi tiết theo từng bước.',
    };

    setBankQuestions([record, ...bankQuestions]);
    setIsAddModalOpen(false);
    // Reset
    setNewPrompt('');
    setNewExplanation('');
    setNewGradingGuide('');
  };

  const handleDelete = (id: string) => {
    setBankQuestions(bankQuestions.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-blue-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white ring-2 ring-blue-400/40">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-blue-300 tracking-wider">
                Kho dữ liệu khảo thí chuẩn Bộ GD&ĐT
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Ngân Hàng Câu Hỏi Kiểm Tra Tiểu Học
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-md transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Thêm Câu Hỏi Mới
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo nội dung câu hỏi, chủ đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
          >
            <option value="all">Tất cả khối lớp</option>
            <option value="1">Lớp 1</option>
            <option value="2">Lớp 2</option>
            <option value="3">Lớp 3</option>
            <option value="4">Lớp 4</option>
            <option value="5">Lớp 5</option>
          </select>

          {/* Subject filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
          >
            <option value="all">Tất cả môn học</option>
            <option value="Toán">Toán</option>
            <option value="Tiếng Việt">Tiếng Việt</option>
            <option value="Tin học">Tin học</option>
            <option value="Khoa học">Khoa học</option>
            <option value="Lịch sử và Địa lí">Lịch sử và Địa lí</option>
            <option value="Công nghệ">Công nghệ</option>
          </select>

          {/* Level filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="1">Mức 1 (Biết)</option>
            <option value="2">Mức 2 (Hiểu)</option>
            <option value="3">Mức 3 (Vận dụng)</option>
          </select>

          {/* Format filter */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
          >
            <option value="all">Tất cả hình thức</option>
            <option value="TN_NLC">TN Nhiều lựa chọn</option>
            <option value="TN_DS">TN Đúng / Sai</option>
            <option value="TN_NC">TN Nối cột</option>
            <option value="TN_DK">TN Điền khuyết</option>
            <option value="TL">Tự luận</option>
            <option value="TH">Thực hành</option>
          </select>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((q) => (
          <div
            key={q.id}
            className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between space-y-3 hover:border-blue-300 transition"
          >
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Lớp {q.grade} - {q.subject}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    q.level === 1
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : q.level === 2
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    Mức {q.level}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {q.format === 'TN_NLC'
                      ? 'TN Nhiều Lựa Chọn'
                      : q.format === 'TL'
                      ? 'Tự Luận'
                      : q.format === 'TH'
                      ? 'Thực Hành'
                      : 'Trắc Nghiệm'}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-slate-400">
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    {q.points.toString().replace('.', ',')} đ
                  </span>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1 hover:text-rose-600 rounded transition"
                    title="Xóa câu này khỏi ngân hàng"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Topic */}
              <div className="mt-2 text-[11px] text-slate-500 font-medium">
                Chủ đề: <strong>{q.topicName}</strong> ({q.contentUnit})
              </div>

              {/* Prompt */}
              <div className="mt-2 text-xs font-serif text-slate-900 leading-relaxed">
                <strong>Câu hỏi:</strong> {q.prompt}
              </div>

              {/* Options */}
              {q.format === 'TN_NLC' && q.options && (
                <div className="mt-2.5 ml-4 grid grid-cols-2 gap-1.5 text-xs">
                  {q.options.map((opt) => (
                    <div
                      key={opt.key}
                      className={`p-1 rounded text-[11px] ${
                        opt.key === q.correctAnswer
                          ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                          : 'text-slate-600'
                      }`}
                    >
                      <span>{opt.key}.</span> {opt.content}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Answer & Explanation */}
            <div className="pt-2 border-t border-slate-100 text-[11px] bg-slate-50 -mx-5 -mb-5 p-3 rounded-b-2xl text-slate-600">
              <div>
                <strong>Đáp án đúng:</strong>{' '}
                <span className="text-blue-700 font-bold">{q.correctAnswer}</span>
              </div>
              <div className="mt-0.5 text-slate-500 truncate" title={q.explanation}>
                {q.explanation}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Thêm Câu Hỏi Mới Vào Ngân Hàng
            </h3>

            <form onSubmit={handleAddNewQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Khối lớp</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(parseInt(e.target.value, 10) as GradeLevel)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    <option value={1}>Lớp 1</option>
                    <option value={2}>Lớp 2</option>
                    <option value={3}>Lớp 3</option>
                    <option value={4}>Lớp 4</option>
                    <option value={5}>Lớp 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Môn học</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as SubjectName)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-blue-700"
                  >
                    <option value="Toán">Toán</option>
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="Tin học">Tin học</option>
                    <option value="Khoa học">Khoa học</option>
                    <option value="Lịch sử và Địa lí">Lịch sử và Địa lí</option>
                    <option value="Công nghệ">Công nghệ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hình thức câu hỏi</label>
                  <select
                    value={newFormat}
                    onChange={(e) => {
                      const fmt = e.target.value as QuestionFormat;
                      setNewFormat(fmt);
                      if (fmt.startsWith('TN') && newLevel === 3) {
                        setNewLevel(2);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="TN_NLC">Trắc nghiệm nhiều lựa chọn</option>
                    <option value="TL">Tự luận</option>
                    <option value="TH">Thực hành</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Mức độ nhận thức
                    {newFormat.startsWith('TN') && (
                      <span className="text-[10px] text-amber-600 font-normal ml-1">(TN: M1 & M2)</span>
                    )}
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => {
                      const lvl = parseInt(e.target.value, 10) as QuestionLevel;
                      if (lvl === 3 && newFormat.startsWith('TN')) {
                        setNewFormat('TL');
                      }
                      setNewLevel(lvl);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value={1}>Mức 1 (Biết) - 0,5đ</option>
                    <option value={2}>Mức 2 (Hiểu) - 0,5đ / 1,0đ</option>
                    {!newFormat.startsWith('TN') ? (
                      <option value={3}>Mức 3 (Vận dụng) - 1,0đ - 2,0đ</option>
                    ) : (
                      <option value={3} disabled className="text-slate-400">
                        Mức 3 (Vận dụng - Chỉ dành cho Tự luận/TH)
                      </option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Chủ đề / YCCĐ</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  placeholder="Ví dụ: Số có nhiều chữ số, Đo góc, Đọc hiểu văn bản..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nội dung câu hỏi (chữ thường không đậm)
                </label>
                <textarea
                  rows={3}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  placeholder="Nhập nội dung câu hỏi..."
                  required
                />
              </div>

              {/* Options if MCQ */}
              {newFormat === 'TN_NLC' && (
                <div className="space-y-2">
                  <label className="block text-slate-700 font-semibold">
                    Phương án lựa chọn (Lớp {newGrade}: {newGrade <= 3 ? '3 phương án A, B, C' : '4 phương án A, B, C, D'})
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {newOptions.slice(0, newGrade <= 3 ? 3 : 4).map((opt, i) => (
                      <div key={opt.key} className="flex items-center space-x-1.5">
                        <span className="font-bold">{opt.key}.</span>
                        <input
                          type="text"
                          value={opt.content}
                          onChange={(e) => {
                            const updated = [...newOptions];
                            updated[i].content = e.target.value;
                            setNewOptions(updated);
                          }}
                          placeholder={`Nội dung ${opt.key}`}
                          className="flex-1 bg-slate-50 border border-slate-300 rounded p-1.5"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3 pt-1">
                    <span className="font-bold">Đáp án đúng:</span>
                    <select
                      value={newCorrectAnswer}
                      onChange={(e) => setNewCorrectAnswer(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded px-3 py-1 font-bold text-blue-700"
                    >
                      <option value="A">Phương án A</option>
                      <option value="B">Phương án B</option>
                      <option value="C">Phương án C</option>
                      {newGrade > 3 && <option value="D">Phương án D</option>}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Giải thích chi tiết</label>
                <input
                  type="text"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  placeholder="Lời giải thích vì sao đáp án đúng..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                >
                  Lưu Vào Ngân Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
