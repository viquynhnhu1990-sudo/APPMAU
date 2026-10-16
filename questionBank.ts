import { QuestionItem, GradeLevel, SubjectName } from '../types';

export interface BankQuestionRecord extends QuestionItem {
  grade: GradeLevel;
  subject: SubjectName;
  textbook: string;
  usageCount: number;
}

export const INITIAL_QUESTION_BANK: BankQuestionRecord[] = [
  // Toán 1
  {
    id: 'bq-m1-1',
    grade: 1,
    subject: 'Toán',
    textbook: 'Kết nối tri thức với cuộc sống',
    usageCount: 18,
    orderNumber: 1,
    topicName: 'Số và phép tính',
    contentUnit: 'Các số trong phạm vi 10',
    format: 'TN_NLC',
    level: 1,
    points: 0.5,
    prompt: 'Số thích hợp điền vào chỗ chấm trong dãy số 3, 4, 5, ..., 7 là:',
    options: [
      { key: 'A', content: '6' },
      { key: 'B', content: '8' },
      { key: 'C', content: '2' }
    ],
    correctAnswer: 'A',
    explanation: 'Dãy số đếm tiến từ 3 đến 7: 3, 4, 5, 6, 7.',
    gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
  },
  {
    id: 'bq-m1-2',
    grade: 1,
    subject: 'Toán',
    textbook: 'Kết nối tri thức với cuộc sống',
    usageCount: 15,
    orderNumber: 2,
    topicName: 'Hình học và đo lường',
    contentUnit: 'Hình vuông, hình tròn, hình tam giác',
    format: 'TN_NLC',
    level: 1,
    points: 0.5,
    prompt: 'Hình nào dưới đây có 3 cạnh và 3 góc?',
    options: [
      { key: 'A', content: 'Hình tròn' },
      { key: 'B', content: 'Hình tam giác' },
      { key: 'C', content: 'Hình vuông' }
    ],
    correctAnswer: 'B',
    explanation: 'Hình tam giác có 3 cạnh và 3 góc.',
    gradingGuide: 'Khoanh đúng B được 0,5 điểm.'
  },

  // Toán 2
  {
    id: 'bq-m2-1',
    grade: 2,
    subject: 'Toán',
    textbook: 'Cánh Diều',
    usageCount: 22,
    orderNumber: 1,
    topicName: 'Số và phép tính',
    contentUnit: 'Phép cộng có nhớ trong phạm vi 100',
    format: 'TN_NLC',
    level: 1,
    points: 0.5,
    prompt: 'Kết quả của phép tính 38 + 25 là:',
    options: [
      { key: 'A', content: '63' },
      { key: 'B', content: '53' },
      { key: 'C', content: '64' }
    ],
    correctAnswer: 'A',
    explanation: '8 + 5 = 13 viết 3 nhớ 1; 3 + 2 = 5 thêm 1 là 6. Kết quả 63.',
    gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
  },

  // Toán 3
  {
    id: 'bq-m3-1',
    grade: 3,
    subject: 'Toán',
    textbook: 'Chân trời sáng tạo',
    usageCount: 30,
    orderNumber: 1,
    topicName: 'Số và phép tính',
    contentUnit: 'Bảng nhân, bảng chia 6, 7, 8, 9',
    format: 'TN_NLC',
    level: 1,
    points: 0.5,
    prompt: 'Một tuần lễ có 7 ngày. Hỏi 6 tuần lễ có bao nhiêu ngày?',
    options: [
      { key: 'A', content: '42 ngày' },
      { key: 'B', content: '40 ngày' },
      { key: 'C', content: '48 ngày' }
    ],
    correctAnswer: 'A',
    explanation: '7 x 6 = 42 ngày.',
    gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
  },

  // Khoa học 4
  {
    id: 'bq-kh4-1',
    grade: 4,
    subject: 'Khoa học',
    textbook: 'Kết nối tri thức với cuộc sống',
    usageCount: 24,
    orderNumber: 1,
    topicName: 'Chất - Nước và không khí',
    contentUnit: 'Tính chất và vai trò của nước',
    format: 'TN_NLC',
    level: 1,
    points: 0.5,
    prompt: 'Nước có những tính chất nào sau đây?',
    options: [
      { key: 'A', content: 'Trong suốt, không màu, không mùi, không vị, không có hình dạng nhất định' },
      { key: 'B', content: 'Có màu trắng đục, có mùi thơm, có vị ngọt nhẹ' },
      { key: 'C', content: 'Có hình tròn, màu xanh biếc, không mùi' },
      { key: 'D', content: 'Có màu sắc tùy thuộc vào đồ chứa và có vị ngọt' }
    ],
    correctAnswer: 'A',
    explanation: 'Nước là chất lỏng trong suốt, không màu, không mùi, không vị, không có hình dạng cố định.',
    gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
  },
  {
    id: 'bq-kh4-2',
    grade: 4,
    subject: 'Khoa học',
    textbook: 'Kết nối tri thức với cuộc sống',
    usageCount: 19,
    orderNumber: 2,
    topicName: 'Chất - Nước và không khí',
    contentUnit: 'Vòng tuần hoàn của nước trong tự nhiên',
    format: 'TN_NLC',
    level: 2,
    points: 0.5,
    prompt: 'Hiện tượng nào dưới đây minh chứng cho sự ngưng tụ của hơi nước?',
    options: [
      { key: 'A', content: 'Nước đá tan chảy thành nước lỏng dưới ánh mặt trời' },
      { key: 'B', content: 'Những giọt sương đọng trên lá cây vào sáng sớm mùa đông ở Chí Cà' },
      { key: 'C', content: 'Nước trong ao hồ bốc hơi khi trời nắng gắt' },
      { key: 'D', content: 'Nước chảy từ đỉnh núi cao xuống khe suối' }
    ],
    correctAnswer: 'B',
    explanation: 'Hơi nước trong không khí gặp lạnh ngưng tụ lại thành các giọt sương li ti.',
    gradingGuide: 'Khoanh đúng B được 0,5 điểm.'
  },
  {
    id: 'bq-kh4-3',
    grade: 4,
    subject: 'Khoa học',
    textbook: 'Kết nối tri thức với cuộc sống',
    usageCount: 16,
    orderNumber: 3,
    topicName: 'Chất - Nước và không khí',
    contentUnit: 'Bảo vệ nguồn nước',
    format: 'TL',
    level: 3,
    points: 1.5,
    prompt: 'Em hãy nêu 3 việc làm cụ thể của học sinh trường PTDTBT Tiểu học Chí Cà để tiết kiệm và bảo vệ nguồn nước sạch ở trường và ở gia đình.',
    correctAnswer: 'Gợi ý trả lời:\n1. Khóa vòi nước ngay sau khi rửa tay, rửa mặt hoặc rửa đồ dùng cá nhân.\n2. Không vứt rác thải, bao bì thuốc trừ sâu hay xác động vật xuống sông, suối, khe nước đầu nguồn.\n3. Nhắc nhở bạn bè và người thân cùng có ý thức tiết kiệm và giữ gìn nguồn nước sạch.',
    explanation: 'Các hành động thực tế, ý nghĩa giáo dục bảo vệ môi trường vùng cao.',
    gradingGuide: '- Nêu đúng và đủ 3 việc làm thiết thực: 1,5 điểm (mỗi việc làm 0,5 điểm).\n- Nêu 2 việc làm: 1,0 điểm.\n- Nêu 1 việc làm: 0,5 điểm.'
  },

  // Lịch sử và Địa lí 4
  {
    id: 'bq-ls4-1',
    grade: 4,
    subject: 'Lịch sử và Địa lí',
    textbook: 'Kết nối tri thức với cuộc sống',
    usageCount: 20,
    orderNumber: 1,
    topicName: 'Vùng Trung du và miền núi Bắc Bộ',
    contentUnit: 'Đặc điểm tự nhiên và dân cư',
    format: 'TN_NLC',
    level: 1,
    points: 0.5,
    prompt: 'Đặc điểm địa hình nổi bật nhất của vùng Trung du và miền núi Bắc Bộ là:',
    options: [
      { key: 'A', content: 'Địa hình bằng phẳng, nhiều kênh rạch chằng chịt' },
      { key: 'B', content: 'Có nhiều dãy núi cao, hiểm trở, xen kẽ các thung lũng sâu' },
      { key: 'C', content: 'Là các cồn cát ven biển trải dài' },
      { key: 'D', content: 'Chủ yếu là đồng bằng bãi bồi ven sông' }
    ],
    correctAnswer: 'B',
    explanation: 'Trung du và miền núi Bắc Bộ có địa hình núi cao, hiểm trở bậc nhất cả nước.',
    gradingGuide: 'Khoanh đúng B được 0,5 điểm.'
  },
  {
    id: 'bq-ls4-2',
    grade: 4,
    subject: 'Lịch sử và Địa lí',
    textbook: 'Kết nối tri thức với cuộc sống',
    usageCount: 25,
    orderNumber: 2,
    topicName: 'Vùng Trung du và miền núi Bắc Bộ',
    contentUnit: 'Hoạt động kinh tế và văn hóa',
    format: 'TN_NLC',
    level: 2,
    points: 0.5,
    prompt: 'Hình thức canh tác trồng trọt độc đáo của đồng bào các dân tộc thiểu số trên sườn đồi dốc núi đá là:',
    options: [
      { key: 'A', content: 'Ruộng bậc thang' },
      { key: 'B', content: 'Đồng ruộng thẳng cánh cò bay' },
      { key: 'C', content: 'Nuôi trồng thủy hải sản trong hồ đập' },
      { key: 'D', content: 'Trồng rau trong nhà kính công nghệ cao' }
    ],
    correctAnswer: 'A',
    explanation: 'Ruộng bậc thang là phương thức canh tác truyền thống tài hoa chống xói mòn của đồng bào vùng cao.',
    gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
  },

  // Công nghệ 4
  {
    id: 'bq-cn4-1',
    grade: 4,
    subject: 'Công nghệ',
    textbook: 'Kết nối tri thức với cuộc sống',
    usageCount: 14,
    orderNumber: 1,
    topicName: 'Công nghệ và đời sống',
    contentUnit: 'Hoa và cây cảnh trong đời sống',
    format: 'TN_NLC',
    level: 1,
    points: 0.5,
    prompt: 'Lợi ích chính của việc trồng hoa và cây cảnh trong khuôn viên trường học là:',
    options: [
      { key: 'A', content: 'Làm đẹp cảnh quan, thanh lọc không khí và tạo bóng mát thư giãn' },
      { key: 'B', content: 'Để thu hoạch lấy củi đun nấu' },
      { key: 'C', content: 'Để bán hoa kiếm lợi nhuận cho lớp học' },
      { key: 'D', content: 'Chỉ để trang trí vào các dịp lễ tết' }
    ],
    correctAnswer: 'A',
    explanation: 'Cây cảnh và hoa làm đẹp trường lớp, thanh lọc bụi bẩn và tạo bóng mát trong lành.',
    gradingGuide: 'Khoanh đúng A được 0,5 điểm.'
  }
];
