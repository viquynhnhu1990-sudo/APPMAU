import React from 'react';
import { School, Calendar, CheckCircle2, UserCheck } from 'lucide-react';
import { SchoolProfile } from '../types';

interface HeaderProps {
  profile: SchoolProfile;
  activeTab: string;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onOpenSettings }) => {
  const communeText = profile.communeName?.trim()
    ? `UBND XÃ ${profile.communeName.trim().replace(/^xã\s+/i, '').toUpperCase()}`
    : 'UBND XÃ ....';
  const schoolText = profile.schoolName?.trim()
    ? `TRƯỜNG ${profile.schoolName.trim().replace(/^trường\s+/i, '').toUpperCase()}`
    : 'TRƯỜNG ………';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Left: School and administrative hierarchy */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg ring-2 ring-blue-400/30">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                  {communeText}
                </span>
                <span className="text-xs font-medium text-emerald-400 flex items-center bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/50">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> TT 27/2020 & GDPT 2018
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 mt-0.5">
                {schoolText}
              </h1>
            </div>
          </div>

          {/* Right: Academic Context and User badge */}
          <div className="hidden md:flex items-center space-x-5 text-sm">
            <div className="flex items-center space-x-2 text-slate-300 bg-slate-800/70 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Năm học: <strong className="text-white">{profile.academicYear || '2025 - 2026'}</strong></span>
              <span className="text-slate-500">|</span>
              <span className="text-blue-300 font-medium">{profile.term}</span>
            </div>

            <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-700">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-400/30">
                GV
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200">{profile.teacherName || 'Giáo viên Khảo thí'}</div>
                <div className="text-[11px] text-slate-400">
                  Tổ trưởng: <strong className="text-slate-300">{profile.headOfDepartment || 'Chưa nhập'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
