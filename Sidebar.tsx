import React from 'react';
import {
  LayoutDashboard,
  Grid3X3,
  FileCheck2,
  Database,
  FolderKanban,
  Library,
  BarChart3,
  Settings,
  Sparkles,
  BookOpen
} from 'lucide-react';

export type NavigationTab = 
  | 'dashboard'
  | 'matrix-creator'
  | 'exam-creator'
  | 'question-bank'
  | 'exam-list'
  | 'document-library'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  examCount: number;
  matrixCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  examCount,
  matrixCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Tổng quan',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'matrix-creator' as NavigationTab,
      label: 'Tạo ma trận',
      icon: Grid3X3,
      badge: 'Chuẩn TT27',
      badgeColor: 'bg-blue-100 text-blue-700 font-semibold',
    },
    {
      id: 'exam-creator' as NavigationTab,
      label: 'Tạo đề kiểm tra',
      icon: FileCheck2,
      badge: 'AI Hỗ trợ',
      badgeColor: 'bg-emerald-100 text-emerald-700 font-semibold',
    },
    {
      id: 'question-bank' as NavigationTab,
      label: 'Ngân hàng câu hỏi',
      icon: Database,
      badge: null,
    },
    {
      id: 'exam-list' as NavigationTab,
      label: 'Quản lý đề đã tạo',
      icon: FolderKanban,
      badge: examCount > 0 ? examCount.toString() : null,
      badgeColor: 'bg-slate-200 text-slate-800 font-bold',
    },
    {
      id: 'document-library' as NavigationTab,
      label: 'Kho tài liệu',
      icon: Library,
      badge: null,
    },
    {
      id: 'reports' as NavigationTab,
      label: 'Thống kê – Báo cáo',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Cài đặt',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4.5rem)] text-slate-300">
      {/* App branding pill */}
      <div className="p-4 border-b border-slate-800">
        <div className="bg-gradient-to-r from-blue-900/60 to-slate-800 p-3 rounded-xl border border-blue-700/40">
          <div className="flex items-center space-x-2 text-blue-300 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Phần Mềm Chuyên Môn</span>
          </div>
          <div className="text-sm font-extrabold text-white mt-1 leading-snug">
            TẠO ĐỀ MA TRẬN & ĐỀ THI TIỂU HỌC
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
            Phiên bản GDPT 2018
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Chức năng chính
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40">
        <div className="font-semibold text-slate-300">Quy định áp dụng:</div>
        <div className="mt-0.5 text-slate-400 leading-tight">
          • Thông tư 27/2020/TT-BGDĐT<br />
          • Thang điểm 10 - Tỉ lệ 50-30-20%
        </div>
      </div>
    </aside>
  );
};
