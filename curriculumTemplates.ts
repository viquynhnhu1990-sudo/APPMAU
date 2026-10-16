import { GradeLevel, SubjectName, ExamTerm, MatrixTopicRow } from '../types';

export function getDefaultMatrixTopics(
  grade: GradeLevel,
  subject: SubjectName,
  term: ExamTerm
): MatrixTopicRow[] {
  // Math Grade 4
  if (subject === 'Toán' && grade === 4) {
    return [
      {
        id: 'top-toan4-1',
        topicName: 'Số và phép tính',
        lessonContent: 'Số có nhiều chữ số; Các phép tính cộng, trừ, nhân, chia; Tính chất giao hoán, kết hợp',
        expectedOutcomes: {
          level1: ['Nhận biết hàng và lớp của số có nhiều chữ số', 'Thực hiện cộng, trừ, nhân, chia cơ bản'],
          level2: ['Tính giá trị của biểu thức chứa chữ', 'Vận dụng tính chất kết hợp, giao hoán tính nhanh'],
          level3: ['Giải bài toán tìm hai số khi biết tổng và hiệu', 'Bài toán có lời văn 3 bước tính thực tế']
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
        id: 'top-toan4-2',
        topicName: 'Hình học và đo lường',
        lessonContent: 'Góc nhọn, góc tù, góc bẹt; Đường thẳng vuông góc, song song; Đơn vị yến, tạ, tấn, giây, thế kỉ',
        expectedOutcomes: {
          level1: ['Nhận biết các loại góc và quan hệ giữa các đơn vị khối lượng'],
          level2: ['Chuyển đổi đơn vị đo thời gian, khối lượng; Nhận biết đường song song, vuông góc'],
          level3: ['Vận dụng tính diện tích, chu vi hình chữ nhật, hình bình hành trong tình huống thực tế']
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
    ];
  }

  // Math Grade 1
  if (subject === 'Toán' && grade === 1) {
    return [
      {
        id: 'top-toan1-1',
        topicName: 'Số và phép tính (80%)',
        lessonContent: 'Các số trong phạm vi 10; Phép cộng, phép trừ trong phạm vi 10',
        expectedOutcomes: {
          level1: ['Đếm, đọc, viết các số trong phạm vi 10', 'Nhận biết kết quả các phép cộng trừ đơn giản'],
          level2: ['So sánh số, tìm số còn thiếu trong dãy số', 'Thực hiện phép tính liên tiếp 3 số'],
          level3: ['Vận dụng giải bài toán bằng hình ảnh thực tế gắn với đồ dùng học tập']
        },
        cell: {
          level1TNCount: 6,
          level1TNPoints: 3.0,
          level1TLCount: 2,
          level1TLPoints: 1.0,
          level2TNCount: 2,
          level2TNPoints: 1.0,
          level2TLCount: 1,
          level2TLPoints: 1.0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 2,
          level3TLPoints: 2.0,
          totalPoints: 8.0
        }
      },
      {
        id: 'top-toan1-2',
        topicName: 'Hình học và đo lường (20%)',
        lessonContent: 'Hình vuông, hình tròn, hình tam giác, hình chữ nhật; Vị trí định hướng không gian',
        expectedOutcomes: {
          level1: ['Nhận biết hình vuông, hình tròn, hình tam giác trong thực tế'],
          level2: ['Phân loại hình khối theo màu sắc, kích thước và hình dáng'],
          level3: ['Ghép các hình phẳng để tạo thành hình mới có ý nghĩa']
        },
        cell: {
          level1TNCount: 2,
          level1TNPoints: 1.0,
          level1TLCount: 0,
          level1TLPoints: 0,
          level2TNCount: 2,
          level2TNPoints: 1.0,
          level2TLCount: 0,
          level2TLPoints: 0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 0,
          level3TLPoints: 0,
          totalPoints: 2.0
        }
      }
    ];
  }

  // Vietnamese Grade 3
  if (subject === 'Tiếng Việt') {
    return [
      {
        id: 'top-tv-1',
        topicName: 'Đọc hiểu văn bản',
        lessonContent: 'Bài đọc ngoài sách giáo khoa (Độ dài 200 - 250 chữ theo chuẩn GDPT 2018)',
        expectedOutcomes: {
          level1: ['Nhận biết chi tiết, hình ảnh, nhân vật trong bài đọc'],
          level2: ['Hiểu ý nghĩa của hình ảnh, nội dung chính của câu chuyện'],
          level3: ['Rút ra bài học, liên hệ bản thân và viết câu bày tỏ cảm xúc']
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
        id: 'top-tv-2',
        topicName: 'Kiến thức Tiếng Việt',
        lessonContent: 'Từ chỉ sự vật, đặc điểm, hoạt động; Biện pháp tu từ so sánh; Dấu câu',
        expectedOutcomes: {
          level1: ['Nhận biết từ chỉ sự vật, đặc điểm và hình ảnh so sánh'],
          level2: ['Phân biệt các nhóm từ và công dụng của dấu chấm, dấu hai chấm'],
          level3: ['Vận dụng đặt câu có hình ảnh so sánh sinh động']
        },
        cell: {
          level1TNCount: 2,
          level1TNPoints: 1.0,
          level1TLCount: 0,
          level1TLPoints: 0,
          level2TNCount: 2,
          level2TNPoints: 1.0,
          level2TLCount: 0,
          level2TLPoints: 0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 1,
          level3TLPoints: 1.0,
          totalPoints: 3.0
        }
      },
      {
        id: 'top-tv-3',
        topicName: 'Viết đoạn văn',
        lessonContent: 'Viết đoạn văn ngắn (từ 5 đến 7 câu) kể về một hoạt động học tập hoặc tình cảm gia đình, quê hương',
        expectedOutcomes: {
          level1: ['Viết câu đúng ngữ pháp, không sai lỗi chính tả cơ bản'],
          level2: ['Đoạn văn có câu mở đoạn, thân đoạn và kết đoạn rõ ý'],
          level3: ['Sử dụng từ ngữ gợi cảm, hình ảnh sinh động thể hiện tình cảm chân thực']
        },
        cell: {
          level1TNCount: 0,
          level1TNPoints: 0,
          level1TLCount: 0,
          level1TLPoints: 0,
          level2TNCount: 0,
          level2TNPoints: 0,
          level2TLCount: 1,
          level2TLPoints: 1.0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 1,
          level3TLPoints: 2.0,
          totalPoints: 3.0
        }
      }
    ];
  }

  // Informatics Grade 3 / 4 / 5
  if (subject === 'Tin học') {
    const isGrade5 = grade === 5;
    const isGrade4 = grade === 4;
    return [
      {
        id: 'top-tin-1',
        topicName: 'Lý thuyết (Máy tính, mạng & đạo đức số)',
        lessonContent: 'Tìm kiếm thông tin an toàn, sử dụng thiết bị phần cứng, phần mềm giáo dục',
        expectedOutcomes: {
          level1: ['Nhận biết các thiết bị, nút lệnh, biểu tượng phần mềm'],
          level2: ['Hiểu cách lựa chọn từ khóa và các quy tắc bảo mật tài khoản'],
          level3: ['Vận dụng giải quyết tình huống an toàn thông tin']
        },
        cell: {
          level1TNCount: 4,
          level1TNPoints: 2.0,
          level1TLCount: 1,
          level1TLPoints: 0.5,
          level2TNCount: 2,
          level2TNPoints: 1.0,
          level2TLCount: 1,
          level2TLPoints: 1.5,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: 0,
          level3TLPoints: 0,
          totalPoints: isGrade5 ? 5.0 : isGrade4 ? 6.0 : 7.0
        }
      },
      {
        id: 'top-tin-2',
        topicName: 'Thực hành (Soạn thảo văn bản & Lập trình)',
        lessonContent: 'Thực hành soạn thảo văn bản Word, chèn bảng biểu hoặc lập trình Scratch theo kịch bản',
        expectedOutcomes: {
          level1: ['Khởi động và thao tác cơ bản trên phần mềm'],
          level2: ['Định dạng chữ, màu sắc và sắp xếp bố cục'],
          level3: ['Tạo sản phẩm hoàn chỉnh theo yêu cầu thực tế trên máy tính']
        },
        cell: {
          level1TNCount: 0,
          level1TNPoints: 0,
          level1TLCount: 0,
          level1TLPoints: 0,
          level2TNCount: 0,
          level2TNPoints: 0,
          level2TLCount: 0,
          level2TLPoints: 0,
          level3TNCount: 0,
          level3TNPoints: 0,
          level3TLCount: isGrade5 ? 2 : 2,
          level3TLPoints: isGrade5 ? 5.0 : isGrade4 ? 4.0 : 3.0,
          totalPoints: isGrade5 ? 5.0 : isGrade4 ? 4.0 : 3.0
        }
      }
    ];
  }

  // Science Grade 4 / 5
  if (subject === 'Khoa học') {
    return [
      {
        id: 'top-kh-1',
        topicName: 'Chất (Nước và không khí)',
        lessonContent: 'Tính chất và vòng tuần hoàn của nước; Bảo vệ nguồn nước và bầu không khí trong lành',
        expectedOutcomes: {
          level1: ['Nhận biết tính chất của nước và không khí'],
          level2: ['Giải thích hiện tượng ngưng tụ, bay hơi và sự cần thiết của không khí'],
          level3: ['Đề xuất việc làm cụ thể bảo vệ môi trường nước tại địa phương']
        },
        cell: {
          level1TNCount: 3,
          level1TNPoints: 1.5,
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
          totalPoints: 5.0
        }
      },
      {
        id: 'top-kh-2',
        topicName: 'Năng lượng & Sinh vật',
        lessonContent: 'Ánh sáng và nhiệt; Thực vật và động vật cần gì để sống',
        expectedOutcomes: {
          level1: ['Nhận biết vai trò của ánh sáng và nhiệt đối với đời sống'],
          level2: ['Phân tích sự trao đổi chất của thực vật và động vật với môi trường'],
          level3: ['Vận dụng kiến thức chăm sóc cây trồng, vật nuôi gia đình']
        },
        cell: {
          level1TNCount: 3,
          level1TNPoints: 1.5,
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
          totalPoints: 5.0
        }
      }
    ];
  }

  // Default fallback for any other subject
  return [
    {
      id: 'top-gen-1',
      topicName: 'Chủ đề 1: Kiến thức cơ bản',
      lessonContent: 'Các khái niệm và kỹ năng cốt lõi theo chương trình GDPT 2018',
      expectedOutcomes: {
        level1: ['Nhận biết các yếu tố và quy tắc cơ bản'],
        level2: ['Hiểu và kết nối các tình huống giải bài tập'],
        level3: ['Vận dụng giải quyết bài toán thực tế']
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
      id: 'top-gen-2',
      topicName: 'Chủ đề 2: Kỹ năng nâng cao và thực tiễn',
      lessonContent: 'Mở rộng liên hệ thực tế cuộc sống địa phương',
      expectedOutcomes: {
        level1: ['Nhận biết hiện tượng tự nhiên và xã hội'],
        level2: ['Hiểu nguyên nhân và mối liên hệ giữa các hiện tượng'],
        level3: ['Đề xuất giải pháp và trình bày sáng tạo']
      },
      cell: {
        level1TNCount: 3,
        level1TNPoints: 1.5,
        level1TLCount: 1,
        level1TLPoints: 0.5,
        level2TNCount: 2,
        level2TNPoints: 1.0,
        level2TLCount: 0,
        level2TLPoints: 0,
        level3TNCount: 0,
        level3TNPoints: 0,
        level3TLCount: 1,
        level3TLPoints: 1.5,
        totalPoints: 4.5
      }
    }
  ];
}
