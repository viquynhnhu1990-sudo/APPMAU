import {
  ExamPackage,
  QuestionItem,
  QuestionFormat,
  GradeLevel,
  SubjectName,
  ExamTerm,
  TextbookSeries,
  MatrixTopicRow,
  SpecificationItem
} from '../types';
import { CIRCULAR_27_SUBJECT_RULES } from '../data/standards';

// Sort order weights for formats
const FORMAT_ORDER_WEIGHT: Record<QuestionFormat, number> = {
  TN_NLC: 1,
  TN_DS: 2,
  TN_NC: 3,
  TN_DK: 4,
  TL: 5,
  TH: 6,
};

/**
 * Sorts questions strictly following GDPT 2018 & TT27 primary exam rules:
 * 1. All Trắc nghiệm first, then all Tự luận, then Thực hành (nếu có).
 * 2. Trắc nghiệm:
 *    - Mức 1 (Biết): Biết NLC -> Biết ĐS -> Biết NC -> Biết ĐK
 *    - Mức 2 (Hiểu): Hiểu NLC -> Hiểu ĐS -> Hiểu NC -> Hiểu ĐK
 * 3. Tự luận:
 *    - Lần lượt từ Mức 1 (Biết) -> Mức 2 (Hiểu) -> Mức 3 (Vận dụng)
 * 4. Number sequentially from 1 to N.
 */
export function sortAndRenumberQuestions(questions: QuestionItem[]): QuestionItem[] {
  const sorted = [...questions].sort((a, b) => {
    const isATn = a.format.startsWith('TN');
    const isBTn = b.format.startsWith('TN');

    // Rule 1: Trắc nghiệm before Tự luận / Thực hành
    if (isATn && !isBTn) return -1;
    if (!isATn && isBTn) return 1;

    // Both are Trắc nghiệm
    if (isATn && isBTn) {
      // M1 before M2
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      // Same level: NLC -> DS -> NC -> DK
      return (FORMAT_ORDER_WEIGHT[a.format] || 0) - (FORMAT_ORDER_WEIGHT[b.format] || 0);
    }

    // Both are Tự luận / Thực hành: M1 -> M2 -> M3
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    return (FORMAT_ORDER_WEIGHT[a.format] || 0) - (FORMAT_ORDER_WEIGHT[b.format] || 0);
  });

  // Re-number sequentially from 1 to N
  return sorted.map((q, idx) => ({
    ...q,
    orderNumber: idx + 1,
  }));
}

/**
 * Validates pedagogical criteria according to TT27 and GDPT 2018
 */
export function validatePedagogicalStandard(
  grade: GradeLevel,
  subject: SubjectName,
  questions: QuestionItem[],
  matrixTopics: MatrixTopicRow[]
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalPoints: number;
    mcqPoints: number;
    essayPoints: number;
    level1Points: number;
    level2Points: number;
    level3Points: number;
  };
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  let totalPoints = 0;
  let mcqPoints = 0;
  let essayPoints = 0;
  let level1Points = 0;
  let level2Points = 0;
  let level3Points = 0;

  let seenEssay = false;
  let sortingViolated = false;

  const expectedOptions = grade <= 3 ? 3 : 4;

  questions.forEach((q, idx) => {
    totalPoints += q.points;

    if (q.format.startsWith('TN')) {
      mcqPoints += q.points;
      if (seenEssay) {
        sortingViolated = true;
      }
      // Check multiple choice option count
      if (q.format === 'TN_NLC' && q.options) {
        if (q.options.length !== expectedOptions) {
          warnings.push(
            `Câu ${q.orderNumber}: Lớp ${grade} quy định trắc nghiệm nhiều lựa chọn gồm ${expectedOptions} phương án (hiện có ${q.options.length} phương án).`
          );
        }
      }
    } else {
      essayPoints += q.points;
      seenEssay = true;
    }

    if (q.level === 1) level1Points += q.points;
    else if (q.level === 2) level2Points += q.points;
    else if (q.level === 3) {
      level3Points += q.points;
      // Strict Pedagogical Rule: KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (MỨC 3)
      if (q.format.startsWith('TN')) {
        errors.push(
          `Câu ${q.orderNumber}: Vi phạm quy chuẩn sư phạm tiểu học: KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (Mức 3). Ở Mức 3 chỉ được phép sử dụng câu hỏi Tự luận (hoặc Thực hành đối với môn Tin học).`
        );
      }
    }

    // Check sequential numbering
    if (q.orderNumber !== idx + 1) {
      errors.push(`Số thứ tự câu hỏi bị gián đoạn ở vị trí ${idx + 1} (Câu ${q.orderNumber}).`);
    }
  });

  // Check matrix topics: No TN at Level 3
  matrixTopics.forEach((t) => {
    if (t.cell.level3TNCount > 0 || t.cell.level3TNPoints > 0) {
      errors.push(
        `Ma trận chủ đề "${t.topicName}": Không được phân bổ câu Trắc nghiệm ở Mức 3 (Vận dụng). Toàn bộ câu hỏi Mức 3 phải là Tự luận / Thực hành.`
      );
    }
  });

  // Total points check (rounded to 2 decimal places)
  const roundedTotal = Math.round(totalPoints * 100) / 100;
  if (roundedTotal !== 10) {
    errors.push(`Tổng điểm của đề là ${roundedTotal} điểm (Bắt buộc phải đúng 10,0 điểm).`);
  }

  // Sequence check
  if (sortingViolated) {
    errors.push('Thứ tự câu hỏi vi phạm quy tắc: Tất cả câu Trắc nghiệm phải xếp trước câu Tự luận.');
  }

  // Check level 1, 2, 3 distribution
  const rule = CIRCULAR_27_SUBJECT_RULES[subject];
  if (rule) {
    const l1Pct = (level1Points / 10) * 100;
    const l2Pct = (level2Points / 10) * 100;
    const l3Pct = (level3Points / 10) * 100;

    if (l1Pct < 35 || l1Pct > 60) {
      warnings.push(`Tỉ lệ Mức 1 (hiện tại: ${l1Pct}%) nên dao động trong khoảng 40% - 50%.`);
    }
    if (l2Pct < 20 || l2Pct > 40) {
      warnings.push(`Tỉ lệ Mức 2 (hiện tại: ${l2Pct}%) nên dao động quanh 30%.`);
    }
    if (l3Pct < 10 || l3Pct > 30) {
      warnings.push(`Tỉ lệ Mức 3 (hiện tại: ${l3Pct}%) nên dao động quanh 20%.`);
    }
  }

  // Check no cross-topic merging
  const topicNames = new Set(matrixTopics.map((t) => t.topicName));
  questions.forEach((q) => {
    if (!topicNames.has(q.topicName)) {
      warnings.push(`Câu ${q.orderNumber} có chủ đề "${q.topicName}" chưa khớp với ma trận.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalPoints: roundedTotal,
      mcqPoints: Math.round(mcqPoints * 100) / 100,
      essayPoints: Math.round(essayPoints * 100) / 100,
      level1Points: Math.round(level1Points * 100) / 100,
      level2Points: Math.round(level2Points * 100) / 100,
      level3Points: Math.round(level3Points * 100) / 100,
    },
  };
}

/**
 * Builds specifications table from matrix and sorted questions
 */
export function buildSpecificationsFromExam(
  matrixTopics: MatrixTopicRow[],
  questions: QuestionItem[]
): SpecificationItem[] {
  const specs: SpecificationItem[] = [];

  matrixTopics.forEach((topic) => {
    // Collect questions matching this topic
    const topicQuestions = questions.filter((q) => q.topicName === topic.topicName);

    // Group questions by content unit & level
    topicQuestions.forEach((q) => {
      let outcome = '';
      if (q.level === 1) {
        outcome = topic.expectedOutcomes.level1[0] || 'Nhận biết được kiến thức trọng tâm';
      } else if (q.level === 2) {
        outcome = topic.expectedOutcomes.level2[0] || 'Hiểu và kết nối giải quyết bài tập cơ bản';
      } else {
        outcome = topic.expectedOutcomes.level3[0] || 'Vận dụng giải quyết vấn đề thực tiễn';
      }

      specs.push({
        id: `spec-${q.id}`,
        topicId: topic.id,
        topicName: topic.topicName,
        contentUnit: q.contentUnit || topic.lessonContent,
        level: q.level,
        outcomeRequirement: outcome,
        questionType: q.format,
        questionNumbers: [q.orderNumber],
        points: q.points,
      });
    });
  });

  return specs;
}

/**
 * Generates an alternative exam code (Mã đề hoán vị A/B/C/D hoặc 101/102/103)
 * by permuting MCQ question order within each level and shuffling options.
 */
export function createPermutedExamCode(
  exam: ExamPackage,
  newCode: string
): ExamPackage {
  // Deep clone questions
  const clonedQuestions: QuestionItem[] = JSON.parse(JSON.stringify(exam.questions));

  // Separate MCQs and Essays
  const mcqs = clonedQuestions.filter((q) => q.format.startsWith('TN'));
  const essays = clonedQuestions.filter((q) => !q.format.startsWith('TN'));

  // Helper to shuffle array with deterministic seed
  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Group MCQs by Level and Format, then shuffle within group
  const m1_nlc = shuffle(mcqs.filter((q) => q.level === 1 && q.format === 'TN_NLC'));
  const m1_others = shuffle(mcqs.filter((q) => q.level === 1 && q.format !== 'TN_NLC'));
  const m2_nlc = shuffle(mcqs.filter((q) => q.level === 2 && q.format === 'TN_NLC'));
  const m2_others = shuffle(mcqs.filter((q) => q.level === 2 && q.format !== 'TN_NLC'));

  // Also shuffle options in NLC
  const shuffleOptions = (q: QuestionItem) => {
    if (q.format === 'TN_NLC' && q.options && q.options.length > 0) {
      const correctOption = q.options.find((o) => o.key === q.correctAnswer);
      const shuffledTexts = shuffle(q.options.map((o) => o.content));
      const keys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
      const newOptions = shuffledTexts.map((txt, i) => ({
        key: keys[i],
        content: txt,
      }));
      if (correctOption) {
        const newCorrect = newOptions.find((o) => o.content === correctOption.content);
        if (newCorrect) {
          q.correctAnswer = newCorrect.key;
        }
      }
      q.options = newOptions;
    }
    return q;
  };

  const permutedMCQs = [...m1_nlc, ...m1_others, ...m2_nlc, ...m2_others].map(shuffleOptions);
  const combined = sortAndRenumberQuestions([...permutedMCQs, ...essays]);

  return {
    ...exam,
    id: `${exam.id}-${newCode}`,
    title: `${exam.title} - Mã đề ${newCode}`,
    examCode: newCode,
    questions: combined,
    updatedAt: new Date().toISOString(),
  };
}
