import JSZip from 'jszip';
import { ExamPackage, SchoolProfile } from '../types';

/**
 * Downloads a file from the browser with proper MIME type
 */
function downloadBlob(content: string | Blob, filename: string, mimeType: string) {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Normalizes commune name for header
 */
function getCommuneDisplay(name?: string): string {
  if (!name || !name.trim()) return '....';
  const trimmed = name.trim().replace(/^xã\s+/i, '');
  return trimmed.toUpperCase();
}

/**
 * Normalizes school name for header
 */
function getSchoolDisplay(name?: string): string {
  if (!name || !name.trim()) return '………';
  const trimmed = name.trim().replace(/^trường\s+/i, '');
  return trimmed.toUpperCase();
}

/**
 * Formats academic term to uppercase standard format
 * e.g. CUỐI KÌ I, CUỐI NĂM HỌC, GIỮA KÌ I, GIỮA KÌ II
 */
export function formatTermDisplay(term: string): string {
  if (term.includes('Cuối HKI') || term === 'Cuối HKI') return 'CUỐI KÌ I';
  if (term.includes('Cuối năm') || term === 'Cuối năm') return 'CUỐI NĂM HỌC';
  if (term.includes('Giữa HKI') || term === 'Giữa HKI') return 'GIỮA KÌ I';
  if (term.includes('Giữa HKII') || term === 'Giữa HKII') return 'GIỮA KÌ II';
  return term.toUpperCase();
}

/**
 * Standard Word document wrapper strictly adhering to:
 * - Font: Times New Roman, cỡ 14
 * - Lề: Trên 20mm, Dưới 20mm, Trái 30mm, Phải 15mm
 */
function wrapWordHtml(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 210mm 297mm;
      margin-top: 20mm;
      margin-bottom: 20mm;
      margin-left: 30mm;
      margin-right: 15mm;
      mso-header-margin: 10mm;
      mso-footer-margin: 10mm;
      mso-paper-source: 0;
    }
    div.Section1 { page: Section1; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 14pt;
      line-height: 1.35;
      color: #000;
      margin: 0;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 10px;
      margin-bottom: 10px;
      font-family: 'Times New Roman', Times, serif;
    }
    th, td {
      border: 1px solid #000;
      padding: 6px 8px;
      font-size: 13pt;
      vertical-align: middle;
    }
    th {
      background-color: #f2f2f2;
      text-align: center;
      font-weight: bold;
    }
    .header-table {
      border: none !important;
      width: 100%;
      margin-bottom: 15px;
    }
    .header-table td {
      border: none !important;
      padding: 2px 4px;
      vertical-align: top;
    }
    .score-table {
      border: 1px solid #000;
      width: 100%;
      margin-top: 10px;
      margin-bottom: 15px;
    }
    .score-table td {
      border: 1px solid #000;
      height: 60px;
      text-align: center;
    }
    .options-row {
      margin-left: 10mm; /* Phương án A, B, C, D lùi vào 1 tab (1cm ~ 10mm) */
      margin-top: 5px;
      margin-bottom: 8px;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
  </style>
</head>
<body>
  <div class="Section1">
    ${bodyContent}
  </div>
</body>
</html>`;
}

/**
 * 1. Generate Matrix Document (Word)
 */
export function generateMatrixDocHtml(exam: ExamPackage, profile?: SchoolProfile): string {
  const commune = getCommuneDisplay(profile?.communeName || exam.communeName);
  const school = getSchoolDisplay(profile?.schoolName || exam.schoolName);
  const year = profile?.academicYear || exam.academicYear || '2025 - 2026';
  const term = formatTermDisplay(exam.term);
  const headOfDept = profile?.headOfDepartment || '................................';
  const teacher = profile?.teacherName || exam.teacherName || '................................';

  const rowsHtml = exam.matrixTopics
    .map((t, idx) => {
      const c = t.cell;
      const totalCellQuestions =
        c.level1TNCount + c.level1TLCount + c.level2TNCount + c.level2TLCount + c.level3TNCount + c.level3TLCount;
      const totalCellPts = c.totalPoints;
      const pct = ((totalCellPts / 10) * 100).toFixed(0);

      return `<tr>
        <td class="text-center">${idx + 1}</td>
        <td class="bold">${t.topicName}</td>
        <td>${t.lessonContent}</td>
        <td class="text-center">${c.level1TNCount || '-'}</td>
        <td class="text-center">${c.level1TLCount || '-'}</td>
        <td class="text-center">${c.level2TNCount || '-'}</td>
        <td class="text-center">${c.level2TLCount || '-'}</td>
        <td class="text-center">-</td>
        <td class="text-center">${c.level3TLCount || '-'}</td>
        <td class="text-center bold">${totalCellQuestions}</td>
        <td class="text-center bold">${totalCellPts.toFixed(1).replace('.', ',')}</td>
        <td class="text-center">${pct}%</td>
      </tr>`;
    })
    .join('');

  const body = `
  <table class="header-table">
    <tr>
      <td class="text-center bold" style="width: 45%; font-size: 13pt;">
        ỦY BAN NHÂN DÂN XÃ ${commune}<br>
        <span style="text-decoration: underline;">TRƯỜNG ${school}</span>
      </td>
      <td class="text-center bold" style="width: 55%; font-size: 13pt;">
        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
        <span style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span>
      </td>
    </tr>
  </table>

  <h2 class="text-center bold" style="margin-bottom: 2px; text-transform: uppercase; font-size: 15pt;">
    MA TRẬN ĐỀ KIỂM TRA ${term}
  </h2>
  <p class="text-center" style="margin-top: 0; margin-bottom: 15px; font-size: 13pt;">
    NĂM HỌC: ${year} - MÔN : ${exam.subject.toUpperCase()} – LỚP ${exam.grade}<br>
    <span class="italic">(Thời gian làm bài: ${exam.durationMinutes} phút - Bộ sách: ${exam.textbook})</span>
  </p>

  <table>
    <thead>
      <tr>
        <th rowspan="3" style="width: 4%;">TT</th>
        <th rowspan="3" style="width: 18%;">Mạch kiến thức, kĩ năng</th>
        <th rowspan="3" style="width: 18%;">Nội dung / Yêu cầu cần đạt</th>
        <th colspan="6">Mức độ nhận thức (TT 27/2020)</th>
        <th rowspan="2" colspan="2">Tổng cộng</th>
        <th rowspan="3" style="width: 6%;">Tỉ lệ %</th>
      </tr>
      <tr>
        <th colspan="2">Mức 1 (Biết)</th>
        <th colspan="2">Mức 2 (Hiểu)</th>
        <th colspan="2">Mức 3 (Vận dụng - Chỉ TL/TH)</th>
      </tr>
      <tr>
        <th style="width: 5%;">TN</th>
        <th style="width: 5%;">TL</th>
        <th style="width: 5%;">TN</th>
        <th style="width: 5%;">TL</th>
        <th style="width: 5%; color: #666;">TN (-)</th>
        <th style="width: 5%;">TL/TH</th>
        <th style="width: 6%;">Số câu</th>
        <th style="width: 6%;">Điểm</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
      <tr style="background-color: #f7fafc; font-weight: bold;">
        <td colspan="3" class="text-center">TỔNG ĐIỂM TOÀN ĐỀ</td>
        <td class="text-center" colspan="2">${exam.level1Points.toFixed(1).replace('.', ',')} đ</td>
        <td class="text-center" colspan="2">${exam.level2Points.toFixed(1).replace('.', ',')} đ</td>
        <td class="text-center" colspan="2">${exam.level3Points.toFixed(1).replace('.', ',')} đ</td>
        <td class="text-center">${exam.questions.length}</td>
        <td class="text-center">10,0 đ</td>
        <td class="text-center">100%</td>
      </tr>
      <tr style="background-color: #f7fafc; font-weight: bold;">
        <td colspan="3" class="text-center">TỈ LỆ % CÁC MỨC ĐỘ</td>
        <td class="text-center" colspan="2">${((exam.level1Points / 10) * 100).toFixed(0)}%</td>
        <td class="text-center" colspan="2">${((exam.level2Points / 10) * 100).toFixed(0)}%</td>
        <td class="text-center" colspan="2">${((exam.level3Points / 10) * 100).toFixed(0)}%</td>
        <td colspan="2" class="text-center">TN: ${((exam.mcqPoints / 10) * 100).toFixed(0)}%</td>
        <td class="text-center">TL: ${((exam.essayPoints / 10) * 100).toFixed(0)}%</td>
      </tr>
    </tbody>
  </table>

  <br>
  <table class="header-table" style="margin-top: 20px;">
    <tr>
      <td class="text-center bold" style="width: 50%;">
        TỔ TRƯỞNG CHUYÊN MÔN<br>
        <span class="italic font-normal" style="font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <b>${headOfDept}</b>
      </td>
      <td class="text-center bold" style="width: 50%;">
        ......, ngày ...... tháng ...... năm 202...<br>
        GIÁO VIÊN RA MA TRẬN<br>
        <span class="italic font-normal" style="font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <b>${teacher}</b>
      </td>
    </tr>
  </table>
  `;

  return wrapWordHtml(`Ma Trận - ${exam.subject} Lớp ${exam.grade}`, body);
}

/**
 * 2. Generate Specifications Document (Word)
 */
export function generateSpecificationDocHtml(exam: ExamPackage, profile?: SchoolProfile): string {
  const commune = getCommuneDisplay(profile?.communeName || exam.communeName);
  const school = getSchoolDisplay(profile?.schoolName || exam.schoolName);
  const year = profile?.academicYear || exam.academicYear || '2025 - 2026';
  const term = formatTermDisplay(exam.term);
  const headOfDept = profile?.headOfDepartment || '................................';
  const teacher = profile?.teacherName || exam.teacherName || '................................';

  const rows = exam.specifications
    .map((s, idx) => {
      const typeLabel =
        s.questionType === 'TN_NLC'
          ? 'TN nhiều lựa chọn'
          : s.questionType === 'TN_DS'
          ? 'TN đúng/sai'
          : s.questionType === 'TN_NC'
          ? 'TN nối cột'
          : s.questionType === 'TN_DK'
          ? 'TN điền khuyết'
          : s.questionType === 'TH'
          ? 'Thực hành'
          : 'Tự luận';

      const qNumbers = s.questionNumbers.map((n) => `Câu ${n}`).join(', ');

      return `<tr>
        <td class="text-center">${idx + 1}</td>
        <td class="bold">${s.topicName}</td>
        <td>${s.contentUnit}</td>
        <td class="text-center">Mức ${s.level}</td>
        <td>${s.outcomeRequirement}</td>
        <td class="text-center">${typeLabel}</td>
        <td class="text-center bold">${qNumbers}</td>
        <td class="text-center">${s.points.toFixed(1).replace('.', ',')}</td>
      </tr>`;
    })
    .join('');

  const body = `
  <table class="header-table">
    <tr>
      <td class="text-center bold" style="width: 45%; font-size: 13pt;">
        ỦY BAN NHÂN DÂN XÃ ${commune}<br>
        <span style="text-decoration: underline;">TRƯỜNG ${school}</span>
      </td>
      <td class="text-center bold" style="width: 55%; font-size: 13pt;">
        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
        <span style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span>
      </td>
    </tr>
  </table>

  <h2 class="text-center bold" style="margin-bottom: 2px; text-transform: uppercase; font-size: 15pt;">
    BẢNG ĐẶC TẢ MA TRẬN ĐỀ KIỂM TRA ${term}
  </h2>
  <p class="text-center" style="margin-top: 0; margin-bottom: 15px; font-size: 13pt;">
    NĂM HỌC: ${year} - MÔN : ${exam.subject.toUpperCase()} – LỚP ${exam.grade}<br>
    <span class="italic">(Thời gian làm bài: ${exam.durationMinutes} phút - Tổng số câu: ${exam.questions.length} - Tổng điểm: 10,0 điểm)</span>
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 4%;">TT</th>
        <th style="width: 15%;">Mạch kiến thức</th>
        <th style="width: 18%;">Đơn vị kiến thức / Kĩ năng</th>
        <th style="width: 8%;">Mức độ</th>
        <th style="width: 32%;">Yêu cầu cần đạt (YCCĐ)</th>
        <th style="width: 11%;">Hình thức</th>
        <th style="width: 7%;">Câu số</th>
        <th style="width: 5%;">Điểm</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <br>
  <table class="header-table" style="margin-top: 20px;">
    <tr>
      <td class="text-center bold" style="width: 50%;">
        TỔ TRƯỞNG CHUYÊN MÔN<br>
        <span class="italic font-normal" style="font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <b>${headOfDept}</b>
      </td>
      <td class="text-center bold" style="width: 50%;">
        ......, ngày ...... tháng ...... năm 202...<br>
        NGƯỜI LẬP ĐẶC TẢ<br>
        <span class="italic font-normal" style="font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <b>${teacher}</b>
      </td>
    </tr>
  </table>
  `;

  return wrapWordHtml(`Bảng Đặc Tả - ${exam.subject} Lớp ${exam.grade}`, body);
}

/**
 * 3. Generate Complete Exam Paper (Word)
 * Requirements:
 * - Font: Times New Roman, cỡ 14
 * - Lề: Trên 20mm, Dưới 20mm, Trái 30mm, Phải 15mm
 * - Thời gian làm bài: ....
 * - Tiêu đề:
 *   ỦY BAN NHÂN DÂN XÃ ....
 *   TRƯỜNG ………
 *   ĐỀ KIỂM TRA {CUỐI KÌ I / CUỐI NĂM HỌC}
 *   MÔN : .... – LỚP {3/4/5}
 *   NĂM HỌC: ………
 *   Họ và tên học sinh: ………………… Lớp: ………
 * - Thứ tự câu: từ Câu 1 đến hết đề
 * - Không ghi phần trắc nghiệm, tự luận trong đề kiểm tra
 * - Trắc nghiệm sắp xếp trước, Tự luận sau. M1 trước, M2 sau; Tự luận M1 -> M2 -> M3
 * - Cách trình bày: Câu số (chữ đậm), điểm (chữ nghiêng và không đậm) liền câu số, câu hỏi (chữ không đậm):
 *   VD: Câu 1 (0,5 điểm): CÂU HỎI ĐỂ C KO ĐẬM
 * - Câu số và ý (a,b,…) bằng lề - không tab
 * - Phương án (A, B, C, D) lùi vào 1 tab (1cm ~ 10mm)
 * - Lớp 1, 2, 3: 3 phương án (A, B, C); Lớp 4, 5: 4 phương án (A, B, C, D)
 * - KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG
 */
export function generateExamPaperDocHtml(exam: ExamPackage, profile?: SchoolProfile): string {
  const commune = getCommuneDisplay(profile?.communeName || exam.communeName);
  const school = getSchoolDisplay(profile?.schoolName || exam.schoolName);
  const year = profile?.academicYear || exam.academicYear || '2025 - 2026';
  const term = formatTermDisplay(exam.term);

  const questionsHtml = exam.questions
    .map((q) => {
      // Points formatting: (0,5 điểm)
      const pointsFormatted = q.points.toString().replace('.', ',');
      
      // Câu số (chữ đậm), điểm (chữ nghiêng không đậm) liền câu số, câu hỏi (chữ không đậm)
      let qHtml = `<div style="margin-bottom: 12px; text-align: justify;">
        <span class="bold">Câu ${q.orderNumber}</span> <span class="italic">(${pointsFormatted} điểm):</span> ${q.prompt}
      </div>`;

      // Render Multiple Choice Options (lùi vào 1 tab = 10mm)
      if (q.format === 'TN_NLC' && q.options && q.options.length > 0) {
        const optHtml = q.options
          .map(
            (o) =>
              `<span style="margin-right: 28px; display: inline-block;"><span class="bold">${o.key}.</span> ${o.content}</span>`
          )
          .join('');
        qHtml += `<div class="options-row">${optHtml}</div>`;
      }

      // Render True / False or Sub-items (bằng lề, không tab)
      if (q.subItems && q.subItems.length > 0) {
        const subHtml = q.subItems
          .map((sub) => {
            const subPts = sub.points ? ` <span class="italic">(${sub.points.toString().replace('.', ',')} đ):</span>` : '';
            return `<div style="margin-bottom: 4px; text-align: justify;">
              <span class="bold">${sub.label})</span>${subPts} ${sub.text}
            </div>`;
          })
          .join('');
        qHtml += `<div style="margin-top: 4px; margin-bottom: 6px;">${subHtml}</div>`;
      }

      // Render Match pairs
      if (q.format === 'TN_NC' && q.matchPairs && q.matchPairs.length > 0) {
        const pairsTable = `<table style="width: 85%; margin-left: 10mm; border: 1px dashed #666; margin-top: 6px; margin-bottom: 8px;">
          <tr>
            <th style="width: 50%; background-color: #fafafa; border: 1px dashed #999; font-size: 13pt;">Cột A</th>
            <th style="width: 50%; background-color: #fafafa; border: 1px dashed #999; font-size: 13pt;">Cột B</th>
          </tr>
          ${q.matchPairs
            .map(
              (p) =>
                `<tr>
                  <td style="border: 1px dashed #999; font-size: 13pt;"><b>${p.leftKey}.</b> ${p.leftText}</td>
                  <td style="border: 1px dashed #999; font-size: 13pt;"><b>${p.rightKey}.</b> ${p.rightText}</td>
                </tr>`
            )
            .join('')}
        </table>`;
        qHtml += pairsTable;
      }

      // Render grid if math grid visual is requested
      if (q.hasGridVisual) {
        qHtml += `<div style="margin-left: 10mm; margin-top: 6px; margin-bottom: 8px;">
          <table style="width: 160px; height: 90px; border-collapse: collapse; border: 1px solid #999;">
            ${Array.from({ length: 4 })
              .map(
                () =>
                  `<tr>${Array.from({ length: 5 })
                    .map(
                      () =>
                        `<td style="border: 1px solid #ccc; height: 22px; width: 32px; text-align: center;"></td>`
                    )
                    .join('')}</tr>`
              )
              .join('')}
          </table>
          <small class="italic" style="color: #666; font-size: 11pt;">(Lưới ô vuông hỗ trợ tính toán / hình học)</small>
        </div>`;
      }

      // If Essay or Practical, add designated writing space
      if (q.format === 'TL' || q.format === 'TH') {
        const linesCount = q.points >= 2 ? 6 : 4;
        const lines = Array.from({ length: linesCount })
          .map(
            () =>
              `<div style="border-bottom: 1px dotted #888; height: 22px; margin-bottom: 5px;"></div>`
          )
          .join('');
        qHtml += `<div style="margin-top: 6px; margin-bottom: 14px;">
          <div class="italic" style="font-size: 12pt; color: #444; margin-bottom: 3px;">Bài làm:</div>
          ${lines}
        </div>`;
      }

      return qHtml;
    })
    .join('');

  // Reading passage if any (Tiếng Việt)
  let passageHtml = '';
  if (exam.readingPassage && exam.readingPassage.content) {
    passageHtml = `
    <div style="border: 1px solid #444; padding: 12px; margin-bottom: 16px; background-color: #fafbfc;">
      <h3 class="text-center bold" style="margin-top: 0; margin-bottom: 4px; text-transform: uppercase; font-size: 14pt;">
        ${exam.readingPassage.title}
      </h3>
      ${
        exam.readingPassage.author
          ? `<p class="text-right italic" style="margin-top: 0; margin-bottom: 8px; font-size: 12pt;">Theo ${exam.readingPassage.author}</p>`
          : ''
      }
      <div style="text-align: justify; text-indent: 1.5em; line-height: 1.45; font-size: 13.5pt;">
        ${exam.readingPassage.content.replace(/\n/g, '<br>')}
      </div>
      <p class="italic text-right" style="margin-top: 6px; margin-bottom: 0; font-size: 11.5pt; color: #555;">
        (Độ dài: ${exam.readingPassage.wordCount} chữ - Chuẩn ngữ liệu GDPT 2018)
      </p>
    </div>
    <div class="bold italic" style="margin-bottom: 12px; text-decoration: underline; font-size: 13.5pt;">
      Dựa vào nội dung bài đọc trên, em hãy khoanh vào chữ cái trước câu trả lời đúng và hoàn thành các bài tập sau:
    </div>`;
  }

  // Exact Header Layout requested by User:
  // ỦY BAN NHÂN DÂN XÃ ....
  // TRƯỜNG ………
  // ĐỀ KIỂM TRA {CUỐI KÌ I / CUỐI NĂM HỌC}
  // MÔN : .... – LỚP {3/4/5}
  // NĂM HỌC: ………
  // Họ và tên học sinh: ………………… Lớp: ………
  // Thời gian làm bài: ....
  const body = `
  <table class="header-table" style="width: 100%; border: none;">
    <tr>
      <td class="bold text-center" style="width: 45%; vertical-align: top; border: none; font-size: 13pt;">
        ỦY BAN NHÂN DÂN XÃ ${commune}<br>
        <span style="font-size: 14pt;">TRƯỜNG ${school}</span><br>
        <span class="italic font-normal" style="font-size: 11pt;">(Mã đề: <b>${exam.examCode}</b>)</span>
      </td>
      <td class="bold text-center" style="width: 55%; vertical-align: top; border: none; font-size: 13pt;">
        <span style="font-size: 14.5pt;">ĐỀ KIỂM TRA ${term}</span><br>
        <span>MÔN : ${exam.subject.toUpperCase()} – LỚP ${exam.grade}</span><br>
        <span style="font-weight: normal; font-size: 13pt;">NĂM HỌC: ${year}</span><br>
        <span style="font-weight: normal; font-style: italic; font-size: 12pt;">Thời gian làm bài: ${exam.durationMinutes} phút</span>
      </td>
    </tr>
  </table>

  <div style="margin-top: 10px; margin-bottom: 12px; font-size: 14pt;">
    Họ và tên học sinh: ............................................................................ Lớp: <b>${exam.grade}....</b>
  </div>

  <table class="score-table">
    <tr>
      <td style="width: 30%; font-weight: bold; height: 26px; font-size: 13pt;">ĐIỂM</td>
      <td style="width: 70%; font-weight: bold; height: 26px; font-size: 13pt;">LỜI NHẬN XÉT CỦA THẦY CÔ GIÁO</td>
    </tr>
    <tr>
      <td style="height: 55px;"></td>
      <td style="height: 55px; text-align: left; padding: 6px;"></td>
    </tr>
  </table>

  ${passageHtml}

  <div style="margin-top: 15px;">
    ${questionsHtml}
  </div>

  <div class="text-center italic" style="margin-top: 25px; font-weight: bold; font-size: 13pt;">
    ------------------- HẾT -------------------<br>
    <span style="font-weight: normal; font-size: 11pt;">(Cán bộ coi kiểm tra không giải thích gì thêm)</span>
  </div>
  `;

  return wrapWordHtml(`Đề kiểm tra ${exam.subject} Lớp ${exam.grade}`, body);
}

/**
 * 4. Generate Answer and Grading Guide Document (Word)
 */
export function generateAnswerDocHtml(exam: ExamPackage, profile?: SchoolProfile): string {
  const commune = getCommuneDisplay(profile?.communeName || exam.communeName);
  const school = getSchoolDisplay(profile?.schoolName || exam.schoolName);
  const year = profile?.academicYear || exam.academicYear || '2025 - 2026';
  const term = formatTermDisplay(exam.term);
  const headOfDept = profile?.headOfDepartment || '................................';
  const teacher = profile?.teacherName || exam.teacherName || '................................';

  const mcqs = exam.questions.filter((q) => q.format.startsWith('TN'));
  const essays = exam.questions.filter((q) => !q.format.startsWith('TN'));

  // MCQ answer table rows
  const mcqCells = mcqs
    .map(
      (q) => `<tr>
      <td class="text-center bold">Câu ${q.orderNumber}</td>
      <td class="text-center bold" style="color: #0b57d0; font-size: 14pt;">${q.correctAnswer}</td>
      <td class="text-center">${q.points.toFixed(1).replace('.', ',')} đ</td>
      <td>${q.explanation || 'Khoanh đúng phương án theo quy chuẩn.'}</td>
    </tr>`
    )
    .join('');

  // Essay grading guide
  const essaySteps = essays
    .map((q) => {
      return `<div style="margin-bottom: 16px; border-bottom: 1px dashed #ccc; padding-bottom: 8px;">
        <div class="bold" style="color: #1e3a8a;">
          Câu ${q.orderNumber} (${q.points.toString().replace('.', ',')} điểm) - [Mức ${q.level}]:
        </div>
        <div style="margin-top: 4px; margin-bottom: 4px; font-style: italic;">
          <b>Đề bài:</b> ${q.prompt}
        </div>
        <div style="margin-top: 6px; background-color: #f8fafc; padding: 8px; border-left: 3px solid #2563eb;">
          <div class="bold">Đáp án / Lời giải chi tiết:</div>
          <div style="white-space: pre-wrap; margin-top: 4px;">${q.correctAnswer}</div>
          <div class="bold" style="margin-top: 8px; color: #047857;">Hướng dẫn chấm và biểu điểm chi tiết:</div>
          <div style="white-space: pre-wrap; margin-top: 4px;">${q.gradingGuide || 'Học sinh làm theo cách khác đúng vẫn cho điểm tối đa theo từng bước tương đương.'}</div>
        </div>
      </div>`;
    })
    .join('');

  const body = `
  <table class="header-table">
    <tr>
      <td class="text-center bold" style="width: 45%; font-size: 13pt;">
        ỦY BAN NHÂN DÂN XÃ ${commune}<br>
        <span style="text-decoration: underline;">TRƯỜNG ${school}</span>
      </td>
      <td class="text-center bold" style="width: 55%; font-size: 13pt;">
        <span style="font-size: 14.5pt;">HƯỚNG DẪN CHẤM & ĐÁP ÁN ${term}</span><br>
        <span>MÔN : ${exam.subject.toUpperCase()} – LỚP ${exam.grade}</span><br>
        <span style="font-weight: normal; font-size: 13pt;">NĂM HỌC: ${year}</span><br>
        <span class="italic font-normal" style="font-size: 11pt;">(Mã đề: <b>${exam.examCode}</b> - Thang điểm 10)</span>
      </td>
    </tr>
  </table>

  <h3 class="bold" style="text-transform: uppercase; color: #1e40af; margin-top: 15px; font-size: 13pt;">
    A. HƯỚNG DẪN CHẤM CÂU HỎI TRẮC NGHIỆM (${exam.mcqPoints.toString().replace('.', ',')} ĐIỂM)
  </h3>
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Câu số</th>
        <th style="width: 20%;">Đáp án đúng</th>
        <th style="width: 15%;">Thang điểm</th>
        <th style="width: 50%;">Ghi chú / Yêu cầu</th>
      </tr>
    </thead>
    <tbody>
      ${mcqCells}
    </tbody>
  </table>

  <h3 class="bold" style="text-transform: uppercase; color: #1e40af; margin-top: 25px; font-size: 13pt;">
    B. HƯỚNG DẪN CHẤM CÂU HỎI TỰ LUẬN / THỰC HÀNH (${exam.essayPoints.toString().replace('.', ',')} ĐIỂM)
  </h3>
  <div>
    ${essaySteps}
  </div>

  <div style="margin-top: 20px; font-style: italic; background-color: #fffbeb; padding: 10px; border: 1px solid #fef3c7; font-size: 13pt;">
    <b>* Lưu ý chung khi chấm bài:</b><br>
    - Đối với phần tự luận: Học sinh giải theo cách khác nhưng đúng bản chất, lập luận chặt chẽ và kết quả đúng vẫn cho điểm tối đa từng phần tương ứng.<br>
    - Điểm toàn bài là tổng điểm các câu không làm tròn (theo thang điểm 10 quy định tại Thông tư 27/2020/TT-BGDĐT).
  </div>

  <br>
  <table class="header-table" style="margin-top: 20px;">
    <tr>
      <td class="text-center bold" style="width: 50%;">
        TỔ TRƯỞNG CHUYÊN MÔN<br>
        <span class="italic font-normal" style="font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <b>${headOfDept}</b>
      </td>
      <td class="text-center bold" style="width: 50%;">
        ......, ngày ...... tháng ...... năm 202...<br>
        GIÁO VIÊN SOẠN ĐÁP ÁN<br>
        <span class="italic font-normal" style="font-size: 11pt;">(Ký và ghi rõ họ tên)</span><br><br><br><br>
        <b>${teacher}</b>
      </td>
    </tr>
  </table>
  `;

  return wrapWordHtml(`Đáp Án - ${exam.subject} Lớp ${exam.grade}`, body);
}

/**
 * 5. Generate Excel Matrix (.xls format)
 */
export function generateMatrixExcelHtml(exam: ExamPackage, profile?: SchoolProfile): string {
  const commune = getCommuneDisplay(profile?.communeName || exam.communeName);
  const school = getSchoolDisplay(profile?.schoolName || exam.schoolName);
  const year = profile?.academicYear || exam.academicYear || '2025 - 2026';
  const term = formatTermDisplay(exam.term);

  const rows = exam.matrixTopics
    .map((t, idx) => {
      const c = t.cell;
      const count =
        c.level1TNCount + c.level1TLCount + c.level2TNCount + c.level2TLCount + c.level3TNCount + c.level3TLCount;
      return `<tr>
        <td style="border: 1px solid #000; text-align: center;">${idx + 1}</td>
        <td style="border: 1px solid #000; font-weight: bold;">${t.topicName}</td>
        <td style="border: 1px solid #000;">${t.lessonContent}</td>
        <td style="border: 1px solid #000; text-align: center;">${c.level1TNCount || 0}</td>
        <td style="border: 1px solid #000; text-align: center;">${c.level1TLCount || 0}</td>
        <td style="border: 1px solid #000; text-align: center;">${c.level2TNCount || 0}</td>
        <td style="border: 1px solid #000; text-align: center;">${c.level2TLCount || 0}</td>
        <td style="border: 1px solid #000; text-align: center;">-</td>
        <td style="border: 1px solid #000; text-align: center;">${c.level3TLCount || 0}</td>
        <td style="border: 1px solid #000; text-align: center; font-weight: bold;">${count}</td>
        <td style="border: 1px solid #000; text-align: center; font-weight: bold;">${c.totalPoints.toFixed(1).replace('.', ',')}</td>
      </tr>`;
    })
    .join('');

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
      table { border-collapse: collapse; font-family: 'Times New Roman', Times, serif; font-size: 13pt; }
      th { background-color: #dbeafe; font-weight: bold; border: 1px solid #000; padding: 6px; }
      td { border: 1px solid #000; padding: 6px; }
    </style>
  </head>
  <body>
    <h3>ỦY BAN NHÂN DÂN XÃ ${commune} - TRƯỜNG ${school}</h3>
    <h2>MA TRẬN ĐỀ KIỂM TRA ${term}</h2>
    <p>NĂM HỌC: ${year} | MÔN : ${exam.subject.toUpperCase()} – LỚP ${exam.grade} | Thời gian: ${exam.durationMinutes} phút</p>
    <table>
      <thead>
        <tr>
          <th rowspan="2">TT</th>
          <th rowspan="2">Mạch kiến thức</th>
          <th rowspan="2">Nội dung bài học</th>
          <th colspan="2">Mức 1</th>
          <th colspan="2">Mức 2</th>
          <th colspan="2">Mức 3 (Chỉ TL/TH)</th>
          <th rowspan="2">Tổng câu</th>
          <th rowspan="2">Tổng điểm</th>
        </tr>
        <tr>
          <th>TN</th><th>TL</th>
          <th>TN</th><th>TL</th>
          <th>TN (-)</th><th>TL/TH</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
  </html>`;
}

/**
 * Public export triggers
 */
export function downloadMatrixDoc(exam: ExamPackage, profile?: SchoolProfile) {
  const content = generateMatrixDocHtml(exam, profile);
  downloadBlob(content, `01_Ma_tran_${exam.subject}_Lop${exam.grade}.doc`, 'application/msword');
}

export function downloadMatrixExcel(exam: ExamPackage, profile?: SchoolProfile) {
  const content = generateMatrixExcelHtml(exam, profile);
  downloadBlob(content, `01_Ma_tran_${exam.subject}_Lop${exam.grade}.xls`, 'application/vnd.ms-excel');
}

export function downloadSpecificationDoc(exam: ExamPackage, profile?: SchoolProfile) {
  const content = generateSpecificationDocHtml(exam, profile);
  downloadBlob(content, `02_Bang_dac_ta_${exam.subject}_Lop${exam.grade}.doc`, 'application/msword');
}

export function downloadExamPaperDoc(exam: ExamPackage, profile?: SchoolProfile) {
  const content = generateExamPaperDocHtml(exam, profile);
  downloadBlob(content, `03_De_kiem_tra_${exam.subject}_Lop${exam.grade}_Ma${exam.examCode}.doc`, 'application/msword');
}

export function downloadAnswerDoc(exam: ExamPackage, profile?: SchoolProfile) {
  const content = generateAnswerDocHtml(exam, profile);
  downloadBlob(content, `04_Dap_an_huong_dan_cham_${exam.subject}_Lop${exam.grade}.doc`, 'application/msword');
}

/**
 * 5. Download complete ZIP dossier
 */
export async function downloadFullPackageZip(exam: ExamPackage, profile?: SchoolProfile) {
  const zip = new JSZip();

  const folderName = `Ho_so_de_kiem_tra_${exam.subject}_Lop${exam.grade}_${exam.term.replace(/\s+/g, '_')}`;
  const folder = zip.folder(folderName) || zip;

  folder.file('01_Ma_tran_de_kiem_tra.doc', generateMatrixDocHtml(exam, profile));
  folder.file('01_Ma_tran_de_kiem_tra.xls', generateMatrixExcelHtml(exam, profile));
  folder.file('02_Bang_dac_ta_ma_tran.doc', generateSpecificationDocHtml(exam, profile));
  folder.file(`03_De_kiem_tra_chinh_thuc_Ma_${exam.examCode}.doc`, generateExamPaperDocHtml(exam, profile));
  folder.file('04_Dap_an_va_huong_dan_cham.doc', generateAnswerDocHtml(exam, profile));
  
  // README summary text file
  const commune = getCommuneDisplay(profile?.communeName || exam.communeName);
  const school = getSchoolDisplay(profile?.schoolName || exam.schoolName);
  const year = profile?.academicYear || exam.academicYear || '2025 - 2026';
  const term = formatTermDisplay(exam.term);

  const summaryTxt = `BỘ HỒ SƠ ĐỀ KIỂM TRA ĐỊNH KỲ THEO THÔNG TƯ 27 & GDPT 2018
Cấp xã: ỦY BAN NHÂN DÂN XÃ ${commune}
Đơn vị: TRƯỜNG ${school}
Tổ trưởng chuyên môn: ${profile?.headOfDepartment || '................................'}
Giáo viên ra đề: ${profile?.teacherName || exam.teacherName || '................................'}
MÔN : ${exam.subject.toUpperCase()} – LỚP ${exam.grade}
Học kỳ: ${term}
NĂM HỌC: ${year}
Bộ sách: ${exam.textbook}
Thời gian làm bài: ${exam.durationMinutes} phút
Tổng số câu hỏi: ${exam.questions.length} câu
Tổng điểm: 10,0 điểm (Trắc nghiệm: ${exam.mcqPoints}đ, Tự luận: ${exam.essayPoints}đ)
Tỉ lệ các mức độ: Mức 1: ${((exam.level1Points/10)*100).toFixed(0)}% | Mức 2: ${((exam.level2Points/10)*100).toFixed(0)}% | Mức 3: ${((exam.level3Points/10)*100).toFixed(0)}%

DANH MỤC TỆP TRONG BỘ HỒ SƠ:
1. 01_Ma_tran_de_kiem_tra.doc (và .xls)
2. 02_Bang_dac_ta_ma_tran.doc
3. 03_De_kiem_tra_chinh_thuc_Ma_${exam.examCode}.doc
4. 04_Dap_an_va_huong_dan_cham.doc
`;
  folder.file('THONG_TIN_HO_SO.txt', summaryTxt);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `${folderName}.zip`, 'application/zip');
}

/**
 * Print directly via invisible iframe to prevent popup blocker in sandbox
 */
export function printExamDirectly(exam: ExamPackage, profile?: SchoolProfile) {
  const content = generateExamPaperDocHtml(exam, profile);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(content);
    doc.close();
    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  }
}
