import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MatrixCreator } from './components/MatrixCreator';
import { ExamCreator } from './components/ExamCreator';
import { QuestionBank } from './components/QuestionBank';
import { DocumentLibrary } from './components/DocumentLibrary';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { ExamPreviewModal } from './components/ExamPreviewModal';
import { ExamPackage, SchoolProfile, GradeLevel, SubjectName, ExamTerm, TextbookSeries, MatrixTopicRow } from './types';
import { SAMPLE_EXAMS } from './data/sampleExams';
import { SCHOOL_PROFILE_DEFAULT } from './data/standards';
import { createPermutedExamCode } from './utils/examGenerator';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Persistence for School Profile
  const [profile, setProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem('tieuhoc_school_profile');
      if (saved) {
        return JSON.parse(saved);
      }
      return SCHOOL_PROFILE_DEFAULT;
    } catch {
      return SCHOOL_PROFILE_DEFAULT;
    }
  });

  // Persistence for Exams list
  const [exams, setExams] = useState<ExamPackage[]>(() => {
    try {
      const saved = localStorage.getItem('tieuhoc_exams_list');
      return saved ? JSON.parse(saved) : SAMPLE_EXAMS;
    } catch {
      return SAMPLE_EXAMS;
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Preview Modal state
  const [previewExam, setPreviewExam] = useState<ExamPackage | null>(null);

  // Toast notification state (avoid window.alert)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Transient state for handing off matrix to exam creator
  const [activeMatrixData, setActiveMatrixData] = useState<{
    grade: GradeLevel;
    subject: SubjectName;
    term: ExamTerm;
    textbook: TextbookSeries;
    durationMinutes: number;
    matrixTopics: MatrixTopicRow[];
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('tieuhoc_school_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('tieuhoc_exams_list', JSON.stringify(exams));
    } catch (e) {
      console.error(e);
    }
  }, [exams]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleSaveProfile = (newProfile: SchoolProfile) => {
    setProfile(newProfile);
    showToast('Đã lưu thông tin trường học & tổ chuyên môn thành công!');
  };

  const handleSaveExam = (savedExam: ExamPackage) => {
    setExams((prev) => {
      const existingIdx = prev.findIndex((e) => e.id === savedExam.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = savedExam;
        return copy;
      }
      return [savedExam, ...prev];
    });
    showToast('Đã lưu đề kiểm tra thành công!');
  };

  const handleDeleteExam = (id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    if (previewExam?.id === id) {
      setPreviewExam(null);
    }
    showToast('Đã xóa đề kiểm tra.');
  };

  const handleDuplicateExam = (exam: ExamPackage) => {
    const nextCode = (parseInt(exam.examCode, 10) + 1).toString();
    const permuted = createPermutedExamCode(exam, nextCode);
    setExams((prev) => [permuted, ...prev]);
    setPreviewExam(permuted);
    showToast(`Đã tạo mã đề mới (${nextCode}) thành công!`);
  };

  const handleApproveExam = (examId: string) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, status: 'APPROVED' } : e))
    );
    if (previewExam && previewExam.id === examId) {
      setPreviewExam({ ...previewExam, status: 'APPROVED' });
    }
    showToast('Tổ trưởng đã duyệt đề kiểm tra!');
  };

  const handleMatrixCreated = (
    matrixData: {
      grade: GradeLevel;
      subject: SubjectName;
      term: ExamTerm;
      textbook: TextbookSeries;
      durationMinutes: number;
      matrixTopics: MatrixTopicRow[];
    },
    proceedToExam = false
  ) => {
    setActiveMatrixData(matrixData);
    if (proceedToExam) {
      setActiveTab('exam-creator');
    } else {
      showToast('Đã lưu cấu trúc ma trận thành công!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Main Header */}
      <Header
        profile={profile}
        activeTab={activeTab}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar Menu */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          examCount={exams.length}
          matrixCount={exams.length + 2}
        />

        {/* Center Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <Dashboard
              profile={profile}
              exams={exams}
              matrixCount={exams.length + 2}
              onCreateMatrix={() => setActiveTab('matrix-creator')}
              onCreateExam={() => setActiveTab('exam-creator')}
              onPreviewExam={(e) => setPreviewExam(e)}
              onDeleteExam={handleDeleteExam}
              onDuplicateExam={handleDuplicateExam}
              onOpenSettings={() => setActiveTab('settings')}
              onUpdateProfile={handleSaveProfile}
            />
          )}

          {activeTab === 'exam-list' && (
            <Dashboard
              profile={profile}
              exams={exams}
              matrixCount={exams.length + 2}
              onCreateMatrix={() => setActiveTab('matrix-creator')}
              onCreateExam={() => setActiveTab('exam-creator')}
              onPreviewExam={(e) => setPreviewExam(e)}
              onDeleteExam={handleDeleteExam}
              onDuplicateExam={handleDuplicateExam}
              onOpenSettings={() => setActiveTab('settings')}
              onUpdateProfile={handleSaveProfile}
            />
          )}

          {activeTab === 'matrix-creator' && (
            <MatrixCreator
              profile={profile}
              onMatrixCreated={handleMatrixCreated}
            />
          )}

          {activeTab === 'exam-creator' && (
            <ExamCreator
              profile={profile}
              initialMatrixData={activeMatrixData}
              onSaveExam={handleSaveExam}
              onOpenPreview={(e) => setPreviewExam(e)}
            />
          )}

          {activeTab === 'question-bank' && <QuestionBank />}

          {activeTab === 'document-library' && <DocumentLibrary />}

          {activeTab === 'reports' && (
            <Reports exams={exams} profile={profile} />
          )}

          {activeTab === 'settings' && (
            <Settings profile={profile} onSaveProfile={handleSaveProfile} />
          )}
        </main>
      </div>

      {/* 5-in-1 Full Preview and Export Modal */}
      {previewExam && (
        <ExamPreviewModal
          exam={previewExam}
          profile={profile}
          isOpen={!!previewExam}
          onClose={() => setPreviewExam(null)}
          onApprove={handleApproveExam}
        />
      )}

      {/* Global In-App Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 border border-slate-700 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
