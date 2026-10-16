export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type SubjectName = 
  | 'Toán'
  | 'Tiếng Việt'
  | 'Tin học'
  | 'Công nghệ'
  | 'Khoa học'
  | 'Lịch sử và Địa lí'
  | 'Tiếng Anh';

export type ExamTerm = 'Giữa HKI' | 'Cuối HKI' | 'Giữa HKII' | 'Cuối năm';

export type TextbookSeries = 
  | 'Kết nối tri thức với cuộc sống'
  | 'Cánh Diều'
  | 'Chân trời sáng tạo';

export type QuestionLevel = 1 | 2 | 3; // 1: Nhận biết, 2: Kết nối/Hiểu, 3: Vận dụng

export type QuestionFormat = 
  | 'TN_NLC' // Trắc nghiệm nhiều lựa chọn
  | 'TN_DS'  // Trắc nghiệm đúng sai
  | 'TN_NC'  // Trắc nghiệm nối cột
  | 'TN_DK'  // Trắc nghiệm điền khuyết
  | 'TL'     // Tự luận
  | 'TH';    // Thực hành (môn Tin học)

export interface MatrixCell {
  level1TNCount: number;
  level1TNPoints: number;
  level1TLCount: number;
  level1TLPoints: number;
  
  level2TNCount: number;
  level2TNPoints: number;
  level2TLCount: number;
  level2TLPoints: number;

  level3TNCount: number;
  level3TNPoints: number;
  level3TLCount: number;
  level3TLPoints: number;

  totalPoints: number;
}

export interface MatrixTopicRow {
  id: string;
  topicName: string; // Mạch kiến thức / Chủ đề
  lessonContent: string; // Đơn vị kiến thức / bài học
  expectedOutcomes: {
    level1: string[];
    level2: string[];
    level3: string[];
  };
  cell: MatrixCell;
}

export interface SpecificationItem {
  id: string;
  topicId: string;
  topicName: string;
  contentUnit: string; // Đơn vị kiến thức / Kỹ năng
  level: QuestionLevel;
  outcomeRequirement: string; // Yêu cầu cần đạt
  questionType: QuestionFormat;
  questionNumbers: number[]; // Số thứ tự các câu trong đề (VD: Câu 1, Câu 2)
  points: number;
}

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  content: string;
}

export interface MatchPair {
  leftKey: string;
  leftText: string;
  rightKey: string;
  rightText: string;
}

export interface QuestionItem {
  id: string;
  orderNumber: number; // Thứ tự câu (1, 2, 3...)
  topicName: string;
  contentUnit: string;
  format: QuestionFormat;
  level: QuestionLevel;
  points: number;
  prompt: string; // Nội dung câu hỏi
  subItems?: { label: string; text: string; points: number }[]; // Các ý a, b, c...
  options?: QuestionOption[]; // Dành cho TN_NLC (3 phương án cho lớp 1-3, 4 phương án cho lớp 4-5)
  matchPairs?: MatchPair[]; // Dành cho TN_NC
  blankSentence?: string; // Dành cho TN_DK
  fillWordBank?: string[];
  correctAnswer: string; // Đáp án đúng: A, B, C... hoặc text
  explanation: string; // Lời giải thích chi tiết
  gradingGuide: string; // Hướng dẫn chấm từng bước & biểu điểm
  hasGridVisual?: boolean; // Vẽ lưới ô vuông tiểu học nếu có
  gridData?: { rows: number; cols: number; label?: string };
}

export interface ExamPackage {
  id: string;
  title: string;
  communeName?: string; // Tên Xã (ví dụ: XÃ CHÍ CÀ hoặc xã tùy chọn)
  schoolName: string;
  academicYear: string;
  grade: GradeLevel;
  subject: SubjectName;
  term: ExamTerm;
  textbook: TextbookSeries;
  teacherName: string;
  durationMinutes: number; // 35, 40...
  createdAt: string;
  updatedAt: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED';
  examCode: string; // Ví dụ: Đề 01, Mã 101, Mã 102...
  
  // Reading passage for Vietnamese (Văn bản đọc hiểu)
  readingPassage?: {
    title: string;
    author?: string;
    content: string;
    genre: 'truyện' | 'thơ' | 'miêu tả' | 'thông tin';
    wordCount: number;
  };

  // Matrix and specifications
  matrixTopics: MatrixTopicRow[];
  specifications: SpecificationItem[];
  questions: QuestionItem[];

  // Meta totals & validation
  totalPoints: number;
  totalQuestions: number;
  mcqPoints: number;
  essayPoints: number;
  level1Points: number;
  level2Points: number;
  level3Points: number;
  
  pedagogicalValidation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}
export interface SchoolProfile {
  communeName?: string; // Tên Xã (ví dụ: XÃ CHÍ CÀ hoặc xã tùy chọn)
  schoolName: string;
  departmentName: string;
  academicYear: string;
  term: ExamTerm;
  teacherName: string;
  headOfDepartment: string; // Tổ trưởng chuyên môn do admin nhập
  principalName: string; // Hiệu trưởng
  city: string;
}
