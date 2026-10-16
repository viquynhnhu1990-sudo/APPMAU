import React, { useState } from 'react';
import {
  Library,
  FileText,
  Download,
  Upload,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Search,
  FileSpreadsheet
} from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  category: 'Quy định' | 'Chương trình GDPT' | 'Tài liệu hướng dẫn' | 'Giáo án mẫu';
  issuer: string;
  fileType: 'PDF' | 'DOC' | 'XLS';
  size: string;
  summary: string;
  date: string;
}

export const DocumentLibrary: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      title: 'Thông tư 27/2020/TT-BGDĐT - Quy định đánh giá học sinh tiểu học',
      category: 'Quy định',
      issuer: 'Bộ Giáo dục và Đào tạo',
      fileType: 'PDF',
      size: '1.4 MB',
      summary:
        'Quy định chi tiết việc đánh giá thường xuyên và định kỳ, thang điểm 10, cấu trúc 3 mức độ nhận thức (Mức 1: Biết, Mức 2: Hiểu, Mức 3: Vận dụng).',
      date: '04/09/2020',
    },
    {
      id: 'doc-2',
      title: 'Chương trình Giáo dục phổ thông 2018 - Môn Toán cấp Tiểu học',
      category: 'Chương trình GDPT',
      issuer: 'Bộ GD&ĐT',
      fileType: 'PDF',
      size: '2.8 MB',
      summary:
        'Quy định chuẩn thời lượng, yêu cầu cần đạt và tỉ lệ mạch nội dung: Số & Phép tính (69%), Hình học & Đo lường (23%), Thống kê & Xác suất (3%).',
      date: '26/12/2018',
    },
    {
      id: 'doc-3',
      title: 'Chương trình GDPT 2018 - Môn Tiếng Việt cấp Tiểu học & Quy chuẩn độ dài ngữ liệu',
      category: 'Chương trình GDPT',
      issuer: 'Bộ GD&ĐT',
      fileType: 'PDF',
      size: '3.1 MB',
      summary:
        'Độ dài văn bản đọc hiểu: Lớp 1 (90-130 chữ), Lớp 2 (180-200 chữ), Lớp 3 (200-250 chữ), Lớp 4 (280-330 chữ), Lớp 5 (300-350 chữ).',
      date: '26/12/2018',
    },
    {
      id: 'doc-4',
      title: 'Hướng dẫn đặc thù môn Tin học Tiểu học (Lý thuyết & Thực hành)',
      category: 'Tài liệu hướng dẫn',
      issuer: 'Vụ Giáo dục Tiểu học',
      fileType: 'DOC',
      size: '850 KB',
      summary:
        'Thống nhất tỉ lệ: Lớp 3 (LT 7đ - TH 3đ), Lớp 4 (LT 6đ - TH 4đ), Lớp 5 (LT 5đ - TH 5đ). Hướng dẫn kịch bản Scratch và thực hành Word.',
      date: '15/08/2023',
    },
    {
      id: 'doc-5',
      title: 'Kế hoạch giáo dục nhà trường PTDTBT Tiểu học Chí Cà năm học 2024 - 2025',
      category: 'Giáo án mẫu',
      issuer: 'Trường PTDTBT TH Chí Cà',
      fileType: 'DOC',
      size: '1.2 MB',
      summary:
        'Khung phân phối chương trình, thời gian các đợt kiểm tra định kỳ (Giữa Kì 1, Cuối Kì 1, Giữa Kì 2, Cuối năm) của các khối 1, 2, 3, 4, 5.',
      date: '05/09/2024',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const filtered = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus(`Đã tải lên và lưu vào kho tài liệu chuyên môn: ${file.name}`);
    const newDoc: DocumentItem = {
      id: `doc-custom-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: 'Tài liệu hướng dẫn',
      issuer: 'Giáo viên tải lên',
      fileType: file.name.endsWith('.pdf') ? 'PDF' : file.name.endsWith('.xls') || file.name.endsWith('.xlsx') ? 'XLS' : 'DOC',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      summary: 'Tài liệu tham khảo chuyên môn phục vụ xây dựng ma trận và ra đề kiểm tra định kỳ.',
      date: new Date().toLocaleDateString('vi-VN'),
    };
    setDocuments([newDoc, ...documents]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-blue-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white ring-2 ring-indigo-400/40">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-blue-300 tracking-wider">
                Văn bản quy phạm & Tài liệu chuyên môn
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Kho Tài Liệu Khảo Thí Tiểu Học
              </h2>
            </div>
          </div>

          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-md transition">
            <Upload className="w-4 h-4 mr-1.5" />
            Tải Lên Tài Liệu Mới
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tài liệu, thông tư, hướng dẫn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-medium"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="Quy định">Quy định - Thông tư</option>
            <option value="Chương trình GDPT">Chương trình GDPT 2018</option>
            <option value="Tài liệu hướng dẫn">Tài liệu hướng dẫn ra đề</option>
            <option value="Giáo án mẫu">Kế hoạch nhà trường</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 hover:border-blue-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                doc.fileType === 'PDF'
                  ? 'bg-rose-100 text-rose-700'
                  : doc.fileType === 'XLS'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {doc.fileType}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Ban hành: {doc.issuer} ({doc.date})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Dung lượng: {doc.size}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  {doc.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => alert(`Đang tải tài liệu "${doc.title}"...`)}
                className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center transition"
              >
                <Download className="w-3.5 h-3.5 mr-1 text-slate-600" />
                Tải về
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
