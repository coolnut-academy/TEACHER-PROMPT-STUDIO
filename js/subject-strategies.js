/**
 * Teacher Prompt Studio — Subject Strategies & Curriculum Rules
 *
 * Extensible knowledge base for Thailand's 8 core learning areas (+ custom),
 * assessment types, personalized assessment strategies (A–D), and quick presets.
 * Adding a new subject or strategy here requires zero changes to prompt-engine.js.
 */
(function (root) {
  'use strict';

  const TPS = (root.TPS = root.TPS || {});

  const SUBJECT_GROUPS = [
    {
      id: 'thai',
      label: 'ภาษาไทย',
      shortLabel: 'ภาษาไทย',
      defaultStrategy: 'contextual',
      subjects: [
        { id: 'ภาษาไทย', label: 'ภาษาไทย (พื้นฐาน)', strategy: 'contextual' },
        { id: 'การอ่านและการเขียน', label: 'การอ่านและการเขียน', strategy: 'contextual' },
        { id: 'หลักภาษาไทย', label: 'หลักภาษาไทย', strategy: 'contextual' },
        { id: 'วรรณคดีและวรรณกรรม', label: 'วรรณคดีและวรรณกรรม', strategy: 'case-based' },
        { id: 'การสื่อสารและการนำเสนอ', label: 'การสื่อสารและการนำเสนอ', strategy: 'contextual' }
      ],
      academicRules: [
        'ใช้ภาษาไทยที่ถูกต้องตามหลักอักขรวิธี การสะกดคำ และระดับภาษาที่เหมาะสมกับช่วงวัย',
        'แยกส่วนบทอ่าน/ข้อความตั้งต้นออกจากคำถามอย่างชัดเจน เพื่อลดภาระความจำในการเลื่อนหน้าจอ',
        'ควบคุมความยาวบทอ่าน คำศัพท์ และระดับความซับซ้อนของประโยคให้ใกล้เคียงกันทุกชุดโจทย์',
        'หากมีข้อคำถามเชิงวิเคราะห์ จับใจความ หรือแสดงความคิดเห็น ต้องจัดทำเกณฑ์ประเมิน (Rubric) และแนวคำตอบสำคัญ ห้ามตัดสินคะแนนอัตโนมัติด้วย Keyword Matching เพียงอย่างเดียว'
      ],
      sampleVariation: {
        student1: 'บทอ่านสั้นเรื่อง "การอนุรักษ์ป่าชายเลนชุมชน" (140 คำ) — วิเคราะห์ใจความสำคัญและแยกข้อเท็จจริงกับข้อคิดเห็น',
        student2: 'บทอ่านสั้นเรื่อง "การจัดการขยะอาหารในโรงเรียน" (145 คำ) — วิเคราะห์ใจความสำคัญและแยกข้อเท็จจริงกับข้อคิดเห็น'
      }
    },
    {
      id: 'math',
      label: 'คณิตศาสตร์',
      shortLabel: 'คณิตศาสตร์',
      defaultStrategy: 'numerical',
      subjects: [
        { id: 'คณิตศาสตร์พื้นฐาน', label: 'คณิตศาสตร์พื้นฐาน', strategy: 'numerical' },
        { id: 'คณิตศาสตร์เพิ่มเติม', label: 'คณิตศาสตร์เพิ่มเติม', strategy: 'numerical' },
        { id: 'พีชคณิตและสมการ', label: 'พีชคณิตและสมการ', strategy: 'numerical' },
        { id: 'เรขาคณิตและการวัด', label: 'เรขาคณิตและการวัด', strategy: 'numerical' },
        {
          id: 'สถิติและความน่าจะเป็น',
          label: 'สถิติและความน่าจะเป็น',
          strategy: 'hybrid',
          sampleVariation: {
            student1: 'บริบท: ยอดขายน้ำดื่มร้านค้าสหกรณ์ 7 วัน [18, 22, 20, 24, 26, 20, 30] — คำนวณค่าเฉลี่ย/มัธยฐาน และวางแผนสั่งซื้อสัปดาห์ถัดไป',
            student2: 'บริบท: จำนวนผู้เข้าใช้ห้องสมุด 7 วัน [32, 28, 35, 30, 40, 35, 45] — คำนวณค่าเฉลี่ย/มัธยฐาน และเสนอแนวทางจัดช่วงเวลาบริการ'
          }
        },
        { id: 'แคลคูลัสเบื้องต้น', label: 'แคลคูลัสเบื้องต้น', strategy: 'numerical' }
      ],
      academicRules: [
        'กำหนดขอบเขตตัวเลขที่สุ่มด้วย Student Number Seed ให้เหมาะสมกับระดับชั้น (เช่น หลีกเลี่ยงตัวหารเป็นศูนย์ รากที่สองติดลบ หรือสมการที่ไม่มีคำตอบโดยไม่ตั้งใจ)',
        'ออกแบบให้คำตอบเป็นจำนวนเต็ม เศษส่วนอย่างต่ำ หรือทศนิยมที่ระบุความคลาดเคลื่อนที่ยอมรับได้ชัดเจน (เช่น ±0.01)',
        'แสดงสัญลักษณ์ทางคณิตศาสตร์ให้อ่านง่าย (Unicode หรือ HTML superscript/subscript ที่ไม่ต้องพึ่ง Library ภายนอกที่อาจโหลดไม่ติดแบบ Offline)',
        'คำนวณเฉลยจากฟังก์ชันเดียวกับที่สร้างโจทย์ พร้อมแสดงขั้นตอนวิธีทำทีละบรรทัดให้สัมพันธ์กับตัวเลขจริงของนักเรียนคนนั้น'
      ],
      sampleVariation: {
        student1: 'แก้สมการเชิงเส้น: 3x + 7 = 22 พร้อมตรวจสอบคำตอบ (ได้คำตอบจำนวนเต็ม x = 5)',
        student2: 'แก้สมการเชิงเส้น: 4x - 5 = 23 พร้อมตรวจสอบคำตอบ (ได้คำตอบจำนวนเต็ม x = 7)'
      }
    },
    {
      id: 'science',
      label: 'วิทยาศาสตร์และเทคโนโลยี',
      shortLabel: 'วิทยาศาสตร์ฯ',
      defaultStrategy: 'hybrid',
      subjects: [
        { id: 'ฟิสิกส์', label: 'ฟิสิกส์', strategy: 'numerical' },
        { id: 'เคมี', label: 'เคมี', strategy: 'numerical' },
        {
          id: 'ชีววิทยา',
          label: 'ชีววิทยา',
          strategy: 'case-based',
          sampleVariation: {
            student1: 'กรณีศึกษา: ระบบนิเวศสระน้ำโรงเรียนพบสาหร่ายเจริญผิดปกติหลังฝนตกหนัก — วิเคราะห์สาเหตุและผลกระทบต่อห่วงโซ่อาหาร',
            student2: 'กรณีศึกษา: สวนเกษตรในชุมชนพบแมลงศัตรูพืชระบาดหลังใช้สารเคมีต่อเนื่อง — วิเคราะห์สมดุลระบบนิเวศและแนวทางควบคุมเชิงชีวภาพ'
          }
        },
        { id: 'วิทยาศาสตร์พื้นฐาน', label: 'วิทยาศาสตร์พื้นฐาน', strategy: 'hybrid' },
        { id: 'วิทยาศาสตร์โลกและอวกาศ', label: 'วิทยาศาสตร์โลกและอวกาศ', strategy: 'case-based' },
        {
          id: 'วิทยาการคำนวณ / เทคโนโลยี',
          label: 'วิทยาการคำนวณ / เทคโนโลยี',
          strategy: 'hybrid',
          sampleVariation: {
            student1: 'ภารกิจ: ออกแบบผังงานคัดแยกพัสดุ 3 น้ำหนักเกณฑ์ [2, 5, 10 kg] และทดสอบกรณีตัวอย่าง [1.5, 6, 12 kg]',
            student2: 'ภารกิจ: ออกแบบผังงานคิดค่าบริการจอดรถ 3 ช่วงเวลา [1, 3, 6 ชม.] และทดสอบกรณีตัวอย่าง [0.5, 2.5, 7 ชม.]'
          }
        }
      ],
      academicRules: [
        'ใช้หน่วยวัดมาตรฐาน SI และสัญลักษณ์ทางวิทยาศาสตร์ให้ถูกต้องสม่ำเสมอทุกข้อ',
        'ตรวจสอบความสมเหตุสมผลทางกายภาพ/เคมี/ชีวภาพของตัวเลขที่สุ่ม (เช่น มวล เวลา อัตราเร็ว ความเข้มข้น ค่า pH 0–14 ต้องไม่ขัดต่อหลักความจริง)',
        'ต้องไม่สุ่มเปลี่ยนแปลงข้อเท็จจริงทางวิทยาศาสตร์ กฎธรรมชาติ หรือสมบัติของธาตุ/สาร',
        'อธิบายเหตุผลเชิงประจักษ์ สูตร หรือแนวคิดหลักทางวิทยาศาสตร์ในส่วนเฉลยและ Feedback'
      ],
      sampleVariation: {
        student1: 'วัตถุเคลื่อนที่จากหยุดนิ่งด้วยความเร่ง 2 m/s² เป็นเวลา 6 s จงหาระยะทาง (คำตอบ 36 m)',
        student2: 'วัตถุเคลื่อนที่ด้วยความเร็วต้น 4 m/s และความเร่ง 3 m/s² เป็นเวลา 4 s จงหาระยะทาง (คำตอบ 40 m)'
      }
    },
    {
      id: 'social',
      label: 'สังคมศึกษา ศาสนา และวัฒนธรรม',
      shortLabel: 'สังคมศึกษาฯ',
      defaultStrategy: 'case-based',
      subjects: [
        { id: 'หน้าที่พลเมือง', label: 'หน้าที่พลเมือง วัฒนธรรม และการดำเนินชีวิต', strategy: 'case-based' },
        { id: 'ประวัติศาสตร์', label: 'ประวัติศาสตร์', strategy: 'case-based' },
        { id: 'เศรษฐศาสตร์', label: 'เศรษฐศาสตร์', strategy: 'hybrid' },
        { id: 'ภูมิศาสตร์', label: 'ภูมิศาสตร์', strategy: 'hybrid' },
        { id: 'พระพุทธศาสนา / ศาสนา', label: 'พระพุทธศาสนา / ศาสนาและจริยธรรม', strategy: 'case-based' },
        { id: 'สังคมศึกษาพื้นฐาน', label: 'สังคมศึกษาพื้นฐาน', strategy: 'case-based' }
      ],
      academicRules: [
        'ห้ามสุ่ม ดัดแปลง หรือสร้างข้อมูลเท็จเกี่ยวกับปี พ.ศ./ค.ศ. เหตุการณ์ประวัติศาสตร์ หลักธรรม หรือบทบัญญัติกฎหมาย — ให้เปลี่ยนเฉพาะกรณีศึกษา สถานการณ์ประยุกต์ หรือมุมมองการวิเคราะห์',
        'รองรับคำตอบหรือแนวทางการให้เหตุผลมากกว่า 1 แนวทางหากตั้งอยู่บนหลักฐานและหลักการที่ถูกต้อง',
        'มีเกณฑ์ประเมินการให้เหตุผล (Reasoning Rubric) ที่วัดการเชื่อมโยงสาเหตุ-ผลกระทบ สิทธิ-หน้าที่ หรือหลักฐานทางสังคม',
        'หลีกเลี่ยงการตัดสินคำตอบปลายเปิดด้วยการตรวจคำตรงตัวเพียงอย่างเดียว ให้แสดงแนวคำตอบเปรียบเทียบและเกณฑ์ให้คะแนนแทน'
      ],
      sampleVariation: {
        student1: 'กรณีศึกษา: ชุมชนประสบปัญหาการจอดรถกีดขวางหน้าตลาดสด — วิเคราะห์สิทธิ หน้าที่ และเสนอแนวทางแก้ปัญหาอย่างมีส่วนร่วม',
        student2: 'กรณีศึกษา: โรงเรียนมีข้อพิพาทเรื่องการใช้งบประมาณกิจกรรมสภานักเรียน — วิเคราะห์สิทธิ หน้าที่ และเสนอแนวทางแก้ปัญหาอย่างมีส่วนร่วม'
      }
    },
    {
      id: 'health',
      label: 'สุขศึกษาและพลศึกษา',
      shortLabel: 'สุขศึกษาฯ',
      defaultStrategy: 'case-based',
      subjects: [
        { id: 'สุขศึกษา', label: 'สุขศึกษา', strategy: 'case-based' },
        { id: 'พลศึกษา', label: 'พลศึกษา', strategy: 'contextual' },
        { id: 'การสร้างเสริมสุขภาพและทักษะชีวิต', label: 'การสร้างเสริมสุขภาพและทักษะชีวิต', strategy: 'case-based' },
        { id: 'ความปลอดภัยและการปฐมพยาบาล', label: 'ความปลอดภัยและการปฐมพยาบาล', strategy: 'case-based' }
      ],
      academicRules: [
        'ออกแบบสถานการณ์ที่สมจริง เหมาะสมกับพัฒนาการของช่วงวัย และสื่อสารด้วยถ้อยคำสร้างสรรค์ ไม่ตีตราผู้เรียน',
        'ข้อมูลด้านโภชนาการ อัตราการเต้นหัวใจ หรือหลักปฐมพยาบาลต้องถูกต้องตามหลักวิชาการด้านสาธารณสุข',
        'ประเมินทักษะการคิดวิเคราะห์ การประเมินความเสี่ยง และการตัดสินใจอย่างรับผิดชอบด้วย Rubric ที่ชัดเจน',
        'แสดง Feedback เชิงบวกที่ช่วยให้นักเรียนเข้าใจผลลัพธ์ของทางเลือกแต่ละแบบ'
      ],
      sampleVariation: {
        student1: 'สถานการณ์: เพื่อนชวนลองเครื่องดื่มชูกำลังและอดนอนก่อนสอบ — ประเมินความเสี่ยงและเลือกวิธีปฏิเสธอย่างสร้างสรรค์',
        student2: 'สถานการณ์: พบโฆษณาผลิตภัณฑ์ลดน้ำหนักอ้างเห็นผลใน 3 วันบนโซเชียล — ประเมินความน่าเชื่อถือและตัดสินใจเลือกวิธีดูแลสุขภาพ'
      }
    },
    {
      id: 'art',
      label: 'ศิลปะ',
      shortLabel: 'ศิลปะ',
      defaultStrategy: 'contextual',
      subjects: [
        { id: 'ทัศนศิลป์', label: 'ทัศนศิลป์', strategy: 'contextual' },
        { id: 'ดนตรี', label: 'ดนตรี', strategy: 'contextual' },
        { id: 'นาฏศิลป์', label: 'นาฏศิลป์', strategy: 'contextual' },
        { id: 'การออกแบบและสร้างสรรค์', label: 'การออกแบบและสร้างสรรค์', strategy: 'contextual' }
      ],
      academicRules: [
        'สร้างคลังโจทย์เชิงสร้างสรรค์หรือสถานการณ์วิเคราะห์องค์ประกอบศิลป์ที่แตกต่างกันตามเลขที่นักเรียน แต่ประเมินทักษะแกนกลางเดียวกัน',
        'ใช้เกณฑ์ประเมิน (Rubric) ร่วมกันอย่างเป็นธรรม เช่น การวิเคราะห์ทัศนธาตุ ความกลมกลืน จังหวะ และการสื่อความหมาย',
        'เปิดกว้างต่อการตีความทางสุนทรียศาสตร์ที่มีเหตุผลรองรับ ไม่บังคับกรอบคำตอบตายตัวในข้อสร้างสรรค์',
        'หากมีภาพประกอบหรือแผนภาพ ให้สร้างด้วย SVG หรือ CSS ภายในโค้ดโดยไม่ต้องพึ่งลิงก์รูปภาพภายนอกที่อาจเสียได้'
      ],
      sampleVariation: {
        student1: 'โจทย์ออกแบบโปสเตอร์รณรงค์ "ประหยัดพลังงาน" โดยวิเคราะห์การใช้สีคู่ตรงข้ามและการจัดวางจุดเด่น',
        student2: 'โจทย์ออกแบบโปสเตอร์ประชาสัมพันธ์ "งานดนตรีในสวน" โดยวิเคราะห์การใช้สีโทนอุ่นและการจัดวางสมดุล'
      }
    },
    {
      id: 'career',
      label: 'การงานอาชีพ',
      shortLabel: 'การงานอาชีพ',
      defaultStrategy: 'contextual',
      subjects: [
        { id: 'การงานอาชีพพื้นฐาน', label: 'การงานอาชีพพื้นฐาน', strategy: 'contextual' },
        { id: 'การจัดการงานบ้านและทักษะชีวิต', label: 'การจัดการงานบ้านและทักษะชีวิต', strategy: 'contextual' },
        { id: 'เกษตรกรรมและการแปรรูป', label: 'เกษตรกรรมและการแปรรูป', strategy: 'hybrid' },
        { id: 'งานประดิษฐ์และออกแบบผลิตภัณฑ์', label: 'งานประดิษฐ์และออกแบบผลิตภัณฑ์', strategy: 'contextual' },
        { id: 'พื้นฐานอาชีพและผู้ประกอบการ', label: 'พื้นฐานอาชีพและผู้ประกอบการ', strategy: 'hybrid' }
      ],
      academicRules: [
        'กำหนดภารกิจหรือสถานการณ์จำลองการทำงานที่มีข้อจำกัดต่างกันตามเลขที่นักเรียน (เช่น วัสดุ งบประมาณ กลุ่มเป้าหมาย หรือเวลา)',
        'เน้นการลำดับขั้นตอนการทำงาน ความคุ้มค่า การแก้ปัญหาเฉพาะหน้า และความปลอดภัยในการปฏิบัติงาน',
        'จัดทำ Checklist ขั้นตอนการทำงานหรือ Rubric ประเมินคุณภาพการวางแผนให้ครูและนักเรียนตรวจสอบได้ชัดเจน',
        'เชื่อมโยงคำถามเข้ากับทักษะชีวิตและการประกอบอาชีพจริงในบริบทไทย'
      ],
      sampleVariation: {
        student1: 'ภารกิจ: วางแผนจัดทำอาหารว่างเพื่อสุขภาพ งบไม่เกิน 350 บาท สำหรับผู้เข้าร่วมประชุม 15 คน',
        student2: 'ภารกิจ: วางแผนออกแบบบรรจุภัณฑ์ของฝากชุมชน งบต้นทุนต่อชิ้นไม่เกิน 25 บาท สำหรับตลาดนัดโรงเรียน'
      }
    },
    {
      id: 'foreign',
      label: 'ภาษาต่างประเทศ',
      shortLabel: 'ภาษาต่างประเทศ',
      defaultStrategy: 'contextual',
      subjects: [
        { id: 'ภาษาอังกฤษพื้นฐาน', label: 'ภาษาอังกฤษพื้นฐาน', strategy: 'contextual' },
        { id: 'ภาษาอังกฤษเพื่อการสื่อสาร', label: 'ภาษาอังกฤษเพื่อการสื่อสาร', strategy: 'contextual' },
        { id: 'การอ่านและเขียนภาษาอังกฤษ', label: 'การอ่านและเขียนภาษาอังกฤษ', strategy: 'contextual' },
        { id: 'ภาษาต่างประเทศอื่น ๆ', label: 'ภาษาต่างประเทศอื่น ๆ (จีน/ญี่ปุ่น/เกาหลี ฯลฯ)', strategy: 'contextual' }
      ],
      academicRules: [
        'ควบคุมระดับคำศัพท์และโครงสร้างไวยากรณ์ (เช่น เทียบเคียงระดับ CEFR ที่สอดคล้องกับชั้นเรียน) ให้เทียบเท่ากันทุกชุดโจทย์',
        'ใช้สถานการณ์สื่อสารจริง (Authentic contexts เช่น บทสนทนา อีเมล ป้ายประกาศ สถานการณ์ท่องเที่ยว/โรงเรียน) โดยหมุนเวียนบริบทตามเลขที่นักเรียน',
        'แสดงคำชี้แจงหลักและคำอธิบาย Feedback เป็นภาษาไทยที่ชัดเจน ควบคู่กับข้อความภาษาต่างประเทศในตัวโจทย์',
        'ในข้อตรวจอัตโนมัติ (เช่น Fill in the Blank) ให้รองรับตัวพิมพ์ใหญ่-เล็กและช่องว่างส่วนเกินอย่างยืดหยุ่น'
      ],
      sampleVariation: {
        student1: 'Context: Ordering food at a school canteen — complete dialogue & identify polite request expressions',
        student2: 'Context: Asking for directions to the public library — complete dialogue & identify polite request expressions'
      }
    },
    {
      id: 'custom',
      label: 'อื่น ๆ / กำหนดเอง',
      shortLabel: 'กำหนดเอง',
      defaultStrategy: 'hybrid',
      subjects: [
        { id: '__custom__', label: 'ระบุชื่อรายวิชาเฉพาะทางเอง...', strategy: 'hybrid' }
      ],
      academicRules: [
        'วิเคราะห์ธรรมชาติของรายวิชาที่ครูกำหนดเอง แล้วจัดโครงสร้างโจทย์ให้สอดคล้องกับจุดประสงค์การเรียนรู้ที่ระบุอย่างเคร่งครัด',
        'รักษามาตรฐานความยากและขอบเขตเนื้อหาให้เหมาะสมกับระดับชั้นของผู้เรียน',
        'จัดทำเกณฑ์การตรวจหรือ Rubric ที่โปร่งใสเพื่อให้ครูตรวจสอบความถูกต้องของเนื้อหาเฉพาะทางได้ง่าย'
      ],
      sampleVariation: {
        student1: 'ภารกิจชุดที่ A: ปรับบริบทและชุดข้อมูลตามเลขที่ 1 โดยคงโครงสร้างทักษะและเกณฑ์ประเมินเดียวกัน',
        student2: 'ภารกิจชุดที่ B: ปรับบริบทและชุดข้อมูลตามเลขที่ 2 โดยคงโครงสร้างทักษะและเกณฑ์ประเมินเดียวกัน'
      }
    }
  ];

  const ASSESSMENT_TYPES = [
    {
      id: 'multiple-choice',
      label: 'Multiple Choice',
      thaiLabel: 'ปรนัยหลายตัวเลือก',
      description: 'เลือกคำตอบที่ถูกต้องพร้อมตัวลวงที่มีเหตุผลเชิงมโนทัศน์',
      supportsAutoGrade: true,
      isSubjective: false
    },
    {
      id: 'short-answer',
      label: 'Short Answer',
      thaiLabel: 'อัตนัยคำตอบสั้น',
      description: 'ตอบสั้น ๆ อธิบายเหตุผลหรือสรุปความด้วยภาษาของตนเอง',
      supportsAutoGrade: false,
      isSubjective: true
    },
    {
      id: 'fill-blank',
      label: 'Fill in the Blank',
      thaiLabel: 'เติมคำ / เติมค่า',
      description: 'เติมคำศัพท์ ตัวเลข หรือค่าสำคัญในช่องว่างให้สมบูรณ์',
      supportsAutoGrade: true,
      isSubjective: false
    },
    {
      id: 'calculation',
      label: 'Calculation',
      thaiLabel: 'คำนวณและแสดงวิธีคิด',
      description: 'แก้โจทย์คำนวณตามสูตร/ขั้นตอน พร้อมตรวจสอบหน่วยและทศนิยม',
      supportsAutoGrade: true,
      isSubjective: false
    },
    {
      id: 'scenario',
      label: 'Scenario-Based Assessment',
      thaiLabel: 'ประเมินอิงสถานการณ์',
      description: 'วิเคราะห์บทอ่านหรือสถานการณ์จำลองและตัดสินใจตอบคำถาม',
      supportsAutoGrade: false,
      isSubjective: true
    },
    {
      id: 'case-study',
      label: 'Case Study',
      thaiLabel: 'กรณีศึกษาเชิงวิเคราะห์',
      description: 'เจาะลึกกรณีศึกษา เชื่อมโยงหลักการ วิเคราะห์ผลกระทบ และเสนอทางออก',
      supportsAutoGrade: false,
      isSubjective: true
    },
    {
      id: 'interactive',
      label: 'Interactive Practice',
      thaiLabel: 'แบบฝึกหัดเชิงโต้ตอบ',
      description: 'กิจกรรมลงมือปฏิบัติ จับคู่ เรียงลำดับ หรือจำลองสถานการณ์แบบโต้ตอบ',
      supportsAutoGrade: true,
      isSubjective: false
    },
    {
      id: 'mixed',
      label: 'Mixed Assessment',
      thaiLabel: 'ประเมินผสมผสานหลายรูปแบบ',
      description: 'ผสานข้อตรวจอัตโนมัติ (ปรนัย/คำนวณ) เข้ากับข้อวิเคราะห์/สถานการณ์',
      supportsAutoGrade: true,
      isSubjective: true
    }
  ];

  const STRATEGIES = {
    numerical: {
      id: 'numerical',
      code: 'Strategy A',
      name: 'Numerical Variation',
      thaiName: 'กลยุทธ์ A — ปรับเปลี่ยนตัวเลขและพารามิเตอร์',
      shortDesc: 'เหมาะกับคณิตศาสตร์ ฟิสิกส์ เคมี — ใช้เลขที่นักเรียนเป็น Seed สุ่มชุดตัวเลขที่คำนวณซ้ำได้เหมือนเดิมทุกครั้ง',
      bestFor: ['ฟิสิกส์', 'คณิตศาสตร์', 'เคมี', 'วิชาคำนวณ'],
      principles: [
        'ใช้ฟังก์ชัน PRNG แบบกำหนดซ้ำได้ (Deterministic PRNG เช่น Mulberry32) โดยคำนวณ Seed จากเลขที่นักเรียน + ลำดับข้อ',
        'ตรวจสอบขอบเขตตัวเลขที่สุ่ม (Domain Guard) เช่น ห้ามหารด้วยศูนย์ ค่าต้องสมเหตุสมผลทางวิทยาศาสตร์ และหลีกเลี่ยงตัวเลขซับซ้อนเกินระดับชั้น',
        'คำนวณเฉลยจากพารามิเตอร์ที่สุ่มได้จริงทุกครั้ง ไม่ hardcode เฉลยตายตัว และกำหนดความคลาดเคลื่อนทศนิยมชัดเจน',
        'ตรวจสอบการกระจายค่าเพื่อลดโอกาสที่นักเรียนเลขที่ต่างกันจะได้โจทย์และคำตอบซ้ำกัน และรักษาระดับความยากให้เทียบเคียงกันทุกชุด'
      ],
      pitfalls: [
        'ห้ามใช้ Math.random() แบบไม่ระบุ Seed เพราะจะทำให้นักเรียนคนเดิมได้โจทย์เปลี่ยนไปเมื่อรีเฟรชหน้าเว็บ',
        'ห้ามปล่อยให้สูตรคำนวณสร้างค่าที่ขัดต่อความจริง (เช่น เวลาติดลบ ความเข้มข้นเกิน 100%)'
      ],
      sampleVariation: {
        student1: 'ชุดพารามิเตอร์ Seed #1: ใช้ค่าตัวแปรตั้งต้นชุด A (คำนวณคำตอบเฉพาะของเลขที่ 1 พร้อมตรวจช่วงค่าที่สมเหตุสมผล)',
        student2: 'ชุดพารามิเตอร์ Seed #2: ใช้ค่าตัวแปรตั้งต้นชุด B (โครงสร้างและระดับความยากเทียบเท่ากัน พร้อมคำนวณเฉลยใหม่ตามชุดตัวเลขนี้)'
      }
    },
    contextual: {
      id: 'contextual',
      code: 'Strategy B',
      name: 'Contextual Variation',
      thaiName: 'กลยุทธ์ B — ปรับเปลี่ยนบริบท สถานการณ์ หรือบทอ่าน',
      shortDesc: 'เหมาะกับภาษาไทย ภาษาต่างประเทศ ศิลปะ การงานอาชีพ — สลับคลังบริบทตามเลขที่โดยวัดทักษะและเกณฑ์เดียวกัน',
      bestFor: ['ภาษาไทย', 'ภาษาต่างประเทศ', 'ศิลปะ', 'การงานอาชีพ'],
      principles: [
        'จัดเตรียมคลังบทอ่าน สถานการณ์ หรือโจทย์งานสร้างสรรค์ที่มีโครงสร้าง ความยาว และระดับภาษาเทียบเท่ากัน',
        'จับคู่ชุดสถานการณ์ให้แต่ละเลขที่นักเรียนอย่างเป็นระบบจาก Student Number Seed (เช่น การจับคู่แบบหมุนเวียนสมดุลเพื่อไม่ให้เพื่อนเลขที่ติดกันได้ชุดเดียวกันทั้งชุด)',
        'ทุกชุดโจทย์ต้องวัดทักษะและจุดประสงค์การเรียนรู้เดียวกัน และใช้เกณฑ์การประเมิน (Rubric) ร่วมกัน',
        'ห้ามเปลี่ยนความยากของคำศัพท์ โครงสร้างประโยค หรือจำนวนเงื่อนไขโดยไม่มีเหตุผลทางวิชาการ'
      ],
      pitfalls: [
        'หลีกเลี่ยงการสร้างคลังสถานการณ์น้อยเกินไปจนนักเรียนเกือบทั้งห้องได้บทอ่านเดียวกัน',
        'ห้ามสร้างสถานการณ์ที่ซับซ้อนต่างกันมากจนเกิดความไม่เป็นธรรมระหว่างเลขที่'
      ],
      sampleVariation: {
        student1: 'ชุดบริบท A (จาก Seed #1): สถานการณ์หรือบทอ่านชุดที่ 1 ที่มีความยาวและระดับภาษาเทียบเท่ามาตรฐาน',
        student2: 'ชุดบริบท B (จาก Seed #2): สถานการณ์หรือบทอ่านชุดที่ 2 ที่เปลี่ยนเรื่องราวแต่ประเมินทักษะและใช้ Rubric เดียวกัน'
      }
    },
    'case-based': {
      id: 'case-based',
      code: 'Strategy C',
      name: 'Case-Based Variation',
      thaiName: 'กลยุทธ์ C — ปรับเปลี่ยนกรณีศึกษาและเงื่อนไขการวิเคราะห์',
      shortDesc: 'เหมาะกับสังคมศึกษา ประวัติศาสตร์ หน้าที่พลเมือง สุขศึกษา — เปลี่ยนกรณีศึกษาแต่คงข้อเท็จจริงและ Rubric การให้เหตุผล',
      bestFor: ['สังคมศึกษา', 'ประวัติศาสตร์', 'หน้าที่พลเมือง', 'สุขศึกษาและพลศึกษา'],
      principles: [
        'เปลี่ยนเฉพาะกรณีศึกษา สถานการณ์สมมติ หรือบริบทผู้มีส่วนได้ส่วนเสีย — ห้ามสุ่มหรือบิดเบือนข้อเท็จจริงทางประวัติศาสตร์ กฎหมาย หรือหลักสุขภาพ',
        'ควบคุมความซับซ้อนของแต่ละกรณีศึกษาให้มีจำนวนตัวแปรและประเด็นขัดแย้งใกล้เคียงกัน',
        'ระบุเกณฑ์ประเมินการให้เหตุผล (Reasoning Rubric) ที่รองรับคำตอบหลากหลายแนวทางเมื่อมีเหตุผลและหลักฐานสนับสนุน',
        'ห้ามตรวจคำตอบเชิงอัตนัยด้วยการจับคำสำคัญ (Keyword Matching) เพียงอย่างเดียว — ให้แสดงโครงสร้างแนวคำตอบเปรียบเทียบและ Rubric ให้ครู/นักเรียนใช้ประเมิน'
      ],
      pitfalls: [
        'ห้ามสุ่มเลขปี พ.ศ. ชื่อบุคคลประวัติศาสตร์ หรือข้อเท็จจริงทางกฎหมายเด็ดขาด',
        'ห้ามให้คะแนนอัตโนมัติแบบ "ถูก/ผิดตายตัว" กับคำถามปลายเปิดที่ต้องอาศัยวิจารณญาณ'
      ],
      sampleVariation: {
        student1: 'กรณีศึกษาชุดที่ 1: วิเคราะห์ประเด็นขัดแย้งและผู้มีส่วนได้ส่วนเสียในบริบทชุมชน A ภายใต้หลักวิชาการเดียวกัน',
        student2: 'กรณีศึกษาชุดที่ 2: วิเคราะห์ประเด็นขัดแย้งและผู้มีส่วนได้ส่วนเสียในบริบทโรงเรียน/องค์กร B ด้วย Rubric เดียวกัน'
      }
    },
    hybrid: {
      id: 'hybrid',
      code: 'Strategy D',
      name: 'Hybrid Variation',
      thaiName: 'กลยุทธ์ D — ผสมผสานหลายกลยุทธ์ (Hybrid Variation)',
      shortDesc: 'ผสานการเปลี่ยนตัวเลข บริบท เงื่อนไข ชุดข้อมูล และหลักฐานการวิเคราะห์ เหมาะกับวิชาบูรณาการหรือกำหนดเอง',
      bestFor: ['วิทยาศาสตร์ทั่วไป', 'วิทยาการคำนวณ', 'เศรษฐศาสตร์', 'วิชาเฉพาะทาง'],
      principles: [
        'ผสานทั้งการปรับเปลี่ยนบริบท/ชุดข้อมูล (Context/Dataset) และการสุ่มพารามิเตอร์เชิงตัวเลขหรือเงื่อนไขประกอบ (Parameters/Constraints) ด้วย Student Number Seed',
        'ออกแบบให้โจทย์แต่ละข้อแยกส่วนระหว่าง "กรอบคำถามเชิงมโนทัศน์ที่คงที่" กับ "ข้อมูล/บริบท/เงื่อนไขที่แปรผัน"',
        'ตรวจสอบความสอดคล้องระหว่างชุดข้อมูลที่สุ่มกับคำตอบหรือเกณฑ์วิเคราะห์ของกรณีนั้น ๆ',
        'รองรับการตรวจอัตโนมัติในส่วนคำตอบเชิงวัตถุวิสัยควบคู่กับการแสดง Rubric ในส่วนวิเคราะห์'
      ],
      pitfalls: [
        'ระวังความซับซ้อนเกินพอดีจนนักเรียนสับสน หรือชุดเงื่อนไขบางคู่ขัดแย้งกันเองเมื่อนำมาผสมแบบสุ่ม'
      ],
      sampleVariation: {
        student1: 'ชุดผสม A (Seed #1): เปลี่ยนบริบทโครงการ + สุ่มชุดข้อมูลตัวเลขชุดที่ 1 พร้อมตรวจคำนวณและอธิบายเหตุผลประกอบ',
        student2: 'ชุดผสม B (Seed #2): เปลี่ยนบริบทโครงการ + สุ่มชุดข้อมูลตัวเลขชุดที่ 2 โดยวัดทักษะวิเคราะห์และการตัดสินใจเดียวกัน'
      }
    }
  };

  const GRADE_LEVELS = [
    'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6',
    'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6',
    'อาชีวศึกษา (ปวช./ปวส.)',
    'อุดมศึกษา / มหาวิทยาลัย',
    'อื่น ๆ / ไม่จำกัดระดับชั้น'
  ];

  const DIFFICULTY_LEVELS = [
    { id: 'basic', label: 'พื้นฐาน (Basic)', desc: 'เน้นความเข้าใจหลักการเบื้องต้นและขั้นตอนมาตรฐาน' },
    { id: 'medium', label: 'ปานกลาง (Intermediate)', desc: 'ประยุกต์หลักการแก้โจทย์หรือวิเคราะห์สถานการณ์ทั่วไป' },
    { id: 'challenging', label: 'ท้าทาย / ประยุกต์สูง (Advanced)', desc: 'วิเคราะห์หลายขั้นตอน เชื่อมโยงเงื่อนไขซับซ้อน' },
    { id: 'progressive', label: 'ไล่ระดับง่ายไปยาก (Scaffolded)', desc: 'เริ่มจากข้อพื้นฐานแล้วค่อย ๆ เพิ่มความท้าทาย' }
  ];

  const DIFFERENTIATION_LEVELS = [
    {
      id: 'low',
      label: 'แตกต่างระดับน้อย (ตัวแปรย่อย)',
      desc: 'คงโครงสร้างประโยคและรูปแบบเดิม เปลี่ยนเฉพาะค่าตัวเลขบางตัวหรือรายละเอียดเล็กน้อย'
    },
    {
      id: 'medium',
      label: 'แตกต่างระดับกลาง (สมดุลและเทียบเท่า)',
      desc: 'เปลี่ยนชุดตัวเลข/บริบท/เงื่อนไขหลักอย่างชัดเจน โดยรักษาระดับความยากและโครงสร้างทักษะเท่าเดิม'
    },
    {
      id: 'high',
      label: 'แตกต่างระดับสูง (หลากหลายบริบทและมุมมอง)',
      desc: 'สลับทั้งกรณีศึกษา ชุดข้อมูล และมุมคำถามที่หลากหลายภายใต้มาตรฐานตัวชี้วัดเดียวกัน'
    }
  ];

  const PRESETS = [
    {
      id: 'preset-physics',
      badge: 'Preset 1 • ฟิสิกส์ ม.4',
      title: 'ฟิสิกส์: การเคลื่อนที่แนวตรง',
      subtitle: 'Calculation • Strategy A (Numerical)',
      state: {
        subjectGroup: 'science',
        subject: 'ฟิสิกส์',
        customSubject: '',
        grade: 'ม.4',
        topic: 'การเคลื่อนที่แนวตรง (ความเร็ว ความเร่ง และสมการการเคลื่อนที่)',
        objectives: 'นักเรียนสามารถวิเคราะห์ตัวแปรการเคลื่อนที่แนวตรงด้วยความเร่งคงตัว และคำนวณหาระยะทาง ความเร็ว หรือเวลาได้อย่างถูกต้องพร้อมหน่วย SI',
        difficulty: 'medium',
        questionCount: 5,
        durationMinutes: 30,
        assessmentType: 'calculation',
        useStudentSeed: true,
        classSize: 40,
        strategyMode: 'numerical',
        differentiationLevel: 'medium',
        enableFeedback: true,
        showAnswers: true,
        appMode: 'practice',
        outputStructure: 'single-file',
        teacherNotes: 'กำหนดให้สุ่มความเร็วต้น ความเร่ง และเวลาเป็นตัวเลขที่คำนวณได้ลงตัวหรือทศนิยมไม่เกิน 2 ตำแหน่ง พร้อมเฉลยแสดงการแทนค่าสูตรทีละขั้น'
      }
    },
    {
      id: 'preset-thai',
      badge: 'Preset 2 • ภาษาไทย ม.2',
      title: 'ภาษาไทย: การอ่านจับใจความ',
      subtitle: 'Scenario-Based • Strategy B (Contextual)',
      state: {
        subjectGroup: 'thai',
        subject: 'ภาษาไทย',
        customSubject: '',
        grade: 'ม.2',
        topic: 'การอ่านจับใจความสำคัญและการแยกข้อเท็จจริงกับข้อคิดเห็น',
        objectives: 'นักเรียนสามารถอ่านบทความสั้นแล้วสรุปใจความสำคัญ ระบุจุดประสงค์ของผู้เขียน และจำแนกข้อเท็จจริงออกจากข้อคิดเห็นได้อย่างมีเหตุผล',
        difficulty: 'medium',
        questionCount: 4,
        durationMinutes: 35,
        assessmentType: 'scenario',
        useStudentSeed: true,
        classSize: 40,
        strategyMode: 'contextual',
        differentiationLevel: 'medium',
        enableFeedback: true,
        showAnswers: true,
        appMode: 'practice',
        outputStructure: 'single-file',
        teacherNotes: 'จัดทำคลังบทอ่านสั้นอย่างน้อย 8–10 เรื่องที่มีความยาวและระดับภาษาใกล้เคียงกัน หมุนเวียนตามเลขที่นักเรียน พร้อม Rubric ประเมินการสรุปใจความ'
      }
    },
    {
      id: 'preset-social',
      badge: 'Preset 3 • สังคมศึกษาฯ ม.3',
      title: 'สังคมศึกษาฯ: หน้าที่พลเมือง',
      subtitle: 'Case Study • Strategy C (Case-Based)',
      state: {
        subjectGroup: 'social',
        subject: 'หน้าที่พลเมือง',
        customSubject: '',
        grade: 'ม.3',
        topic: 'สิทธิ เสรีภาพ หน้าที่พลเมือง และการมีส่วนร่วมแก้ปัญหาชุมชนตามหลักประชาธิปไตย',
        objectives: 'นักเรียนสามารถวิเคราะห์กรณีศึกษาด้านสิทธิและหน้าที่พลเมือง ชั่งน้ำหนักผลกระทบต่อส่วนรวม และเสนอแนวทางแก้ปัญหาโดยอ้างอิงหลักการประชาธิปไตยได้',
        difficulty: 'challenging',
        questionCount: 3,
        durationMinutes: 40,
        assessmentType: 'case-study',
        useStudentSeed: true,
        classSize: 40,
        strategyMode: 'case-based',
        differentiationLevel: 'high',
        enableFeedback: true,
        showAnswers: false,
        appMode: 'assessment',
        outputStructure: 'multi-file',
        teacherNotes: 'ห้ามตัดสินคำตอบอัตนัยด้วย Keyword Matching เพียงอย่างเดียว ให้ออกแบบฟอร์มตอบเป็นขั้นตอน (ระบุปัญหา-ผู้เกี่ยวข้อง-หลักการ-ทางออก) และแสดง Rubric 4 ระดับสำหรับครู'
      }
    },
    {
      id: 'preset-health',
      badge: 'Preset 4 • สุขศึกษาฯ ม.2',
      title: 'สุขศึกษาฯ: การตัดสินใจด้านสุขภาพ',
      subtitle: 'Scenario-Based • Strategy C (Case-Based)',
      state: {
        subjectGroup: 'health',
        subject: 'สุขศึกษา',
        customSubject: '',
        grade: 'ม.2',
        topic: 'การตัดสินใจเกี่ยวกับสุขภาพ การปฏิเสธพฤติกรรมเสี่ยง และการรู้เท่าทันสื่อโฆษณา',
        objectives: 'นักเรียนสามารถประเมินความเสี่ยงจากสถานการณ์จำลองด้านสุขภาพ เลือกแนวทางปฏิบัติที่ปลอดภัยเหมาะสมกับวัย และอธิบายเหตุผลสนับสนุนการตัดสินใจได้',
        difficulty: 'medium',
        questionCount: 4,
        durationMinutes: 25,
        assessmentType: 'scenario',
        useStudentSeed: true,
        classSize: 40,
        strategyMode: 'case-based',
        differentiationLevel: 'medium',
        enableFeedback: true,
        showAnswers: true,
        appMode: 'practice',
        outputStructure: 'single-file',
        teacherNotes: 'ใช้สถานการณ์ที่ใกล้ตัววัยรุ่น (เช่น แรงกดดันจากเพื่อน โฆษณาอาหารเสริมเกินจริง หรือการพักผ่อนไม่เพียงพอ) และให้ Feedback เชิงสร้างสรรค์ไม่ตีตราผู้เรียน'
      }
    },
    {
      id: 'preset-hybrid',
      badge: 'Preset 5 • คณิตศาสตร์ประยุกต์ ม.3',
      title: 'คณิตฯ: สถิติและวางแผนงบประมาณ',
      subtitle: 'Mixed Assessment • Strategy D (Hybrid)',
      state: {
        subjectGroup: 'math',
        subject: 'สถิติและความน่าจะเป็น',
        customSubject: '',
        grade: 'ม.3',
        topic: 'การวิเคราะห์ค่ากลางของข้อมูลและการวางแผนงบประมาณกิจกรรมนักเรียน',
        objectives: 'นักเรียนสามารถคำนวณค่าเฉลี่ยเลขคณิต มัธยฐาน ฐานนิยม จากชุดข้อมูลสถานการณ์ และใช้ผลการวิเคราะห์ตัดสินใจจัดสรรงบประมาณอย่างสมเหตุสมผล',
        difficulty: 'progressive',
        questionCount: 5,
        durationMinutes: 40,
        assessmentType: 'mixed',
        useStudentSeed: true,
        classSize: 40,
        strategyMode: 'hybrid',
        differentiationLevel: 'high',
        enableFeedback: true,
        showAnswers: true,
        appMode: 'practice',
        outputStructure: 'multi-file',
        teacherNotes: 'ผสมผสานการเปลี่ยนบริบทกิจกรรมโรงเรียน (เช่น กีฬาสี, ค่ายอาสา, ร้านค้าสหกรณ์) กับชุดตัวเลขข้อมูลที่สุ่มด้วยเลขที่นักเรียน'
      }
    }
  ];

  function getGroupById(groupId) {
    return SUBJECT_GROUPS.find((g) => g.id === groupId) || SUBJECT_GROUPS[SUBJECT_GROUPS.length - 1];
  }

  function getAssessmentTypeById(typeId) {
    return ASSESSMENT_TYPES.find((t) => t.id === typeId) || ASSESSMENT_TYPES[0];
  }

  function getDifficultyById(diffId) {
    return DIFFICULTY_LEVELS.find((d) => d.id === diffId) || DIFFICULTY_LEVELS[1];
  }

  function getDifferentiationById(levelId) {
    return DIFFERENTIATION_LEVELS.find((d) => d.id === levelId) || DIFFERENTIATION_LEVELS[1];
  }

  function recommendStrategyId(subjectGroupId, subjectName, assessmentTypeId) {
    const group = getGroupById(subjectGroupId);
    let recommended = group.defaultStrategy || 'hybrid';

    const matchedSubject = group.subjects.find(
      (s) => s.id === subjectName || s.label === subjectName
    );
    if (matchedSubject && matchedSubject.strategy) {
      recommended = matchedSubject.strategy;
    }

    // Refine based on assessment type when relevant
    if (assessmentTypeId === 'calculation' && recommended !== 'numerical') {
      recommended = recommended === 'case-based' || recommended === 'contextual' ? 'hybrid' : 'numerical';
    } else if (assessmentTypeId === 'case-study' && recommended === 'numerical') {
      recommended = 'hybrid';
    } else if (assessmentTypeId === 'mixed' && recommended !== 'hybrid') {
      recommended = 'hybrid';
    }

    return recommended;
  }

  TPS.strategies = {
    SUBJECT_GROUPS,
    ASSESSMENT_TYPES,
    STRATEGIES,
    GRADE_LEVELS,
    DIFFICULTY_LEVELS,
    DIFFERENTIATION_LEVELS,
    PRESETS,
    getGroupById,
    getAssessmentTypeById,
    getDifficultyById,
    getDifferentiationById,
    recommendStrategyId
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TPS.strategies;
  }
})(typeof window !== 'undefined' ? window : globalThis);
