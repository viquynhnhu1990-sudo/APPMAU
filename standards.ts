import { GradeLevel, SubjectName, ExamTerm, TextbookSeries } from '../types';

export interface SubjectRule {
  subject: SubjectName;
  gradeLevels: GradeLevel[];
  hasPracticalExam?: boolean;
  mcqRatio: number; // e.g. 0.6 = 60%
  essayRatio: number; // e.g. 0.4 = 40%
  levelRatio: {
    level1: number; // 0.5 = 50%
    level2: number; // 0.3 = 30%
    level3: number; // 0.2 = 20%
  };
  durationMinutes: number;
  optionsCount: (grade: GradeLevel) => 3 | 4;
}

export const CIRCULAR_27_SUBJECT_RULES: Record<SubjectName, SubjectRule> = {
  Toán: {
    subject: 'Toán',
    gradeLevels: [1, 2, 3, 4, 5],
    mcqRatio: 0.6,
    essayRatio: 0.4,
    levelRatio: { level1: 0.5, level2: 0.3, level3: 0.2 },
    durationMinutes: 40,
    optionsCount: (grade: GradeLevel) => (grade <= 3 ? 3 : 4),
  },
  'Tiếng Việt': {
    subject: 'Tiếng Việt',
    gradeLevels: [1, 2, 3, 4, 5],
    mcqRatio: 0.5,
    essayRatio: 0.5,
    levelRatio: { level1: 0.4, level2: 0.3, level3: 0.3 },
    durationMinutes: 40,
    optionsCount: (grade: GradeLevel) => (grade <= 3 ? 3 : 4),
  },
  'Tin học': {
    subject: 'Tin học',
    gradeLevels: [3, 4, 5],
    hasPracticalExam: true,
    mcqRatio: 0.6,
    essayRatio: 0.4,
    levelRatio: { level1: 0.5, level2: 0.3, level3: 0.2 },
    durationMinutes: 35,
    optionsCount: (grade: GradeLevel) => (grade <= 3 ? 3 : 4),
  },
  'Khoa học': {
    subject: 'Khoa học',
    gradeLevels: [4, 5],
    mcqRatio: 0.6,
    essayRatio: 0.4,
    levelRatio: { level1: 0.5, level2: 0.3, level3: 0.2 },
    durationMinutes: 35,
    optionsCount: () => 4,
  },
  'Lịch sử và Địa lí': {
    subject: 'Lịch sử và Địa lí',
    gradeLevels: [4, 5],
    mcqRatio: 0.6,
    essayRatio: 0.4,
    levelRatio: { level1: 0.5, level2: 0.3, level3: 0.2 },
    durationMinutes: 35,
    optionsCount: () => 4,
  },
  'Công nghệ': {
    subject: 'Công nghệ',
    gradeLevels: [3, 4, 5],
    mcqRatio: 0.6,
    essayRatio: 0.4,
    levelRatio: { level1: 0.5, level2: 0.3, level3: 0.2 },
    durationMinutes: 35,
    optionsCount: (grade: GradeLevel) => (grade <= 3 ? 3 : 4),
  },
  'Tiếng Anh': {
    subject: 'Tiếng Anh',
    gradeLevels: [3, 4, 5],
    mcqRatio: 0.7,
    essayRatio: 0.3,
    levelRatio: { level1: 0.5, level2: 0.3, level3: 0.2 },
    durationMinutes: 35,
    optionsCount: (grade: GradeLevel) => (grade <= 3 ? 3 : 4),
  },
};

// Filter subjects permitted for periodic graded assessment under Circular 27
export function getSubjectsForGrade(grade: GradeLevel): SubjectName[] {
  if (grade === 1 || grade === 2) {
    return ['Toán', 'Tiếng Việt'];
  }
  if (grade === 3) {
    return ['Toán', 'Tiếng Việt', 'Tin học', 'Công nghệ', 'Tiếng Anh'];
  }
  return ['Toán', 'Tiếng Việt', 'Khoa học', 'Lịch sử và Địa lí', 'Tin học', 'Công nghệ', 'Tiếng Anh'];
}

// Math knowledge strand weights by grade and term
export const MATH_STRANDS_BY_GRADE_TERM: Record<
  GradeLevel,
  Record<ExamTerm, { numberAndOps: number; geometryAndMeasure: number; statsAndProb: number }>
> = {
  1: {
    'Giữa HKI': { numberAndOps: 80, geometryAndMeasure: 20, statsAndProb: 0 },
    'Cuối HKI': { numberAndOps: 80, geometryAndMeasure: 20, statsAndProb: 0 },
    'Giữa HKII': { numberAndOps: 80, geometryAndMeasure: 20, statsAndProb: 0 },
    'Cuối năm': { numberAndOps: 80, geometryAndMeasure: 20, statsAndProb: 0 },
  },
  2: {
    'Giữa HKI': { numberAndOps: 75, geometryAndMeasure: 25, statsAndProb: 0 },
    'Cuối HKI': { numberAndOps: 70, geometryAndMeasure: 30, statsAndProb: 0 },
    'Giữa HKII': { numberAndOps: 70, geometryAndMeasure: 25, statsAndProb: 5 },
    'Cuối năm': { numberAndOps: 70, geometryAndMeasure: 20, statsAndProb: 10 },
  },
  3: {
    'Giữa HKI': { numberAndOps: 75, geometryAndMeasure: 25, statsAndProb: 0 },
    'Cuối HKI': { numberAndOps: 70, geometryAndMeasure: 30, statsAndProb: 0 },
    'Giữa HKII': { numberAndOps: 70, geometryAndMeasure: 25, statsAndProb: 5 },
    'Cuối năm': { numberAndOps: 70, geometryAndMeasure: 20, statsAndProb: 10 },
  },
  4: {
    'Giữa HKI': { numberAndOps: 70, geometryAndMeasure: 30, statsAndProb: 0 },
    'Cuối HKI': { numberAndOps: 50, geometryAndMeasure: 50, statsAndProb: 0 },
    'Giữa HKII': { numberAndOps: 70, geometryAndMeasure: 30, statsAndProb: 0 },
    'Cuối năm': { numberAndOps: 70, geometryAndMeasure: 20, statsAndProb: 10 },
  },
  5: {
    'Giữa HKI': { numberAndOps: 80, geometryAndMeasure: 20, statsAndProb: 0 },
    'Cuối HKI': { numberAndOps: 60, geometryAndMeasure: 40, statsAndProb: 0 },
    'Giữa HKII': { numberAndOps: 50, geometryAndMeasure: 50, statsAndProb: 0 },
    'Cuối năm': { numberAndOps: 50, geometryAndMeasure: 40, statsAndProb: 10 },
  },
};

// Reading passage length guidelines for Vietnamese (Chương trình GDPT 2018)
export const VIETNAMESE_PASSAGE_LENGTHS: Record<
  GradeLevel,
  {
    storyRange: string;
    descriptionRange: string;
    poemRange: string;
    infoRange?: string;
  }
> = {
  1: {
    storyRange: '90 – 130 chữ',
    descriptionRange: '90 – 130 chữ',
    poemRange: '50 – 70 chữ',
  },
  2: {
    storyRange: '180 – 200 chữ',
    descriptionRange: '150 – 180 chữ',
    poemRange: '70 – 90 chữ',
    infoRange: '110 – 140 chữ',
  },
  3: {
    storyRange: '200 – 250 chữ',
    descriptionRange: '180 – 200 chữ',
    poemRange: '80 – 100 chữ',
    infoRange: '120 – 150 chữ',
  },
  4: {
    storyRange: '280 – 330 chữ',
    descriptionRange: '200 – 250 chữ',
    poemRange: '100 – 120 chữ',
    infoRange: '150 – 180 chữ',
  },
  5: {
    storyRange: '300 – 350 chữ',
    descriptionRange: '200 – 250 chữ',
    poemRange: '110 – 130 chữ',
    infoRange: 'khoảng 230 chữ',
  },
};

// Informatics Theory vs Practice guidelines by grade
export const INFORMATICS_STANDARDS: Record<
  3 | 4 | 5,
  {
    theoryPoints: number;
    practicalPoints: number;
    notes: string;
    semester1Structure: string;
    yearEndStructure: string;
  }
> = {
  3: {
    theoryPoints: 7,
    practicalPoints: 3,
    notes: 'Trắc nghiệm 6 câu (3đ - 4đ), Tự luận & Thực hành (6đ - 7đ)',
    semester1Structure: 'Trắc nghiệm 6 câu, Tự luận 4 câu (4 điểm lý thuyết)',
    yearEndStructure: 'Trắc nghiệm 6 câu, Tự luận 2 câu (2 điểm), Thực hành 1 câu (3 điểm)',
  },
  4: {
    theoryPoints: 6,
    practicalPoints: 4,
    notes: 'Trắc nghiệm 6 câu (3đ - 4đ), Tự luận 2 câu (2đ), Thực hành 2 câu (4đ)',
    semester1Structure: 'Trắc nghiệm 6 câu, Tự luận 2 câu, Thực hành 2 câu thao tác phần mềm',
    yearEndStructure: 'Trắc nghiệm 6 câu, Tự luận 2 câu, Thực hành 2 câu lập trình Scratch / Soạn thảo',
  },
  5: {
    theoryPoints: 5,
    practicalPoints: 5,
    notes: 'Trắc nghiệm 5 câu (2.5đ - 3đ), Tự luận & Thực hành 5đ',
    semester1Structure: 'Trắc nghiệm 5 câu, Tự luận 3 câu (3 điểm), Thực hành 2 câu (2 điểm)',
    yearEndStructure: 'Trắc nghiệm 5 câu, Tự luận 2 câu (2 điểm), Thực hành 3 câu (3 điểm)',
  },
};

export const TEXTBOOK_SERIES: TextbookSeries[] = [
  'Kết nối tri thức với cuộc sống',
  'Cánh Diều',
  'Chân trời sáng tạo',
];

export const SCHOOL_PROFILE_DEFAULT = {
  communeName: '', // Để admin nhập (hiển thị: ỦY BAN NHÂN DÂN XÃ ....)
  schoolName: '',  // Bỏ cố định PTDTBT TIỂU HỌC CHÍ CÀ (hiển thị: TRƯỜNG ………)
  departmentName: 'TỔ CHUYÊN MÔN TIỂU HỌC',
  academicYear: '2025 - 2026',
  term: 'Cuối HKI' as ExamTerm,
  teacherName: 'Giáo viên Khảo thí',
  headOfDepartment: '', // Tên tổ trưởng do admin tự nhập
  principalName: '',
  city: '',
};
