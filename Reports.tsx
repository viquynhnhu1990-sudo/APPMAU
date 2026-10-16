import React from 'react';
import {
  BarChart3,
  PieChart,
  CheckCircle2,
  Award,
  Layers,
  School,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { ExamPackage, SchoolProfile } from '../types';

interface ReportsProps {
  exams: ExamPackage[];
  profile: SchoolProfile;
}

export const Reports: React.FC<ReportsProps> = ({ exams, profile }) => {
  const totalExams = exams.length;
  const totalQuestions = exams.reduce((acc, e) => acc + e.questions.length, 0);

  // Average level points across all exams
  const avgLevel1 = totalExams
    ? exams.reduce((acc, e) => acc + e.level1Points, 0) / totalExams
    : 5;
  const avgLevel2 = totalExams
    ? exams.reduce((acc, e) => acc + e.level2Points, 0) / totalExams
    : 3;
  const avgLevel3 = totalExams
    ? exams.reduce((acc, e) => acc + e.level3Points, 0) / totalExams
    : 2;

  // Average format points
  const avgMcq = totalExams
    ? exams.reduce((acc, e) => acc + e.mcqPoints, 0) / totalExams
    : 6;
  const avgEssay = totalExams
    ? exams.reduce((acc, e) => acc + e.essayPoints, 0) / totalExams
    : 4;

  // Grade count breakdown
  const gradeCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  exams.forEach((e) => {
    gradeCounts[e.grade] = (gradeCounts[e.grade] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-blue-800/40">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white ring-2 ring-blue-400/40">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold text-blue-300 tracking-wider">
              Báo cáo chất lượng đề thi theo Thông tư 27
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Thống Kê Khảo Thí & Phân Tích Ma Trận
            </h2>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Tổng Đề Kiểm Tra</div>
          <div className="text-3xl font-extrabold text-blue-700 mt-1">{totalExams}</div>
          <div className="text-[11px] text-slate-400 mt-1">Năm học {profile.academicYear}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Tổng Số Câu Hỏi</div>
          <div className="text-3xl font-extrabold text-indigo-700 mt-1">{totalQuestions}</div>
          <div className="text-[11px] text-slate-400 mt-1">Đã kiểm duyệt đặc tả</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Tỉ Lệ Mức Độ Trung Bình</div>
          <div className="text-xl font-bold text-slate-800 mt-2">
            {((avgLevel1 / 10) * 100).toFixed(0)}% - {((avgLevel2 / 10) * 100).toFixed(0)}% - {((avgLevel3 / 10) * 100).toFixed(0)}%
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Chuẩn vàng 50-30-20%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Tỉ Lệ Hình Thức Đề</div>
          <div className="text-xl font-bold text-slate-800 mt-2">
            {((avgMcq / 10) * 100).toFixed(0)}% TN / {((avgEssay / 10) * 100).toFixed(0)}% TL
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">✓ Chuẩn 60% TN - 40% TL</div>
        </div>
      </div>

      {/* Visual Progress Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Level Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase flex items-center">
            <Layers className="w-4 h-4 mr-2 text-blue-600" />
            1. Phân Bổ Mức Độ Nhận Thức (Toàn Trường)
          </h3>
          <p className="text-xs text-slate-500">
            Căn cứ Thông tư 27/2020/TT-BGDĐT: Đánh giá theo 3 mức độ (Mức 1: Biết, Mức 2: Hiểu/Kết nối, Mức 3: Vận dụng).
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-900">Mức 1 (Nhận biết)</span>
                <span className="text-blue-700">{((avgLevel1 / 10) * 100).toFixed(1)}% (Khoảng 5,0 điểm)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(avgLevel1 / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-indigo-900">Mức 2 (Kết nối / Hiểu)</span>
                <span className="text-indigo-700">{((avgLevel2 / 10) * 100).toFixed(1)}% (Khoảng 3,0 điểm)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${(avgLevel2 / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-900">Mức 3 (Vận dụng)</span>
                <span className="text-amber-700">{((avgLevel3 / 10) * 100).toFixed(1)}% (Khoảng 2,0 điểm)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(avgLevel3 / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase flex items-center">
            <School className="w-4 h-4 mr-2 text-indigo-600" />
            2. Phân Bổ Đề Kiểm Tra Theo Khối Lớp
          </h3>
          <p className="text-xs text-slate-500">
            Số lượng bộ đề định kỳ đã hoàn thiện theo từng khối lớp từ Lớp 1 đến Lớp 5.
          </p>

          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((g) => {
              const count = gradeCounts[g] || 0;
              const pct = totalExams ? (count / totalExams) * 100 : 20;

              return (
                <div key={g}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-800">Khối Lớp {g}</span>
                    <span className="text-slate-600">{count} bộ đề ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
