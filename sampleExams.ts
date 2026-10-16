import { ExamPackage } from '../types';
import { SCHOOL_PROFILE_DEFAULT } from './standards';

export const SAMPLE_EXAMS: ExamPackage[] = [
  {
    id: 'exam-toan-4-cki',
    title: 'Đề Kiểm tra Định kỳ Cuối Học kỳ I - Toán 4',
    schoolName: SCHOOL_PROFILE_DEFAULT.schoolName,
    academicYear: '2025 - 2026',
    communeName: 'CHÍ CÀ',
    grade: 4,
    subject: 'Toán',
    term: 'Cuối HKI',
    textbook: 'Kết nối tri thức với cuộc sống',
    teacherName: 'Nguyễn Văn Hoan',
    durationMinutes: 40,
    createdAt: '2025-12-20T08:00:00.000Z',
    updatedAt: '2025-12-20T08:00:00.000Z',
    status: 'APPROVED',
    examCode: '101',
    matrixTopics: [
      {
        id: 'top-1',
        topicName: 'Số và phép tính',
        lessonContent: 'Số có nhiều chữ số; Các phép tính cộng, trừ, nhân, chia; Tính chất kết hợp, giao hoán',
        expectedOutcomes: {
          level1: ['Nhận biết được hàng và lớp của số có nhiều chữ số', 'Thực hiện được phép cộng, trừ cơ bản'],
          level2: ['Tính giá trị biểu thức chứa chữ', 'Vận dụng tính chất giao hoán, kết hợp để tính thuận tiện'],
          level3: ['Giải bài toán tìm hai số khi biết tổng và hiệu của hai số đó', 'Giải bài toán thực tế có nhiều bước tính']
        },
        cell: {
          level1TNCount: 4,
          level1TNPoints: 2.0,
          level1TLCount: 1,
          level1TLPoints: 0.5,
          level2TNCount: 2,
          level2TNPoints: 1.0,
          level2TLCount: 1,
          level2TLPoints: 1.0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 1,
          level3TLPoints: 1.0,
          totalPoints: 5.5
        }
      },
      {
        id: 'top-2',
        topicName: 'Hình học và đo lường',
        lessonContent: 'Góc nhọn, góc tù, góc bẹt; Hai đường thẳng vuông góc, song song; Đơn vị đo yến, tạ, tấn, giây, thế kỉ',
        expectedOutcomes: {
          level1: ['Nhận biết được góc nhọn, góc tù, góc vuông; Mối quan hệ giữa tạ, tấn, yến'],
          level2: ['Chuyển đổi các đơn vị đo thời gian, khối lượng; Nhận biết đường thẳng song song, vuông góc'],
          level3: ['Vận dụng tính diện tích, chu vi hình chữ nhật, hình bình hành trong tình huống thực tiễn gắn với đời sống đồng bào miền núi']
        },
        cell: {
          level1TNCount: 4,
          level1TNPoints: 2.0,
          level1TLCount: 1,
          level1TLPoints: 0.5,
          level2TNCount: 2,
          level2TNPoints: 1.0,
          level2TLCount: 0,
          level2TLPoints: 0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 1,
          level3TLPoints: 1.0,
          totalPoints: 4.5
        }
      }
    ],
    specifications: [
      {
        id: 'spec-1',
        topicId: 'top-1',
        topicName: 'Số và phép tính',
        contentUnit: 'Số có nhiều chữ số',
        level: 1,
        outcomeRequirement: 'Nhận biết giá trị theo vị trí của chữ số trong số có nhiều chữ số',
        questionType: 'TN_NLC',
        questionNumbers: [1],
        points: 0.5
      },
      {
        id: 'spec-2',
        topicId: 'top-1',
        topicName: 'Số và phép tính',
        contentUnit: 'So sánh số',
        level: 1,
        outcomeRequirement: 'Nhận biết số lớn nhất, số bé nhất trong dãy số cho trước',
        questionType: 'TN_NLC',
        questionNumbers: [2],
        points: 0.5
      },
      {
        id: 'spec-3',
        topicId: 'top-2',
        topicName: 'Hình học và đo lường',
        contentUnit: 'Đơn vị đo khối lượng',
        level: 1,
        outcomeRequirement: 'Nhận biết mối quan hệ giữa tạ và kilôgam',
        questionType: 'TN_NLC',
        questionNumbers: [3],
        points: 0.5
      },
      {
        id: 'spec-4',
        topicId: 'top-2',
        topicName: 'Hình học và đo lường',
        contentUnit: 'Đơn vị đo thời gian',
        level: 1,
        outcomeRequirement: 'Nhận biết năm thuộc thế kỉ nào',
        questionType: 'TN_NLC',
        questionNumbers: [4],
        points: 0.5
      },
      {
        id: 'spec-5',
        topicId: 'top-1',
        topicName: 'Số và phép tính',
        contentUnit: 'Tính chất phép cộng',
        level: 1,
        outcomeRequirement: 'Nhận biết tính chất giao hoán của phép cộng dạng đúng sai',
        questionType: 'TN_DS',
        questionNumbers: [5],
        points: 0.5
      },
      {
        id: 'spec-6',
        topicId: 'top-2',
        topicName: 'Hình học và đo lường',
        contentUnit: 'Đo góc',
        level: 1,
        outcomeRequirement: 'Nhận biết đúng sai về số đo các loại góc',
        questionType: 'TN_DS',
        questionNumbers: [6],
        points: 0.5
      },
      {
        id: 'spec-7',
        topicId: 'top-2',
        topicName: 'Hình học và đo lường',
        contentUnit: 'Hai đường thẳng',
        level: 1,
        outcomeRequirement: 'Nối các khái niệm đường thẳng song song, vuông góc',
        questionType: 'TN_NC',
        questionNumbers: [7],
        points: 0.5
      },
      {
        id: 'spec-8',
        topicId: 'top-1',
        topicName: 'Số và phép tính',
        contentUnit: 'Dãy số tự nhiên',
        level: 1,
        outcomeRequirement: 'Điền số thích hợp vào dãy số tự nhiên',
        questionType: 'TN_DK',
        questionNumbers: [8],
        points: 0.5
      },
      {
        id: 'spec-9',
        topicId: 'top-1',
        topicName: 'Số và phép tính',
        contentUnit: 'Biểu thức có chứa chữ',
        level: 2,
        outcomeRequirement: 'Hiểu và tính được giá trị của biểu thức chứa 1 chữ',
        questionType: 'TN_NLC',
        questionNumbers: [9],
        points: 0.5
      },
      {
        id: 'spec-10',
        topicId: 'top-2',
        topicName: 'Hình học và đo lường',
        contentUnit: 'Góc nhọn, góc tù',
        level: 2,
        outcomeRequirement: 'Hiểu và đếm đúng số góc nhọn trong một hình cho trước',
        questionType: 'TN_NLC',
        questionNumbers: [10],
        points: 0.5
      },
      {
        id: 'spec-11',
        topicId: 'top-1',
        topicName: 'Số và phép tính',
        contentUnit: 'Đặt tính rồi tính',
        level: 1,
        outcomeRequirement: 'Thực hiện đặt tính rồi tính phép cộng và phép trừ',
        questionType: 'TL',
        questionNumbers: [11],
        points: 1.0
      },
      {
        id: 'spec-12',
        topicId: 'top-1',
        topicName: 'Số và phép tính',
        contentUnit: 'Tính bằng cách thuận tiện',
        level: 2,
        outcomeRequirement: 'Hiểu và vận dụng tính chất kết hợp, giao hoán để tính nhanh biểu thức',
        questionType: 'TL',
        questionNumbers: [12],
        points: 1.0
      },
      {
        id: 'spec-13',
        topicId: 'top-1',
        topicName: 'Số và phép tính',
        contentUnit: 'Giải toán có lời văn',
        level: 3,
        outcomeRequirement: 'Vận dụng giải bài toán tìm hai số khi biết tổng và hiệu',
        questionType: 'TL',
        questionNumbers: [13],
        points: 1.0
      },
      {
        id: 'spec-14',
        topicId: 'top-2',
        topicName: 'Hình học và đo lường',
        contentUnit: 'Chu vi và diện tích',
        level: 3,
        outcomeRequirement: 'Vận dụng tính diện tích thửa ruộng bậc thang của trường PTDTBT Tiểu học Chí Cà',
        questionType: 'TL',
        questionNumbers: [14],
        points: 1.0
      }
    ],
    questions: [
      {
        id: 'q-1',
        orderNumber: 1,
        topicName: 'Số và phép tính',
        contentUnit: 'Số có nhiều chữ số',
        format: 'TN_NLC',
        level: 1,
        points: 0.5,
        prompt: 'Trong số 748 205, chữ số 4 thuộc hàng nào và lớp nào?',
        options: [
          { key: 'A', content: 'Hàng chục nghìn, lớp nghìn' },
          { key: 'B', content: 'Hàng trăm nghìn, lớp nghìn' },
          { key: 'C', content: 'Hàng nghìn, lớp nghìn' },
          { key: 'D', content: 'Hàng chục, lớp đơn vị' }
        ],
        correctAnswer: 'A',
        explanation: 'Chữ số 4 đứng ở vị trí hàng chục nghìn thuộc lớp nghìn.',
        gradingGuide: 'Khoanh đúng phương án A cho 0,5 điểm.'
      },
      {
        id: 'q-2',
        orderNumber: 2,
        topicName: 'Số và phép tính',
        contentUnit: 'So sánh số',
        format: 'TN_NLC',
        level: 1,
        points: 0.5,
        prompt: 'Số bé nhất trong các số: 567 890; 567 980; 567 089; 567 809 là:',
        options: [
          { key: 'A', content: '567 890' },
          { key: 'B', content: '567 089' },
          { key: 'C', content: '567 980' },
          { key: 'D', content: '567 809' }
        ],
        correctAnswer: 'B',
        explanation: 'So sánh chữ số hàng trăm: 0 < 8 < 9 nên số bé nhất là 567 089.',
        gradingGuide: 'Khoanh đúng phương án B cho 0,5 điểm.'
      },
      {
        id: 'q-3',
        orderNumber: 3,
        topicName: 'Hình học và đo lường',
        contentUnit: 'Đơn vị đo khối lượng',
        format: 'TN_NLC',
        level: 1,
        points: 0.5,
        prompt: '3 tạ 50 kg = .............. kg. Số thích hợp điền vào chỗ chấm là:',
        options: [
          { key: 'A', content: '350' },
          { key: 'B', content: '305' },
          { key: 'C', content: '3500' },
          { key: 'D', content: '35' }
        ],
        correctAnswer: 'A',
        explanation: '1 tạ = 100 kg => 3 tạ = 300 kg. 300 kg + 50 kg = 350 kg.',
        gradingGuide: 'Khoanh đúng phương án A cho 0,5 điểm.'
      },
      {
        id: 'q-4',
        orderNumber: 4,
        topicName: 'Hình học và đo lường',
        contentUnit: 'Đơn vị đo thời gian',
        format: 'TN_NLC',
        level: 1,
        points: 0.5,
        prompt: 'Bác Hồ đọc Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa vào năm 1945. Năm đó thuộc thế kỉ nào?',
        options: [
          { key: 'A', content: 'Thế kỉ XVIII' },
          { key: 'B', content: 'Thế kỉ XIX' },
          { key: 'C', content: 'Thế kỉ XX' },
          { key: 'D', content: 'Thế kỉ XXI' }
        ],
        correctAnswer: 'C',
        explanation: 'Năm 1945 thuộc thế kỉ 20 (XX).',
        gradingGuide: 'Khoanh đúng phương án C cho 0,5 điểm.'
      },
      {
        id: 'q-5',
        orderNumber: 5,
        topicName: 'Số và phép tính',
        contentUnit: 'Tính chất phép cộng',
        format: 'TN_DS',
        level: 1,
        points: 0.5,
        prompt: 'Ghi Đ (Đúng) hoặc S (Sai) vào ô trống sau mỗi nhận định:',
        subItems: [
          { label: 'a', text: 'Khi đổi chỗ các số hạng trong một tổng thì tổng không thay đổi.', points: 0.25 },
          { label: 'b', text: '12 500 + 3 500 = 3 500 + 12 500 = 15 000.', points: 0.25 }
        ],
        correctAnswer: 'a - Đ, b - S (Tổng đúng là 16 000)',
        explanation: 'Ý a đúng là tính chất giao hoán. Ý b sai vì 12500 + 3500 = 16000.',
        gradingGuide: 'Điền đúng mỗi ý cho 0,25 điểm. Đúng cả hai ý được 0,5 điểm.'
      },
      {
        id: 'q-6',
        orderNumber: 6,
        topicName: 'Hình học và đo lường',
        contentUnit: 'Đo góc',
        format: 'TN_DS',
        level: 1,
        points: 0.5,
        prompt: 'Ghi Đ (Đúng) hoặc S (Sai) vào ô trống:',
        subItems: [
          { label: 'a', text: 'Góc tù lớn hơn góc vuông và bé hơn góc bẹt.', points: 0.25 },
          { label: 'b', text: 'Góc nhọn lớn hơn góc vuông.', points: 0.25 }
        ],
        correctAnswer: 'a - Đ, b - S',
        explanation: 'Góc tù có số đo lớn hơn 90 độ và nhỏ hơn 180 độ. Góc nhọn bé hơn góc vuông.',
        gradingGuide: 'Điền đúng mỗi ý được 0,25 điểm.'
      },
      {
        id: 'q-7',
        orderNumber: 7,
        topicName: 'Hình học và đo lường',
        contentUnit: 'Hai đường thẳng',
        format: 'TN_NC',
        level: 1,
        points: 0.5,
        prompt: 'Nối tên hình hoặc quan hệ ở Cột A với mô tả phù hợp ở Cột B:',
        matchPairs: [
          { leftKey: '1', leftText: 'Hai đường thẳng vuông góc', rightKey: 'A', rightText: 'Cắt nhau và tạo thành 4 góc vuông' },
          { leftKey: '2', leftText: 'Hai đường thẳng song song', rightKey: 'B', rightText: 'Không bao giờ cắt nhau dù kéo dài mãi' }
        ],
        correctAnswer: '1 nối với A; 2 nối với B',
        explanation: 'Hai đường thẳng vuông góc tạo thành 4 góc vuông; song song không cắt nhau.',
        gradingGuide: 'Nối đúng mỗi cặp được 0,25 điểm. Đúng 2 cặp được 0,5 điểm.'
      },
      {
        id: 'q-8',
        orderNumber: 8,
        topicName: 'Số và phép tính',
        contentUnit: 'Dãy số tự nhiên',
        format: 'TN_DK',
        level: 1,
        points: 0.5,
        prompt: 'Điền số hoặc từ thích hợp vào chỗ chấm:',
        subItems: [
          { label: 'a', text: 'Hai số tự nhiên liên tiếp hơn kém nhau ............... đơn vị.', points: 0.25 },
          { label: 'b', text: 'Số tự nhiên bé nhất là số ...............', points: 0.25 }
        ],
        correctAnswer: 'a: 1 ; b: 0',
        explanation: 'Hai số tự nhiên liên tiếp hơn kém nhau 1 đơn vị. Số tự nhiên bé nhất là 0.',
        gradingGuide: 'Điền đúng mỗi ý cho 0,25 điểm. Điền đúng cả hai cho 0,5 điểm.'
      },
      {
        id: 'q-9',
        orderNumber: 9,
        topicName: 'Số và phép tính',
        contentUnit: 'Biểu thức có chứa chữ',
        format: 'TN_NLC',
        level: 2,
        points: 0.5,
        prompt: 'Giá trị của biểu thức 450 + a x 5 với a = 30 là:',
        options: [
          { key: 'A', content: '600' },
          { key: 'B', content: '2 400' },
          { key: 'C', content: '500' },
          { key: 'D', content: '150' }
        ],
        correctAnswer: 'A',
        explanation: 'Thay a = 30 ta có: 450 + 30 x 5 = 450 + 150 = 600.',
        gradingGuide: 'Khoanh đúng phương án A cho 0,5 điểm.'
      },
      {
        id: 'q-10',
        orderNumber: 10,
        topicName: 'Hình học và đo lường',
        contentUnit: 'Góc nhọn, góc tù',
        format: 'TN_NLC',
        level: 2,
        points: 0.5,
        prompt: 'Một tam giác có hai góc nhọn và một góc vuông là tam giác gì?',
        options: [
          { key: 'A', content: 'Tam giác nhọn' },
          { key: 'B', content: 'Tam giác tù' },
          { key: 'C', content: 'Tam giác vuông' },
          { key: 'D', content: 'Tam giác đều' }
        ],
        correctAnswer: 'C',
        explanation: 'Tam giác có 1 góc vuông được gọi là tam giác vuông.',
        gradingGuide: 'Khoanh đúng phương án C cho 0,5 điểm.'
      },
      {
        id: 'q-11',
        orderNumber: 11,
        topicName: 'Số và phép tính',
        contentUnit: 'Đặt tính rồi tính',
        format: 'TL',
        level: 1,
        points: 1.0,
        prompt: 'Đặt tính rồi tính:',
        subItems: [
          { label: 'a', text: '358 246 + 214 538', points: 0.5 },
          { label: 'b', text: '782 509 - 345 284', points: 0.5 }
        ],
        correctAnswer: 'a) 572 784\nb) 437 225',
        explanation: 'Đặt tính thẳng cột các hàng đơn vị, chục, trăm, nghìn, chục nghìn, trăm nghìn rồi thực hiện phép tính cẩn thận.',
        gradingGuide: '- Mỗi phép tính đặt tính đúng và tính kết quả chính xác được 0,5 điểm.\n- Đặt tính đúng nhưng tính sai kết quả được 0,25 điểm.\n- Đặt tính sai cột: 0 điểm.'
      },
      {
        id: 'q-12',
        orderNumber: 12,
        topicName: 'Số và phép tính',
        contentUnit: 'Tính bằng cách thuận tiện',
        format: 'TL',
        level: 2,
        points: 1.0,
        prompt: 'Tính bằng cách thuận tiện nhất:\n  2 345 + 1 680 + 7 655 + 3 320',
        correctAnswer: '  (2 345 + 7 655) + (1 680 + 3 320)\n= 10 000 + 5 000\n= 15 000',
        explanation: 'Nhóm các số hạng có tận cùng tạo thành các số tròn nghìn.',
        gradingGuide: '- Nhóm đúng hai cặp số thích hợp: 0,5 điểm.\n- Tính đúng kết quả từng ngoặc (10 000 + 5 000): 0,25 điểm.\n- Cho kết quả cuối cùng 15 000: 0,25 điểm.'
      },
      {
        id: 'q-13',
        orderNumber: 13,
        topicName: 'Số và phép tính',
        contentUnit: 'Giải toán có lời văn',
        format: 'TL',
        level: 3,
        points: 1.0,
        prompt: 'Trường tiểu học quyên góp được tất cả 850 quyển vở để ủng hộ hai điểm trường A và B. Điểm trường A nhận được nhiều hơn điểm trường B 130 quyển vở. Hỏi mỗi điểm trường nhận được bao nhiêu quyển vở?',
        correctAnswer: 'Bài giải:\nĐiểm trường A nhận được số quyển vở là:\n  (850 + 130) : 2 = 490 (quyển)\nĐiểm trường B nhận được số quyển vở là:\n  490 - 130 = 360 (quyển)\n    (hoặc: 850 - 490 = 360 quyển)\nĐáp số: Điểm trường A: 490 quyển vở;\nĐiểm trường B: 360 quyển vở.',
        explanation: 'Dạng toán tìm hai số khi biết tổng (850) và hiệu (130). Số lớn = (Tổng + Hiệu) : 2; Số bé = Số lớn - Hiệu.',
        gradingGuide: '- Viết lời giải và phép tính tìm số lớn (Điểm trường A): 0,5 điểm.\n- Viết lời giải và phép tính tìm số bé (Điểm trường B): 0,25 điểm.\n- Đáp số đúng cả 2 số: 0,25 điểm.\n(Học sinh tìm số bé trước vẫn cho điểm tối đa).'
      },
      {
        id: 'q-14',
        orderNumber: 14,
        topicName: 'Hình học và đo lường',
        contentUnit: 'Chu vi và diện tích',
        format: 'TL',
        level: 3,
        points: 1.0,
        prompt: 'Các bạn học sinh cùng thầy cô chăm sóc một vườn rau hình chữ nhật có chu vi là 48 m. Chiều dài hơn chiều rộng 8 m. Em hãy tính diện tích vườn rau đó.',
        correctAnswer: 'Bài giải:\nNửa chu vi vườn rau hình chữ nhật là:\n  48 : 2 = 24 (m)\nChiều dài vườn rau là:\n  (24 + 8) : 2 = 16 (m)\nChiều rộng vườn rau là:\n  16 - 8 = 8 (m)\nDiện tích vườn rau hình chữ nhật là:\n  16 x 8 = 128 (m²)\nĐáp số: 128 m²',
        explanation: 'Bước 1: Tính nửa chu vi (Tổng chiều dài và chiều rộng).\nBước 2: Tìm chiều dài (số lớn) và chiều rộng (số bé).\nBước 3: Tính diện tích = dài x rộng.',
        gradingGuide: '- Tìm đúng nửa chu vi (24m): 0,25 điểm.\n- Tìm đúng chiều dài (16m) và chiều rộng (8m): 0,5 điểm.\n- Tính đúng diện tích (128 m²) và ghi đúng đáp số: 0,25 điểm.'
      }
    ],
    totalPoints: 10.0,
    totalQuestions: 14,
    mcqPoints: 6.0,
    essayPoints: 4.0,
    level1Points: 5.0,
    level2Points: 3.0,
    level3Points: 2.0,
    pedagogicalValidation: {
      isValid: true,
      errors: [],
      warnings: []
    }
  },
  {
    id: 'exam-tv-3-cki',
    title: 'Đề Kiểm tra Định kỳ Cuối Học kỳ I - Tiếng Việt 3',
    schoolName: SCHOOL_PROFILE_DEFAULT.schoolName,
    academicYear: '2025 - 2026',
    communeName: 'CHÍ CÀ',
    grade: 3,
    subject: 'Tiếng Việt',
    term: 'Cuối HKI',
    textbook: 'Kết nối tri thức với cuộc sống',
    teacherName: 'Hoàng Thị Mến',
    durationMinutes: 40,
    createdAt: '2025-12-22T08:00:00.000Z',
    updatedAt: '2025-12-22T08:00:00.000Z',
    status: 'APPROVED',
    examCode: '102',
    readingPassage: {
      title: 'MÙA HOA TAM GIÁC MẠCH TRÊN CAO NGUYÊN ĐÁ',
      author: 'Nguyễn Phan Quế',
      genre: 'miêu tả',
      wordCount: 215,
      content: `Khi những đợt gió lạnh đầu đông tràn về miền biên cương, cũng là lúc khắp các sườn núi bừng sáng bởi sắc hồng phớt của hoa tam giác mạch. Những bông hoa li ti nép mình bên vách đá tai mèo, vươn lên đón những tia nắng ấm áp ban mai.\n\nTừ trên đỉnh đèo nhìn xuống, triền đồi như khoác lên mình tấm thổ cẩm rực rỡ do bàn tay khéo léo của người nghệ nhân dệt nên. Hoa tam giác mạch không chỉ làm đẹp cho non cao mà hạt của hoa còn được bà con đồng bào làm bánh xốp dẻo, thơm ngát mùi vị đất trời. Các bạn học sinh xúng xính trong những bộ váy áo rực rỡ, bước chân ríu rít đến trường rộn rã như đàn chim non tung cánh giữa trời mây trong trẻo.`
    },
    matrixTopics: [
      {
        id: 'tv-top-1',
        topicName: 'Đọc hiểu văn bản',
        lessonContent: 'Văn bản đọc ngoài chương trình: Miêu tả cảnh đẹp thiên nhiên quê hương',
        expectedOutcomes: {
          level1: ['Nhận biết được thời điểm hoa tam giác mạch nở và màu sắc đặc trưng của hoa'],
          level2: ['Hiểu được ý nghĩa và vẻ đẹp của loài hoa tam giác mạch đối với đời sống con người miền núi'],
          level3: ['Rút ra bài học về tình yêu quê hương đất nước và ý thức giữ gìn vẻ đẹp thiên nhiên biên cương']
        },
        cell: {
          level1TNCount: 2,
          level1TNPoints: 1.0,
          level1TLCount: 0,
          level1TLPoints: 0,
          level2TNCount: 2,
          level2TNPoints: 1.0,
          level2TLCount: 1,
          level2TLPoints: 1.0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 1,
          level3TLPoints: 1.0,
          totalPoints: 4.0
        }
      },
      {
        id: 'tv-top-2',
        topicName: 'Kiến thức Tiếng Việt',
        lessonContent: 'Từ chỉ sự vật, đặc điểm, hoạt động; Biện pháp so sánh; Dấu câu (Dấu chấm, dấu hai chấm)',
        expectedOutcomes: {
          level1: ['Nhận biết được hình ảnh so sánh trong đoạn văn'],
          level2: ['Xác định được từ ngữ chỉ đặc điểm và tác dụng của dấu hai chấm'],
          level3: ['Đặt câu có hình ảnh so sánh miêu tả cảnh đẹp trường em']
        },
        cell: {
          level1TNCount: 1,
          level1TNPoints: 0.5,
          level1TLCount: 0,
          level1TLPoints: 0,
          level2TNCount: 1,
          level2TNPoints: 0.5,
          level2TLCount: 0,
          level2TLPoints: 0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 1,
          level3TLPoints: 1.0,
          totalPoints: 2.0
        }
      }
    ],
    specifications: [
      {
        id: 'tv-sp-1',
        topicId: 'tv-top-1',
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Chi tiết trong bài đọc',
        level: 1,
        outcomeRequirement: 'Nhận biết thời điểm hoa tam giác mạch nở rộ',
        questionType: 'TN_NLC',
        questionNumbers: [1],
        points: 0.5
      },
      {
        id: 'tv-sp-2',
        topicId: 'tv-top-1',
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Chi tiết bài đọc',
        level: 1,
        outcomeRequirement: 'Nhận biết hạt tam giác mạch được dùng để làm gì',
        questionType: 'TN_NLC',
        questionNumbers: [2],
        points: 0.5
      },
      {
        id: 'tv-sp-3',
        topicId: 'tv-top-2',
        topicName: 'Kiến thức Tiếng Việt',
        contentUnit: 'Biện pháp so sánh',
        level: 1,
        outcomeRequirement: 'Nhận biết câu văn có hình ảnh so sánh',
        questionType: 'TN_NLC',
        questionNumbers: [3],
        points: 0.5
      },
      {
        id: 'tv-sp-4',
        topicId: 'tv-top-1',
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Ý nghĩa văn bản',
        level: 2,
        outcomeRequirement: 'Hiểu cảm xúc của các bạn học sinh khi đến trường vào mùa hoa nở',
        questionType: 'TN_NLC',
        questionNumbers: [4],
        points: 0.5
      },
      {
        id: 'tv-sp-5',
        topicId: 'tv-top-1',
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Từ ngữ chỉ đặc điểm',
        level: 2,
        outcomeRequirement: 'Tìm và ghi lại các từ ngữ miêu tả hoa tam giác mạch',
        questionType: 'TN_NLC',
        questionNumbers: [5],
        points: 0.5
      },
      {
        id: 'tv-sp-6',
        topicId: 'tv-top-2',
        topicName: 'Kiến thức Tiếng Việt',
        contentUnit: 'Dấu câu',
        level: 2,
        outcomeRequirement: 'Hiểu công dụng của dấu hai chấm trong đoạn văn',
        questionType: 'TN_NLC',
        questionNumbers: [6],
        points: 0.5
      },
      {
        id: 'tv-sp-7',
        topicId: 'tv-top-1',
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Nội dung chính',
        level: 2,
        outcomeRequirement: 'Nêu nội dung chính và vẻ đẹp thiên nhiên quê hương trong bài đọc',
        questionType: 'TL',
        questionNumbers: [7],
        points: 1.0
      },
      {
        id: 'tv-sp-8',
        topicId: 'tv-top-1',
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Liên hệ thực tế',
        level: 3,
        outcomeRequirement: 'Viết 2-3 câu thể hiện tình cảm của em đối với quê hương Chí Cà thân yêu',
        questionType: 'TL',
        questionNumbers: [8],
        points: 1.0
      },
      {
        id: 'tv-sp-9',
        topicId: 'tv-top-2',
        topicName: 'Kiến thức Tiếng Việt',
        contentUnit: 'Vận dụng so sánh',
        level: 3,
        outcomeRequirement: 'Đặt 1 câu văn có hình ảnh so sánh miêu tả ngôi trường hoặc thầy cô',
        questionType: 'TL',
        questionNumbers: [9],
        points: 1.0
      }
    ],
    questions: [
      {
        id: 'tv-q-1',
        orderNumber: 1,
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Chi tiết trong bài đọc',
        format: 'TN_NLC',
        level: 1,
        points: 0.5,
        prompt: 'Hoa tam giác mạch ở sườn núi Chí Cà bắt đầu nở rộ vào thời điểm nào?',
        options: [
          { key: 'A', content: 'Khi những đợt gió lạnh đầu đông tràn về miền biên cương' },
          { key: 'B', content: 'Khi mùa xuân ấm áp vừa ghé qua' },
          { key: 'C', content: 'Vào những ngày hè oi ả rực nắng' }
        ],
        correctAnswer: 'A',
        explanation: 'Trong bài có câu: "Khi những đợt gió lạnh đầu đông tràn về miền biên cương Xín Mần, cũng là lúc khắp các sườn núi Chí Cà bừng sáng...".',
        gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
      },
      {
        id: 'tv-q-2',
        orderNumber: 2,
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Chi tiết bài đọc',
        format: 'TN_NLC',
        level: 1,
        points: 0.5,
        prompt: 'Hạt của hoa tam giác mạch được bà con đồng bào vùng cao dùng để làm gì?',
        options: [
          { key: 'A', content: 'Làm trà uống hàng ngày' },
          { key: 'B', content: 'Làm bánh xốp dẻo thơm ngon' },
          { key: 'C', content: 'Dệt nên những tấm thổ cẩm' }
        ],
        correctAnswer: 'B',
        explanation: 'Văn bản nêu rõ hạt của hoa được bà con làm bánh xốp dẻo, thơm ngát mùi vị đất trời.',
        gradingGuide: 'Khoanh đúng B được 0,5 điểm.'
      },
      {
        id: 'tv-q-3',
        orderNumber: 3,
        topicName: 'Kiến thức Tiếng Việt',
        contentUnit: 'Biện pháp so sánh',
        format: 'TN_NLC',
        level: 1,
        points: 0.5,
        prompt: 'Trong bài đọc, triền đồi hoa tam giác mạch được so sánh với sự vật nào?',
        options: [
          { key: 'A', content: 'Như tấm thổ cẩm rực rỡ' },
          { key: 'B', content: 'Như một dải lụa xanh biếc' },
          { key: 'C', content: 'Như bức tranh vẽ bằng mực nho' }
        ],
        correctAnswer: 'A',
        explanation: 'Câu văn: "Từ trên đỉnh đèo nhìn xuống, triền đồi như khoác lên mình tấm thổ cẩm rực rỡ...".',
        gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
      },
      {
        id: 'tv-q-4',
        orderNumber: 4,
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Ý nghĩa văn bản',
        format: 'TN_NLC',
        level: 2,
        points: 0.5,
        prompt: 'Hình ảnh các bạn học sinh đến trường được tác giả miêu tả sinh động qua từ ngữ nào?',
        options: [
          { key: 'A', content: 'Xúng xính váy áo, ríu rít như đàn chim non tung cánh' },
          { key: 'B', content: 'Lặng lẽ từng bước qua khe suối' },
          { key: 'C', content: 'Vội vã chạy cho kịp buổi học sớm' }
        ],
        correctAnswer: 'A',
        explanation: 'Tác giả dùng hình ảnh so sánh "ríu rít như đàn chim non tung cánh giữa trời mây trong trẻo".',
        gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
      },
      {
        id: 'tv-q-5',
        orderNumber: 5,
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Từ ngữ chỉ đặc điểm',
        format: 'TN_NLC',
        level: 2,
        points: 0.5,
        prompt: 'Dãy từ ngữ nào sau đây gồm toàn từ chỉ đặc điểm của hoa và cảnh sắc trong bài?',
        options: [
          { key: 'A', content: 'Li ti, hồng phớt, rực rỡ, ấm áp' },
          { key: 'B', content: 'Đón nắng, tràn về, nở rộ, dệt nên' },
          { key: 'C', content: 'Đỉnh đèo, vách đá, triền đồi, chiếc bánh' }
        ],
        correctAnswer: 'A',
        explanation: 'Li ti, hồng phớt, rực rỡ, ấm áp là các tính từ chỉ đặc điểm.',
        gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
      },
      {
        id: 'tv-q-6',
        orderNumber: 6,
        topicName: 'Kiến thức Tiếng Việt',
        contentUnit: 'Dấu câu',
        format: 'TN_NLC',
        level: 2,
        points: 0.5,
        prompt: 'Bộ phận in nghiêng trong câu "Các bạn học sinh trường PTDTBT Tiểu học Chí Cà *ríu rít đến trường*" trả lời cho câu hỏi nào?',
        options: [
          { key: 'A', content: 'Làm gì?' },
          { key: 'B', content: 'Là gì?' },
          { key: 'C', content: 'Như thế nào?' }
        ],
        correctAnswer: 'A',
        explanation: '"Ríu rít đến trường" là cụm từ chỉ hoạt động, trả lời cho câu hỏi Làm gì?.',
        gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
      },
      {
        id: 'tv-q-7',
        orderNumber: 7,
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Nội dung chính',
        format: 'TL',
        level: 2,
        points: 1.0,
        prompt: 'Theo em, bài đọc trên ca ngợi điều gì về thiên nhiên và con người ở xã Chí Cà, huyện Xín Mần?',
        correctAnswer: 'Bài đọc ca ngợi vẻ đẹp thơ mộng, rực rỡ của mùa hoa tam giác mạch trên sườn núi Chí Cà cùng cuộc sống bình dị, vui tươi, chăm chỉ đến trường của các bạn nhỏ vùng cao.',
        explanation: 'Học sinh nêu đúng ý nghĩa ca ngợi cảnh đẹp và nét đẹp hồn nhiên của trẻ em vùng cao.',
        gradingGuide: '- Nêu được vẻ đẹp thiên nhiên hoa tam giác mạch: 0,5 điểm.\n- Nêu được nét đẹp con người/học sinh vùng cao: 0,5 điểm.'
      },
      {
        id: 'tv-q-8',
        orderNumber: 8,
        topicName: 'Đọc hiểu văn bản',
        contentUnit: 'Liên hệ thực tế',
        format: 'TL',
        level: 3,
        points: 1.0,
        prompt: 'Là một học sinh trường PTDTBT Tiểu học Chí Cà, em cần làm gì để góp phần giữ gìn trường lớp và cảnh quan quê hương luôn tươi đẹp?',
        correctAnswer: 'Học sinh trả lời tự do theo cảm nghĩ chân thật, ví dụ: Em sẽ luôn giữ gìn vệ sinh chung, không vứt rác bừa bãi, tích cực tham gia trồng và chăm sóc hoa trong khuôn viên trường học, yêu thương bạn bè và đoàn kết giúp đỡ nhau cùng tiến bộ.',
        explanation: 'Hành động cụ thể, thiết thực, phù hợp lứa tuổi học sinh tiểu học.',
        gradingGuide: '- Nêu được 2 việc làm cụ thể (vệ sinh, chăm sóc cây/hoa): 0,75 điểm.\n- Diễn đạt trôi chảy, đúng chính tả: 0,25 điểm.'
      },
      {
        id: 'tv-q-9',
        orderNumber: 9,
        topicName: 'Kiến thức Tiếng Việt',
        contentUnit: 'Vận dụng so sánh',
        format: 'TL',
        level: 3,
        points: 1.0,
        prompt: 'Em hãy viết một câu văn có hình ảnh so sánh miêu tả ngôi trường hoặc thầy cô giáo của em.',
        correctAnswer: 'Ví dụ: Ngôi trường của em khang trang, đẹp như một bức tranh giữa núi rừng hùng vĩ. (Hoặc: Cô giáo chăm sóc chúng em ân cần như người mẹ hiền).',
        explanation: 'Câu văn có đầy đủ chủ ngữ - vị ngữ, sử dụng từ so sánh (như, tựa như...) và hình ảnh so sánh đẹp, hợp lý.',
        gradingGuide: '- Viết đúng cấu trúc câu, có từ so sánh và hình ảnh so sánh hợp lý: 0,75 điểm.\n- Đầu câu viết hoa, cuối câu có dấu chấm, không sai lỗi chính tả: 0,25 điểm.'
      }
    ],
    totalPoints: 10.0,
    totalQuestions: 9,
    mcqPoints: 3.0,
    essayPoints: 7.0, // (Đọc hiểu 4đ + KTTV 2đ theo chuẩn đề đọc hiểu 6đ hoặc đề tổng hợp 10đ)
    level1Points: 4.0,
    level2Points: 3.0,
    level3Points: 3.0,
    pedagogicalValidation: {
      isValid: true,
      errors: [],
      warnings: []
    }
  },
  {
    id: 'exam-tin-5-cki',
    title: 'Đề Kiểm tra Định kỳ Cuối Học kỳ I - Tin học 5',
    schoolName: SCHOOL_PROFILE_DEFAULT.schoolName,
    academicYear: '2025 - 2026',
    communeName: 'CHÍ CÀ',
    grade: 5,
    subject: 'Tin học',
    term: 'Cuối HKI',
    textbook: 'Kết nối tri thức với cuộc sống',
    teacherName: 'Trần Văn Mạnh',
    durationMinutes: 35,
    createdAt: '2025-12-18T09:00:00.000Z',
    updatedAt: '2025-12-18T09:00:00.000Z',
    status: 'APPROVED',
    examCode: '103',
    matrixTopics: [
      {
        id: 'tin-top-1',
        topicName: 'Máy tính và em & Mạng máy tính',
        lessonContent: 'Tìm kiếm thông tin trên Internet an toàn; Bản quyền phần mềm và nội dung số',
        expectedOutcomes: {
          level1: ['Nhận biết được các công cụ tìm kiếm và từ khóa', 'Nhận biết hành vi vi phạm bản quyền'],
          level2: ['Lựa chọn từ khóa tìm kiếm chính xác và đánh giá độ tin cậy của thông tin'],
          level3: ['Vận dụng quy tắc ứng xử an toàn trên không gian mạng']
        },
        cell: {
          level1TNCount: 3,
          level1TNPoints: 1.5,
          level1TLCount: 0,
          level1TLPoints: 0,
          level2TNCount: 2,
          level2TNPoints: 1.0,
          level2TLCount: 1,
          level2TLPoints: 1.0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 0,
          level3TLPoints: 0,
          totalPoints: 3.5
        }
      },
      {
        id: 'tin-top-2',
        topicName: 'Ứng dụng Tin học & Lập trình Scratch',
        lessonContent: 'Chèn bảng, hình ảnh trong văn bản Word; Tạo chương trình điều khiển nhân vật trong Scratch',
        expectedOutcomes: {
          level1: ['Nhận biết các nút lệnh định dạng bảng biểu và khối lệnh di chuyển trong Scratch'],
          level2: ['Hiểu thứ tự thực thi của các khối lệnh lặp và rẽ nhánh'],
          level3: ['Thực hành lập trình kịch bản hoàn chỉnh cho nhân vật di chuyển và vẽ hình trên máy tính']
        },
        cell: {
          level1TNCount: 0,
          level1TNPoints: 0,
          level1TLCount: 1,
          level1TLPoints: 0.5,
          level2TNCount: 0,
          level2TNPoints: 0,
          level2TLCount: 1,
          level2TLPoints: 1.0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 2,
          level3TLPoints: 5.0, // 2 câu thực hành (3đ + 2đ = 5đ TH chuẩn Lớp 5)
          totalPoints: 6.5
        }
      }
    ],
    specifications: [
      {
        id: 'tin-sp-1',
        topicId: 'tin-top-1',
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Tìm kiếm thông tin',
        level: 1,
        outcomeRequirement: 'Nhận biết biểu tượng và tên website tìm kiếm thông dụng',
        questionType: 'TN_NLC',
        questionNumbers: [1],
        points: 0.5
      },
      {
        id: 'tin-sp-2',
        topicId: 'tin-top-1',
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Bản quyền số',
        level: 1,
        outcomeRequirement: 'Nhận biết hành vi tôn trọng bản quyền nội dung trên Internet',
        questionType: 'TN_NLC',
        questionNumbers: [2],
        points: 0.5
      },
      {
        id: 'tin-sp-3',
        topicId: 'tin-top-1',
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Mật khẩu an toàn',
        level: 1,
        outcomeRequirement: 'Nhận biết đặc điểm của một mật khẩu mạnh để bảo vệ tài khoản',
        questionType: 'TN_NLC',
        questionNumbers: [3],
        points: 0.5
      },
      {
        id: 'tin-sp-4',
        topicId: 'tin-top-1',
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Từ khóa tìm kiếm',
        level: 2,
        outcomeRequirement: 'Hiểu và chọn từ khóa thích hợp nhất khi tìm tư liệu bài học',
        questionType: 'TN_NLC',
        questionNumbers: [4],
        points: 0.5
      },
      {
        id: 'tin-sp-5',
        topicId: 'tin-top-1',
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Thông tin tin cậy',
        level: 2,
        outcomeRequirement: 'Hiểu cách nhận diện nguồn tin đáng tin cậy trên Internet',
        questionType: 'TN_NLC',
        questionNumbers: [5],
        points: 0.5
      },
      {
        id: 'tin-sp-6',
        topicId: 'tin-top-2',
        topicName: 'Ứng dụng Tin học & Lập trình Scratch',
        contentUnit: 'Định dạng văn bản',
        level: 1,
        outcomeRequirement: 'Trình bày các bước chèn hình ảnh vào văn bản Word',
        questionType: 'TL',
        questionNumbers: [6],
        points: 0.5
      },
      {
        id: 'tin-sp-7',
        topicId: 'tin-top-1',
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Đạo đức ứng xử mạng',
        level: 2,
        outcomeRequirement: 'Giải thích tại sao không được tùy tiện sao chép bài của người khác trên mạng',
        questionType: 'TL',
        questionNumbers: [7],
        points: 1.0
      },
      {
        id: 'tin-sp-8',
        topicId: 'tin-top-2',
        topicName: 'Ứng dụng Tin học & Lập trình Scratch',
        contentUnit: 'Thực hành Word',
        level: 3,
        outcomeRequirement: 'Thực hành tạo văn bản giới thiệu bản làng Chí Cà có chèn bảng thời khóa biểu',
        questionType: 'TH',
        questionNumbers: [8],
        points: 2.0
      },
      {
        id: 'tin-sp-9',
        topicId: 'tin-top-2',
        topicName: 'Ứng dụng Tin học & Lập trình Scratch',
        contentUnit: 'Thực hành Scratch',
        level: 3,
        outcomeRequirement: 'Thực hành lập trình Scratch điều khiển nhân vật chú mèo vẽ hình vuông và nói lời chào',
        questionType: 'TH',
        questionNumbers: [9],
        points: 3.0
      }
    ],
    questions: [
      {
        id: 'tin-q-1',
        orderNumber: 1,
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Tìm kiếm thông tin',
        format: 'TN_NLC',
        level: 1,
        points: 0.5,
        prompt: 'Địa chỉ trang web nào sau đây là một công cụ máy tìm kiếm thông tin phổ biến trên Internet?',
        options: [
          { key: 'A', content: 'www.google.com' },
          { key: 'B', content: 'www.paint.net' },
          { key: 'C', content: 'www.word.exe' },
          { key: 'D', content: 'www.scratch.mit.desktop' }
        ],
        correctAnswer: 'A',
        explanation: 'Google là máy tìm kiếm phổ biến hàng đầu thế giới.',
        gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
      },
      {
        id: 'tin-q-2',
        orderNumber: 2,
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Bản quyền số',
        format: 'TN_NLC',
        level: 1,
        points: 0.5,
        prompt: 'Hành động nào dưới đây thể hiện sự tôn trọng bản quyền khi sử dụng tài liệu trên mạng?',
        options: [
          { key: 'A', content: 'Tự nhận bài viết của người khác trên mạng là của mình' },
          { key: 'B', content: 'Ghi rõ nguồn tác giả và xin phép khi sử dụng hình ảnh của người khác' },
          { key: 'C', content: 'Chỉnh sửa hình ảnh của người khác rồi bán kiếm tiền' },
          { key: 'D', content: 'Sao chép toàn bộ trang web mà không ghi trích dẫn' }
        ],
        correctAnswer: 'B',
        explanation: 'Tôn trọng bản quyền thể hiện qua việc trích dẫn nguồn tác giả rõ ràng.',
        gradingGuide: 'Khoanh đúng B được 0,5 điểm.'
      },
      {
        id: 'tin-q-3',
        orderNumber: 3,
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Mật khẩu an toàn',
        format: 'TN_NLC',
        level: 1,
        points: 0.5,
        prompt: 'Mật khẩu nào sau đây là mật khẩu mạnh và an toàn nhất?',
        options: [
          { key: 'A', content: '123456' },
          { key: 'B', content: 'chica2024' },
          { key: 'C', content: 'ChiCa@2024#XinMan' },
          { key: 'D', content: 'abcdef' }
        ],
        correctAnswer: 'C',
        explanation: 'Mật khẩu mạnh gồm tối thiểu 8 ký tự, kết hợp chữ hoa, chữ thường, chữ số và ký tự đặc biệt.',
        gradingGuide: 'Khoanh đúng C được 0,5 điểm.'
      },
      {
        id: 'tin-q-4',
        orderNumber: 4,
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Từ khóa tìm kiếm',
        format: 'TN_NLC',
        level: 2,
        points: 0.5,
        prompt: 'Để tìm hiểu về di tích lịch sử và danh lam thắng cảnh ở huyện Xín Mần, từ khóa nào sau đây là ngắn gọn và hiệu quả nhất?',
        options: [
          { key: 'A', content: '"danh lam thang canh Xin Man Ha Giang"' },
          { key: 'B', content: 'toi muon tim nhung noi dep o xín mần' },
          { key: 'C', content: 'o dau dep nhat tinh ha giang bay gio' },
          { key: 'D', content: 'cho toi xem hinh anh du lich' }
        ],
        correctAnswer: 'A',
        explanation: 'Từ khóa trong ngoặc kép hoặc các từ khóa cô đọng giúp máy tìm kiếm lọc chính xác thông tin cần tìm.',
        gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
      },
      {
        id: 'tin-q-5',
        orderNumber: 5,
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Thông tin tin cậy',
        format: 'TN_NLC',
        level: 2,
        points: 0.5,
        prompt: 'Khi đọc một thông tin bất ngờ trên mạng xã hội, cách xử lý nào sau đây là đúng đắn nhất?',
        options: [
          { key: 'A', content: 'Chia sẻ ngay lập tức cho các bạn cùng lớp xem' },
          { key: 'B', content: 'Kiểm chứng lại từ các nguồn chính thống (báo chí uy tín, cổng thông tin chính phủ, thầy cô)' },
          { key: 'C', content: 'Bình luận gay gắt chỉ trích người đăng tin' },
          { key: 'D', content: 'Lưu về máy và gửi tin nhắn cho mọi người trong danh bạ' }
        ],
        correctAnswer: 'B',
        explanation: 'Cần kiểm chứng thông tin từ các nguồn đáng tin cậy trước khi tin tưởng hoặc chia sẻ.',
        gradingGuide: 'Khoanh đúng B được 0,5 điểm.'
      },
      {
        id: 'tin-q-6',
        orderNumber: 6,
        topicName: 'Ứng dụng Tin học & Lập trình Scratch',
        contentUnit: 'Định dạng văn bản',
        format: 'TL',
        level: 1,
        points: 0.5,
        prompt: 'Em hãy nêu các bước để chèn một hình ảnh từ máy tính vào phần mềm soạn thảo văn bản Word.',
        correctAnswer: 'Các bước thực hiện:\nBước 1: Đặt con trỏ soạn thảo tại vị trí muốn chèn ảnh.\nBước 2: Chọn thẻ Insert trên thanh dải lệnh.\nBước 3: Chọn Pictures -> This Device.\nBước 4: Chọn tệp hình ảnh cần chèn rồi nhấn nút Insert.',
        explanation: 'Quy trình chuẩn trong Microsoft Word: Insert -> Pictures -> This Device -> Chọn ảnh -> Insert.',
        gradingGuide: '- Nêu đủ và đúng trình tự các bước: 0,5 điểm.\n- Nêu được thẻ Insert và nút Picture: 0,25 điểm.'
      },
      {
        id: 'tin-q-7',
        orderNumber: 7,
        topicName: 'Máy tính và em & Mạng máy tính',
        contentUnit: 'Đạo đức ứng xử mạng',
        format: 'TL',
        level: 2,
        points: 1.0,
        prompt: 'Theo em, tại sao chúng ta không được phép sao chép bài làm hoặc hình ảnh của người khác trên mạng rồi nhận là của mình? Em hãy nêu 2 hậu quả của việc làm đó.',
        correctAnswer: 'Bài làm:\n- Không được sao chép vì đó là hành vi vi phạm đạo đức và luật sở hữu trí tuệ, không trung thực trong học tập.\n- Hai hậu quả:\n  1. Khiến bản thân không tự rèn luyện được năng lực thực sự và mất uy tín với thầy cô, bạn bè.\n  2. Có thể bị khiếu nại bản quyền hoặc bị xử phạt theo nội quy nhà trường và quy định của pháp luật.',
        explanation: 'Học sinh nêu rõ lý do trung thực trong học tập và nhận thức về luật bản quyền.',
        gradingGuide: '- Giải thích đúng lý do: 0,5 điểm.\n- Nêu được 2 hậu quả xác đáng: 0,5 điểm (mỗi hậu quả 0,25đ).'
      },
      {
        id: 'tin-q-8',
        orderNumber: 8,
        topicName: 'Ứng dụng Tin học & Lập trình Scratch',
        contentUnit: 'Thực hành Word',
        format: 'TH',
        level: 3,
        points: 2.0,
        prompt: 'THỰC HÀNH TRÊN MÁY TÍNH (2,0 điểm):\nKhởi động phần mềm soạn thảo Word và thực hiện:\na) Soạn thảo đoạn văn ngắn (3 - 4 dòng) giới thiệu tên trường: "TRƯỜNG PTDTBT TIỂU HỌC CHÍ CÀ", tiêu đề in đậm, cỡ chữ 16, căn giữa.\nb) Tạo một bảng gồm 3 cột và 4 hàng ghi: Thứ, Tiết học, Môn học.\nc) Lưu tệp vào ổ đĩa D: với tên "BaiKiemTra_HoVaTen.docx".',
        correctAnswer: 'Thao tác thực hành đúng theo yêu cầu của giáo viên coi thi.',
        explanation: 'Đánh giá kỹ năng soạn thảo, định dạng phông chữ, tạo bảng và lưu tệp có hệ thống.',
        gradingGuide: '- Soạn thảo đúng nội dung, cỡ chữ 16, in đậm, căn giữa: 0,75 điểm.\n- Tạo bảng 3 cột 4 hàng chuẩn và nhập liệu đúng: 0,75 điểm.\n- Lưu đúng đường dẫn và tên tệp: 0,5 điểm.'
      },
      {
        id: 'tin-q-9',
        orderNumber: 9,
        topicName: 'Ứng dụng Tin học & Lập trình Scratch',
        contentUnit: 'Thực hành Scratch',
        format: 'TH',
        level: 3,
        points: 3.0,
        prompt: 'THỰC HÀNH LẬP TRÌNH SCRATCH (3,0 điểm):\nKhởi động phần mềm Scratch và thực hiện kịch bản sau:\na) Khi bấm vào Lá cờ xanh, nhân vật chú Mèo di chuyển đến vị trí x = 0, y = 0, hướng về hướng 90 độ.\nb) Nhân vật nói: "Xin chào các bạn trường Tiểu học Chí Cà!" trong 2 giây.\nc) Sử dụng khối lệnh Lặp lại 4 lần để điều khiển chú Mèo vẽ một hình vuông cạnh 100 bước (sử dụng nhóm lệnh Bút vẽ - Pen).\nd) Lưu dự án với tên "VeHinhVuong_Scratch.sb3".',
        correctAnswer: 'Chương trình Scratch chạy đúng logic kịch bản.',
        explanation: 'Đánh giá kỹ năng sử dụng sự kiện Lá cờ xanh, khối lệnh Nói, khối lệnh Di chuyển, Quay 90 độ, khối lệnh Lặp lại và nhóm lệnh Bút vẽ.',
        gradingGuide: '- Khởi tạo đúng vị trí x=0, y=0 và hướng 90: 0,5 điểm.\n- Nhân vật nói đúng câu chào trong 2 giây: 0,5 điểm.\n- Dùng vòng lặp 4 lần (di chuyển 100 bước, xoay 90 độ, đặt bút) vẽ đúng hình vuông: 1,5 điểm.\n- Lưu tệp dự án đúng tên quy định: 0,5 điểm.'
      }
    ],
    totalPoints: 10.0,
    totalQuestions: 9,
    mcqPoints: 2.5,
    essayPoints: 7.5, // Lý thuyết 5đ (2.5đ TN + 1.5đ TL + 1.0đ) + Thực hành 5đ
    level1Points: 5.0,
    level2Points: 3.0,
    level3Points: 2.0,
    pedagogicalValidation: {
      isValid: true,
      errors: [],
      warnings: []
    }
  }
];
