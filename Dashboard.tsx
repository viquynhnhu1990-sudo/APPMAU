import React, { useState } from 'react';
import {
  Grid3X3,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Trash2,
  Copy,
  Download,
  Search,
  Filter,
  School,
  Sparkles,
  Archive,
  BookOpen,
  Edit3,
  Save,
  X,
  UserCheck
} from 'lucide-react';
import { ExamPackage, SchoolProfile, GradeLevel, SubjectName } from '../types';
import { downloadFullPackageZip, downloadExamPaperDoc } from '../utils/exportUtils';

interface DashboardProps {
  profile: SchoolProfile;
  exams: ExamPackage[];
  matrixCount: number;
  onCreateMatrix: () => void;
  onCreateExam: () => void;
  onPreviewExam: (exam: ExamPackage) => void;
  onDeleteExam: (id: string) => void;
  onDuplicateExam: (exam: ExamPackage) => void;
  onOpenSettings?: () => void;
  onUpdateProfile?: (profile: SchoolProfile) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  exams,
  matrixCount,
  onCreateMatrix,
  onCreateExam,
  onPreviewExam,
  onDeleteExam,
  onDuplicateExam,
  onOpenSettings,
  onUpdateProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Quick edit profile modal state
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [quickForm, setQuickForm] = useState<SchoolProfile>(profile);
  const [examToDelete, setExamToDelete] = useState<ExamPackage | null>(null);

  // Stats calculation
  const totalExams = exams.length;
  const approvedExams = exams.filter((e) => e.status === 'APPROVED').length;
  const pendingExams = exams.filter((e) => e.status !== 'APPROVED').length;

  // Filter exams
  const filteredExams = exams.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.examCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || e.grade.toString() === selectedGrade;
    const matchesSubject = selectedSubject === 'all' || e.subject === selectedSubject;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  const handleSaveQuickProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(quickForm);
    }
    setIsQuickEditOpen(false);
  };

  const communeDisplay = profile.communeName?.trim()
    ? `XÃ ${profile.communeName.trim().replace(/^xã\s+/i, '').toUpperCase()}`
    : 'XÃ ....';
  const schoolDisplay = profile.schoolName?.trim()
    ? `TRƯỜNG ${profile.schoolName.trim().replace(/^trường\s+/i, '').toUpperCase()}`
    : 'TRƯỜNG ………';

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-blue-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-blue-600/60 text-blue-200 border border-blue-500/30">
                Hệ Thống Khảo Thí Tiểu Học
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Thông Tư 27 & GDPT 2018
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <School className="w-8 h-8 text-blue-400 shrink-0" />
              <span>APP TẠO ĐỀ MA TRẬN VÀ ĐỀ KIỂM TRA TIỂU HỌC</span>
            </h1>

            {/* Dynamic Unit Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="bg-blue-900/70 text-blue-200 px-3 py-1 rounded-lg border border-blue-700/50 font-semibold">
                Ủy ban nhân dân: {communeDisplay}
              </span>
              <span className="bg-slate-800/80 text-white px-3 py-1 rounded-lg border border-slate-700/60 font-bold">
                {schoolDisplay}
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Trợ lý chuyên gia xây dựng ma trận, bảng đặc tả, đề kiểm tra định kỳ và hướng dẫn chấm chuẩn quy chế Bộ Giáo dục & Đào tạo. Tự động cân đối 3 mức độ nhận thức (50% - 30% - 20%), không có câu trắc nghiệm ở mức vận dụng và thang điểm 10 tuyệt đối.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50">
                Năm học: <strong className="text-white">{profile.academicYear || '2025 - 2026'}</strong>
              </span>
              <span className="bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50">
                Thời điểm: <strong className="text-blue-300">{profile.term}</strong>
              </span>
              <span className="bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/50">
                Tổ trưởng CM (Admin nhập): <strong className="text-amber-300">{profile.headOfDepartment || '(Chưa nhập)'}</strong>
              </span>
              <button
                onClick={() => {
                  setQuickForm(profile);
                  setIsQuickEditOpen(true);
                }}
                className="text-xs text-blue-300 hover:text-white underline flex items-center gap-1 cursor-pointer transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                [Cập nhật Đơn vị & Tổ trưởng CM]
              </button>
            </div>
          </div>

          {/* Prominent Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onCreateMatrix}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-900/40 hover:shadow-blue-800/60 transition duration-150 flex items-center justify-center space-x-2.5 group cursor-pointer"
            >
              <Grid3X3 className="w-5 h-5 text-blue-200 group-hover:scale-110 transition-transform" />
              <span>TẠO MA TRẬN MỚI</span>
            </button>

            <button
              onClick={onCreateExam}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-900/40 hover:shadow-emerald-800/60 transition duration-150 flex items-center justify-center space-x-2.5 group cursor-pointer"
            >
              <FileCheck2 className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>TẠO ĐỀ KIỂM TRA</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Số ma trận */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Số ma trận đã lập
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
              {matrixCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Chuẩn Thông tư 27</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Grid3X3 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Số đề kiểm tra */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng số đề kiểm tra
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 mt-1">
              {totalExams}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Kèm bảng đặc tả & HD chấm</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Đề chờ duyệt */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đề chờ duyệt
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {pendingExams}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Đang chờ tổ trưởng ký duyệt</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Đề hoàn thành */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đề hoàn thành & duyệt
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {approvedExams}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Sẵn sàng in ấn & khảo thí</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table: Created Exams */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Danh Sách Đề Kiểm Tra Đã Biên Soạn
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý trọn bộ hồ sơ kiểm tra: Ma trận, đặc tả, đề thi, đáp án và tải file ZIP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo môn, tên đề, mã đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white w-52 text-slate-800"
              />
            </div>

            {/* Filter Grade */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700"
            >
              <option value="all">Tất cả Khối lớp</option>
              <option value="1">Lớp 1</option>
              <option value="2">Lớp 2</option>
              <option value="3">Lớp 3</option>
              <option value="4">Lớp 4</option>
              <option value="5">Lớp 5</option>
            </select>

            {/* Filter Subject */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700"
            >
              <option value="all">Tất cả Môn học</option>
              <option value="Toán">Toán</option>
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="Tin học">Tin học</option>
              <option value="Khoa học">Khoa học</option>
              <option value="Lịch sử và Địa lí">Lịch sử & Địa lí</option>
              <option value="Công nghệ">Công nghệ</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">STT</th>
                <th className="p-3">Tên Đề Kiểm Tra & Kỳ Thi</th>
                <th className="p-3 w-24 text-center">Khối / Môn</th>
                <th className="p-3 w-28 text-center">Bộ Sách</th>
                <th className="p-3 w-24 text-center">Thời Gian</th>
                <th className="p-3 w-24 text-center">Tổng Điểm</th>
                <th className="p-3 w-28 text-center">Tỉ lệ M1-M2-M3</th>
                <th className="p-3 w-28 text-center">Trạng Thái</th>
                <th className="p-3 w-36 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Chưa có đề kiểm tra nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredExams.map((exam, index) => {
                  const m1Pct = ((exam.level1Points / 10) * 100).toFixed(0);
                  const m2Pct = ((exam.level2Points / 10) * 100).toFixed(0);
                  const m3Pct = ((exam.level3Points / 10) * 100).toFixed(0);

                  return (
                    <tr key={exam.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3 text-center text-slate-500 font-medium">
                        {index + 1}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer" onClick={() => onPreviewExam(exam)}>
                          {exam.title}
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                          <span>Mã đề: <strong className="text-slate-700 font-mono">{exam.examCode}</strong></span>
                          <span>•</span>
                          <span>{exam.term}</span>
                          <span>•</span>
                          <span>GV: {exam.teacherName}</span>
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-xs">
                          {exam.subject} {exam.grade}
                        </span>
                      </td>

                      <td className="p-3 text-center text-slate-600 text-[11px]">
                        {exam.textbook}
                      </td>

                      <td className="p-3 text-center text-slate-600">
                        {exam.durationMinutes} phút
                      </td>

                      <td className="p-3 text-center">
                        <span className="font-extrabold text-emerald-700 text-xs">
                          {exam.totalPoints.toFixed(1).replace('.', ',')} đ
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {exam.questions.length} câu
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <span className="text-[11px] font-semibold text-slate-700">
                          {m1Pct}% - {m2Pct}% - {m3Pct}%
                        </span>
                        <div className="text-[10px] text-slate-400">
                          TN {((exam.mcqPoints / 10) * 100).toFixed(0)}% / TL {((exam.essayPoints / 10) * 100).toFixed(0)}%
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        {exam.status === 'APPROVED' ? (
                          <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Đã duyệt
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1" /> Chờ duyệt
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {/* Xem & Tải (5 trong 1) */}
                          <button
                            onClick={() => onPreviewExam(exam)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Xem chi tiết & Tải xuống (5 trong 1)"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Tải nhanh Word đề thi */}
                          <button
                            onClick={() => downloadExamPaperDoc(exam, profile)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Tải nhanh Đề thi Word"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Tải nhanh ZIP */}
                          <button
                            onClick={() => downloadFullPackageZip(exam, profile)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                            title="Tải trọn bộ hồ sơ (ZIP)"
                          >
                            <Archive className="w-4 h-4" />
                          </button>

                          {/* Nhân bản / Hoán vị mã đề */}
                          <button
                            onClick={() => onDuplicateExam(exam)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Nhân bản / Tạo mã đề mới"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Xóa */}
                          <button
                            onClick={() => setExamToDelete(exam)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                            title="Xóa đề này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Edit Profile Modal */}
      {isQuickEditOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <School className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base">Cập Nhật Thông Tin Đơn Vị & Tổ Trưởng</h3>
              </div>
              <button
                onClick={() => setIsQuickEditOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tên Xã (Cấp hành chính)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Chí Cà, Nậm Chảy, Tân Phong... (để trống hiện: ....)"
                  value={quickForm.communeName || ''}
                  onChange={(e) => setQuickForm({ ...quickForm, communeName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                />
                <span className="text-[11px] text-slate-500">
                  Xuất hiện trên tiêu đề: <strong>ỦY BAN NHÂN DÂN XÃ {quickForm.communeName ? quickForm.communeName.toUpperCase() : '....'}</strong>
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tên Trường Học
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tiểu học Tân Phong, Tiểu học Số 1... (để trống hiện: ………)"
                  value={quickForm.schoolName || ''}
                  onChange={(e) => setQuickForm({ ...quickForm, schoolName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
                />
                <span className="text-[11px] text-slate-500">
                  Xuất hiện trên tiêu đề: <strong>TRƯỜNG {quickForm.schoolName ? quickForm.schoolName.toUpperCase() : '………'}</strong>
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tổ trưởng chuyên môn (Admin nhập) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ tên Tổ trưởng chuyên môn (ký và duyệt)"
                  value={quickForm.headOfDepartment || ''}
                  onChange={(e) => setQuickForm({ ...quickForm, headOfDepartment: e.target.value })}
                  className="w-full bg-amber-50/50 border border-amber-300 rounded-lg p-2.5 font-bold text-slate-900"
                />
                <span className="text-[11px] text-slate-500">
                  Xuất hiện tại ô ký: <strong>TỔ TRƯỞNG CHUYÊN MÔN</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Năm học áp dụng
                  </label>
                  <input
                    type="text"
                    value={quickForm.academicYear || '2025 - 2026'}
                    onChange={(e) => setQuickForm({ ...quickForm, academicYear: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Giáo viên ra đề
                  </label>
                  <input
                    type="text"
                    value={quickForm.teacherName || ''}
                    onChange={(e) => setQuickForm({ ...quickForm, teacherName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickEditOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Lưu & Áp Dụng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (avoid window.confirm) */}
      {examToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-900 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Xác Nhận Xóa Đề Kiểm Tra</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa đề kiểm tra: <strong className="text-slate-900">"{examToDelete.title}"</strong> (Mã đề: {examToDelete.examCode})? Thao tác này sẽ xóa toàn bộ ma trận và hướng dẫn chấm liên kết.
            </p>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setExamToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteExam(examToDelete.id);
                  setExamToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-md cursor-pointer"
              >
                Xóa Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
