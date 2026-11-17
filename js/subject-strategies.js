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
      thaiLabel: 'ผสมผสานหลายรูปแบบ',
      description: 'ผสานข้อตรวจอัตโนมัติเข้ากับข้อวิเคราะห์หรือสถานการณ์',
      supportsAutoGrade: true,
      isSubjective: true
    },
    {
      id: 'custom',
      label: 'Custom Activity',
      thaiLabel: 'กำหนดรูปแบบเอง',
      description: 'ระบุลักษณะกิจกรรมหรือรูปแบบแบบฝึกหัดตามที่ครูออกแบบ',
      supportsAutoGrade: false,
      isSubjective: true
    }
  ];

  const STRATEGIES = {
    numerical: {
      id: 'numerical',
      code: 'Strategy A',
      name: 'Numerical Variation',
      thaiName: 'กลยุทธ์ A — ปรับเปลี่ยนตัวเลขและพารามิเตอร์',
      shortDesc: 'เหมาะกับวิชาคำนวณ — สุ่มชุดตัวเลขใหม่ตามเลขที่ โดยความยากเท่าเดิม',
      bestFor: ['ฟิสิกส์', 'คณิตศาสตร์', 'เคมี', 'วิชาคำนวณ'],
      principles: [
        'ใช้ฟังก์ชันสุ่มแบบกำหนดซ้ำได้ (Deterministic PRNG เช่น Mulberry32) จาก Seed เลขที่นักเรียน + ข้อที่',
        'ตรวจขอบเขตตัวเลข (เช่น ห้ามหารด้วยศูนย์ และค่าต้องสมเหตุสมผล)',
        'คำนวณเฉลยจากตัวเลขที่สุ่มจริง พร้อมระบุทศนิยมหรือค่าคลาดเคลื่อนที่ยอมรับได้',
        'กระจายค่าเพื่อลดโอกาสโจทย์ซ้ำ และคุมระดับความยากให้เทียบเคียงกัน'
      ],
      pitfalls: [
        'ห้ามใช้ Math.random() แบบไม่ระบุ Seed เพราะรีเฟรชแล้วโจทย์จะเปลี่ยน',
        'ห้ามสุ่มค่าที่ขัดต่อความจริงทางวิทยาศาสตร์หรือคณิตศาสตร์'
      ],
      sampleVariation: {
        student1: 'เลขที่ 1: สุ่มชุดตัวเลข A แล้วคำนวณคำตอบเฉพาะของชุด A',
        student2: 'เลขที่ 2: สุ่มชุดตัวเลข B ที่ความยากเท่ากัน พร้อมคำนวณเฉลยใหม่ตามชุด B'
      }
    },
    contextual: {
      id: 'contextual',
      code: 'Strategy B',
      name: 'Contextual Variation',
      thaiName: 'กลยุทธ์ B — ปรับเปลี่ยนบริบท สถานการณ์ หรือบทอ่าน',
      shortDesc: 'เหมาะกับภาษา ศิลปะ การงาน — สลับบทอ่านหรือสถานการณ์ตามเลขที่ โดยใช้เกณฑ์วัดเดียวกัน',
      bestFor: ['ภาษาไทย', 'ภาษาต่างประเทศ', 'ศิลปะ', 'การงานอาชีพ'],
      principles: [
        'เตรียมคลังบทอ่านหรือสถานการณ์ที่มีความยาวและระดับภาษาใกล้เคียงกัน',
        'จับคู่สถานการณ์ตาม Seed เลขที่นักเรียนอย่างสมดุล ไม่ให้เพื่อนเลขที่ติดกันซ้ำทั้งชุด',
        'วัดทักษะเดียวกันและใช้เกณฑ์ให้คะแนน (Rubric) ร่วมกัน',
        'ไม่เปลี่ยนความยากของคำศัพท์หรือเงื่อนไขโดยไม่มีเหตุผล'
      ],
      pitfalls: [
        'อย่าใช้คลังสถานการณ์น้อยเกินไปจนเด็กได้โจทย์เหมือนกันเกือบทั้งห้อง',
        'อย่าให้ความยากของแต่ละเรื่องต่างกันมากจนเสียความเป็นธรรม'
      ],
      sampleVariation: {
        student1: 'เลขที่ 1: ได้บทอ่าน/สถานการณ์ชุด A ในระดับความยากมาตรฐาน',
        student2: 'เลขที่ 2: ได้บทอ่าน/สถานการณ์ชุด B ที่เปลี่ยนเรื่องแต่ประเมินทักษะเดียวกัน'
      }
    },
    'case-based': {
      id: 'case-based',
      code: 'Strategy C',
      name: 'Case-Based Variation',
      thaiName: 'กลยุทธ์ C — ปรับเปลี่ยนกรณีศึกษาและเหตุผลวิเคราะห์',
      shortDesc: 'เหมาะกับสังคมฯ ประวัติศาสตร์ สุขศึกษา — เปลี่ยนกรณีศึกษาแต่คงข้อเท็จจริงและ Rubric',
      bestFor: ['สังคมศึกษา', 'ประวัติศาสตร์', 'หน้าที่พลเมือง', 'สุขศึกษาและพลศึกษา'],
      principles: [
        'เปลี่ยนเฉพาะกรณีศึกษาสมมติ — ห้ามสุ่มเปลี่ยนปี พ.ศ. เหตุการณ์ประวัติศาสตร์ กฎหมาย หรือหลักสุขภาพ',
        'คุมความซับซ้อนของแต่ละกรณีศึกษาให้ใกล้เคียงกัน',
        'มี Rubric ประเมินเหตุผลที่รองรับหลายมุมมองเมื่ออ้างอิงหลักการถูกต้อง',
        'ห้ามตรวจข้อเขียนอัตนัยด้วย Keyword Matching อย่างเดียว'
      ],
      pitfalls: [
        'ห้ามสุ่มบิดเบือนข้อเท็จจริงทางประวัติศาสตร์หรือกฎหมาย',
        'ห้ามตัดเกรดคำถามปลายเปิดแบบถูก/ผิดตายตัว'
      ],
      sampleVariation: {
        student1: 'เลขที่ 1: วิเคราะห์กรณีศึกษาบริบทชุมชน A ด้วยหลักการและ Rubric เดียวกัน',
        student2: 'เลขที่ 2: วิเคราะห์กรณีศึกษาบริบทโรงเรียน B ด้วยหลักการและ Rubric เดียวกัน'
      }
    },
    hybrid: {
      id: 'hybrid',
      code: 'Strategy D',
      name: 'Hybrid Variation',
      thaiName: 'กลยุทธ์ D — ผสมผสานหลายกลยุทธ์',
      shortDesc: 'เหมาะกับวิชาบูรณาการหรือกำหนดเอง — เปลี่ยนทั้งบริบท ข้อมูล และตัวเลขพร้อมกัน',
      bestFor: ['วิทยาศาสตร์ทั่วไป', 'วิทยาการคำนวณ', 'เศรษฐศาสตร์', 'วิชาเฉพาะทาง'],
      principles: [
        'ผสานการเปลี่ยนบริบท/ชุดข้อมูลกับการสุ่มตัวเลขด้วย Seed เลขที่นักเรียน',
        'แยกกรอบคำถามหลักที่คงที่ออกจากข้อมูลหรือเงื่อนไขที่แปรผัน',
        'ตรวจความสอดคล้องของชุดข้อมูลกับคำตอบหรือเกณฑ์วิเคราะห์ทุกชุด',
        'ตรวจอัตโนมัติในส่วนคำตอบชัดเจน และแสดง Rubric ในส่วนวิเคราะห์'
      ],
      pitfalls: [
        'ระวังเงื่อนไขที่นำมาผสมกันขัดแย้งเองเมื่อสุ่มรวมกัน'
      ],
      sampleVariation: {
        student1: 'เลขที่ 1: เปลี่ยนบริบทโครงการ + สุ่มชุดตัวเลขชุด A',
        student2: 'เลขที่ 2: เปลี่ยนบริบทโครงการ + สุ่มชุดตัวเลขชุด B วัดทักษะเดียวกัน'
      }
    }
  };

  const GRADE_LEVELS = [
    { id: 'ป.1', label: 'ป.1' },
    { id: 'ป.2', label: 'ป.2' },
    { id: 'ป.3', label: 'ป.3' },
    { id: 'ป.4', label: 'ป.4' },
    { id: 'ป.5', label: 'ป.5' },
    { id: 'ป.6', label: 'ป.6' },
    { id: 'ม.1', label: 'ม.1' },
    { id: 'ม.2', label: 'ม.2' },
    { id: 'ม.3', label: 'ม.3' },
    { id: 'ม.4', label: 'ม.4' },
    { id: 'ม.5', label: 'ม.5' },
    { id: 'ม.6', label: 'ม.6' },
    { id: 'อาชีวศึกษา (ปวช./ปวส.)', label: 'อาชีวศึกษา (ปวช./ปวส.)' },
    { id: 'อุดมศึกษา / มหาวิทยาลัย', label: 'อุดมศึกษา / มหาวิทยาลัย' },
    { id: '__custom__', label: 'อื่น ๆ / กำหนดเอง...' }
  ];

  const DIFFICULTY_LEVELS = [
    { id: 'basic', label: 'พื้นฐาน', desc: 'เน้นความเข้าใจหลักการเบื้องต้น' },
    { id: 'medium', label: 'ปานกลาง', desc: 'ประยุกต์แก้โจทย์หรือสถานการณ์ทั่วไป' },
    { id: 'challenging', label: 'ท้าทาย / ประยุกต์', desc: 'วิเคราะห์หลายขั้นตอน เชื่อมโยงซับซ้อน' },
    { id: 'progressive', label: 'ไล่ระดับง่ายไปยาก', desc: 'เริ่มจากง่ายแล้วค่อยเพิ่มความท้าทาย' }
  ];

  const DIFFERENTIATION_LEVELS = [
    {
      id: 'low',
      label: 'น้อย (เปลี่ยนตัวเลขย่อย)',
      desc: 'คงโครงสร้างเดิม เปลี่ยนเฉพาะค่าตัวเลขหรือรายละเอียดย่อย'
    },
    {
      id: 'medium',
      label: 'กลาง (สมดุล เทียบเท่ากัน)',
      desc: 'เปลี่ยนชุดตัวเลขหรือบริบทหลัก โดยคุมความยากให้เท่าเดิม'
    },
    {
      id: 'high',
      label: 'สูง (หลากหลายบริบท)',
      desc: 'สลับทั้งกรณีศึกษา ชุดข้อมูล และมุมคำถามภายใต้จุดประสงค์เดียวกัน'
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
        outputStructure: 'single-file',
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
        outputStructure: 'single-file',
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
