import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  School,
  UserCheck,
  CheckCircle2,
  Calendar,
  RotateCcw,
  Building
} from 'lucide-react';
import { SchoolProfile, ExamTerm } from '../types';
import { SCHOOL_PROFILE_DEFAULT } from '../data/standards';

interface SettingsProps {
  profile: SchoolProfile;
  onSaveProfile: (profile: SchoolProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ profile, onSaveProfile }) => {
  const [form, setForm] = useState<SchoolProfile>(profile);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleReset = () => {
    setForm(SCHOOL_PROFILE_DEFAULT);
    onSaveProfile(SCHOOL_PROFILE_DEFAULT);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-blue-800/40">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white ring-2 ring-slate-700">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold text-blue-300 tracking-wider">
              Cấu hình hệ thống & thông tin in ấn
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Cài Đặt Đơn Vị Trường Học & Tổ Chuyên Môn
            </h2>
          </div>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center shadow-xs">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
          <span>Đã lưu thành công cấu hình đơn vị trường học và tổ chuyên môn!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center pb-2 border-b border-slate-100">
            <School className="w-4 h-4 mr-2 text-blue-600" />
            1. Thông Tin Cấp Xã & Đơn Vị Trường Học
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tên Xã (Cấp hành chính)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ví dụ: Chí Cà, Nậm Chảy, Bản Máy... (để trống hiện: ....)"
                  value={form.communeName || ''}
                  onChange={(e) => setForm({ ...form, communeName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Hiển thị trên tiêu đề: <strong>ỦY BAN NHÂN DÂN XÃ {form.communeName ? form.communeName.toUpperCase() : '....'}</strong>
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tên Trường Học
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Tiểu học Tân Phong, Tiểu học Số 1... (để trống hiện: ………)"
                value={form.schoolName || ''}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Hiển thị trên tiêu đề: <strong>TRƯỜNG {form.schoolName ? form.schoolName.toUpperCase() : '………'}</strong>
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tổ chuyên môn phụ trách
              </label>
              <input
                type="text"
                value={form.departmentName}
                onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Năm học áp dụng
              </label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-blue-700"
                placeholder="2025 - 2026"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Chuẩn năm học hiện tại: <strong>2025 - 2026</strong>
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center pb-2 border-b border-slate-100">
            <UserCheck className="w-4 h-4 mr-2 text-indigo-600" />
            2. Cán Bộ Phụ Trách & Chữ Ký Hồ Sơ (Admin Tự Nhập)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tổ trưởng chuyên môn (Admin nhập) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên tổ trưởng (Ví dụ: Nguyễn Thị Hoa)"
                value={form.headOfDepartment || ''}
                onChange={(e) => setForm({ ...form, headOfDepartment: e.target.value })}
                className="w-full bg-amber-50/50 border border-amber-300 rounded-lg p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Tên này xuất hiện tại ô ký duyệt: <strong>TỔ TRƯỞNG CHUYÊN MÔN</strong>
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Giáo viên ra đề / lập ma trận
              </label>
              <input
                type="text"
                value={form.teacherName}
                onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Xuất hiện tại ô ký: <strong>GIÁO VIÊN RA ĐỀ / MA TRẬN</strong>
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Hiệu trưởng / Ban Giám hiệu
              </label>
              <input
                type="text"
                value={form.principalName}
                onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center transition"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-600" />
            Khôi phục mặc định chuẩn 2025 - 2026
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center cursor-pointer"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Lưu Thay Đổi Cấu Hình
          </button>
        </div>
      </form>
    </div>
  );
};
