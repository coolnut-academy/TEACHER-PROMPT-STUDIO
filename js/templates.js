/**
 * Teacher Prompt Studio — Rule-Based Prompt Templates
 *
 * Pure modular section builders that compose the 10-part instruction prompt
 * for external AI assistants and coding agents. Contains zero AI API calls.
 */
(function (root) {
  'use strict';

  const TPS = (root.TPS = root.TPS || {});

  function formatBulletList(items, indent) {
    const prefix = indent || '- ';
    return items
      .filter((item) => Boolean(item && String(item).trim()))
      .map((item) => `${prefix}${item}`)
      .join('\n');
  }

  function buildRoleSection(ctx) {
    return [
      '## 1. บทบาทของ AI (AI Role & Engineering Mindset)',
      `คุณคือ Senior Educational Web Application Developer และ Instructional Designer ที่เชี่ยวชาญการพัฒนาเว็บแอปพลิเคชันเพื่อการศึกษาภาษาไทยสำหรับระดับ "${ctx.grade}"`,
      `ภารกิจของคุณคือ **สร้างโค้ดเว็บแอปพลิเคชัน "${ctx.activityType.thaiLabel}" เรื่อง "${ctx.topic}" รายวิชา "${ctx.effectiveSubject}" ที่เปิดใช้งานได้จริงทันที**`,
      '- ห้ามตอบเป็นเพียงรายการโจทย์ 1–N ข้อ หรือเขียนอธิบายแนวคิดอย่างเดียว',
      '- ต้องเขียนโค้ดที่ทำงานได้ครบทุกฟังก์ชัน ไม่มีปุ่มจำลอง ไม่มีข้อมูลตัวอย่างค้างไว้แบบใช้งานไม่ได้ และไม่มีส่วนที่ต้องใช้ Backend หรือ AI API ภายนอก'
    ].join('\n');
  }

  function buildTeachingContextSection(ctx) {
    const seedLabel = ctx.useStudentSeed
      ? `เปิดใช้งาน (ใช้เลขที่นักเรียน 1–${ctx.classSize} เป็น Seed กำหนดชุดโจทย์)`
      : 'ปิดใช้งาน (นักเรียนทุกคนทำชุดกิจกรรมมาตรฐานเดียวกัน แต่จัดลำดับและFeedback ชัดเจน)';

    return [
      '## 2. บริบทการสอน (Teaching Context)',
      `- กลุ่มสาระการเรียนรู้: ${ctx.group.label}`,
      `- รายวิชา: ${ctx.effectiveSubject}`,
      `- ระดับชั้น: ${ctx.grade}`,
      `- หัวข้อ/เนื้อหาที่สอน: ${ctx.topic}`,
      `- ระดับความยาก: ${ctx.difficulty.label} — ${ctx.difficulty.desc}`,
      `- จำนวนข้อ/ภารกิจต่อคน: ${ctx.questionCount} ข้อ/ภารกิจ`,
      `- เวลาที่แนะนำในการทำกิจกรรม: ${ctx.durationMinutes} นาที`,
      `- จำนวนนักเรียนในห้อง (ขอบเขตการทดสอบความซ้ำ): ${ctx.classSize} คน (เลขที่ 1 ถึง ${ctx.classSize})`,
      `- โหมดการใช้งาน: ${ctx.appModeLabel}`,
      `- ระบบกำหนดโจทย์รายบุคคล: ${seedLabel}`
    ].join('\n');
  }

  function buildObjectivesSection(ctx) {
    return [
      '## 3. จุดประสงค์การเรียนรู้ (Learning Objectives)',
      'เว็บแอปและข้อคำถามทุกข้อต้องออกแบบให้วัดผลสอดคล้องกับจุดประสงค์การเรียนรู้ต่อไปนี้โดยตรง:',
      `> ${ctx.objectives}`,
      '',
      '- ทุกข้อคำถาม/ภารกิจต้องระบุหรือเชื่อมโยงได้ว่ากำลังวัดทักษะย่อยใดในจุดประสงค์นี้',
      '- คำอธิบาย Feedback และเฉลยต้องช่วยให้นักเรียนเข้าใจมโนทัศน์ตามจุดประสงค์ ไม่ใช่แค่บอก "ถูก" หรือ "ผิด"'
    ].join('\n');
  }

  function buildAcademicSpecsSection(ctx) {
    const groupRules = ctx.group.academicRules || [];
    const extraNotes = ctx.teacherNotes
      ? `\n### เงื่อนไขเพิ่มเติมจากครูผู้สอน (ต้องปฏิบัติตามอย่างเคร่งครัด)\n${ctx.teacherNotes}`
      : '';

    return [
      '## 4. ข้อกำหนดด้านวิชาการ (Academic & Pedagogical Specifications)',
      formatBulletList(groupRules),
      `- ระดับภาษาและคำศัพท์ต้องเหมาะกับนักเรียนชั้น ${ctx.grade}`,
      `- ปริมาณเนื้อหาต้องเหมาะสมกับกรอบเวลา ${ctx.durationMinutes} นาที สำหรับจำนวน ${ctx.questionCount} ข้อ/ภารกิจ${extraNotes}`
    ].join('\n');
  }

  function buildQuestionFormatSection(ctx) {
    const formatGuidelines = {
      'multiple-choice': [
        'สร้างตัวเลือก 4 ตัวเลือกต่อข้อ (ก, ข, ค, ง) โดยให้ตัวลวงสะท้อนความเข้าใจคลาดเคลื่อนที่พบบ่อยจริงในเรื่องนี้',
        'หลีกเลี่ยงตัวเลือกประเภท "ถูกทุกข้อ/ผิดทุกข้อ" ที่ไม่วัดความเข้าใจ และสุ่มลำดับตัวเลือกอย่างกำหนดซ้ำได้เมื่อใช้เลขที่นักเรียน'
      ],
      'short-answer': [
        'ออกแบบช่องคำตอบที่รองรับการพิมพ์อธิบายสั้น ๆ พร้อมคำชี้นำขอบเขตคำตอบ (เช่น ความยาวแนะนำหรือประเด็นที่ควรตอบ)',
        'จัดเตรียมแนวคำตอบสำคัญ (Key Points) และ Rubric ประเมินผลให้ครูและนักเรียนใช้เทียบคำตอบ'
      ],
      'fill-blank': [
        'ออกแบบช่องเติมคำ/เติมค่าที่ชัดเจน พร้อมระบุหน่วยหรือรูปแบบคำตอบที่ต้องการ (เช่น ทศนิยม 2 ตำแหน่ง)',
        'ระบบตรวจต้องตัดช่องว่างหน้า-หลัง (Trim) และจัดการตัวพิมพ์เล็ก-ใหญ่หรือรูปแบบเทียบเท่าอย่างเหมาะสม'
      ],
      'calculation': [
        'แสดงโจทย์ปัญหาชัดเจน แยกข้อมูลที่โจทย์กำหนด สิ่งที่ต้องหา และช่องกรอกคำตอบพร้อมหน่วยวัด',
        'คำนวณเฉลยจากพารามิเตอร์จริงของข้อนั้น แสดงสูตรที่ใช้ การแทนค่า และวิธีทำทีละขั้นตอนในส่วนเฉลย/Feedback'
      ],
      'scenario': [
        'นำเสนอสถานการณ์จำลองหรือบทอ่านสั้นที่มีบริบทสมจริงและชัดเจน ก่อนเข้าสู่คำถามประเมินความเข้าใจและการตัดสินใจ',
        'หากมีทั้งข้อเลือกตอบเชิงเหตุผลและข้อเขียนอธิบาย ให้แยกส่วนตรวจอัตโนมัติออกจากส่วนประเมินด้วย Rubric อย่างชัดเจน'
      ],
      'case-study': [
        'นำเสนอกรณีศึกษาที่มีข้อมูลเพียงพอต่อการวิเคราะห์ (บริบท ปัญหา ผู้เกี่ยวข้อง ข้อจำกัด/หลักฐาน)',
        'แบ่งคำตอบเป็นขั้นตอนเชิงวิเคราะห์ (เช่น 1. ระบุประเด็น/สาเหตุ 2. เชื่อมโยงหลักการ 3. เสนอแนวทางและเหตุผล) พร้อม Rubric 3–4 ระดับ'
      ],
      'interactive': [
        'ออกแบบกิจกรรมเชิงโต้ตอบที่ทำได้จริงในเบราว์เซอร์ (เช่น จำแนกหมวดหมู่ เรียงลำดับขั้นตอน จับคู่ ปรับตัวแปรทดลอง หรือเลือกการตัดสินใจแบบมีผลลัพธ์)',
        'รองรับการใช้งานทั้งเมาส์/สัมผัสหน้าจอ และคีย์บอร์ด (Accessibility) เพื่อไม่ให้พึ่งพา Drag-and-Drop เพียงอย่างเดียว'
      ],
      'mixed': [
        `จัดสัดส่วน ${ctx.questionCount} ข้อ/ภารกิจให้ผสมผสานอย่างสมดุลระหว่างข้อตรวจอัตโนมัติ (เช่น ปรนัย/คำนวณ/เติมคำ) กับข้อวิเคราะห์อิงสถานการณ์หรืออัตนัย`,
        'ระบุชัดเจนว่าส่วนใดตรวจคะแนนอัตโนมัติได้ทันที และส่วนใดประเมินด้วยแนวคำตอบ/Rubric สำหรับครู'
      ]
    };

    const specificRules = formatGuidelines[ctx.activityType.id] || formatGuidelines['mixed'];

    return [
      '## 5. รูปแบบโจทย์และการโต้ตอบ (Question Format & Interaction Blueprint)',
      `- รูปแบบหลัก: **${ctx.activityType.label} (${ctx.activityType.thaiLabel})**`,
      `- ลักษณะกิจกรรม: ${ctx.activityType.description}`,
      formatBulletList(specificRules),
      '- แสดงตัวเลขข้อปัจจุบัน ความคืบหน้า (Progress Bar) และสถานะการตอบครบ/ยังไม่ครบอย่างชัดเจน'
    ].join('\n');
  }

  function buildPersonalizedStrategySection(ctx) {
    const strategy = ctx.strategy;

    if (!ctx.useStudentSeed) {
      return [
        '## 6. กลยุทธ์สร้างโจทย์เฉพาะบุคคล (Personalized Assessment Engine)',
        '- สถานะ Seed ตามเลขที่นักเรียน: **ปิดใช้งาน** (ครูเลือกให้ใช้ชุดกิจกรรมมาตรฐานเดียวกันทั้งห้อง)',
        '- ให้สร้างหน้ากรอกเลขที่หรือชื่อเล่นเฉพาะเพื่อใช้แสดงบนหน้าจอสรุปผลของนักเรียน (ไม่ส่งข้อมูลออกนอกเครื่อง)',
        '- ออกแบบให้ยังแสดงลำดับข้อ คำแนะนำเฉพาะจุดเมื่อนักเรียนตอบผิด (Targeted Hint/Feedback) และมีโหมดครูสำหรับดูเฉลยและ Rubric ทั้งชุดได้สะดวก'
      ].join('\n');
    }

    const diffDesc = ctx.differentiation.desc;
    const extraEngineRules = [
      `ต้องรับค่า "เลขที่นักเรียน (Student Number)" เป็นจำนวนเต็มระหว่าง 1 ถึง ${ctx.classSize} (พร้อมตรวจสอบกรณีกรอกนอกช่วงหรือเว้นว่าง)`,
      'ใช้ Deterministic PRNG (เช่น Mulberry32 หรือ Linear Congruential Generator) ที่รับ Seed จากเลขที่นักเรียน + หมายเลขข้อ — **ห้ามใช้ `Math.random()` แบบไม่ระบุ Seed** เพื่อให้เลขที่เดิมเปิดใหม่กี่ครั้งก็ยังได้ชุดโจทย์เดิมเสมอ',
      `ระดับความแตกต่างที่ต้องการ: **${ctx.differentiation.label}** (${diffDesc})`
    ];

    if (strategy.id === 'contextual' || strategy.id === 'case-based') {
      extraEngineRules.push(
        `ออกแบบคลังบริบท/กรณีศึกษาให้เพียงพอต่อการหมุนเวียนและจัดชุด ${ctx.questionCount} ข้อสำหรับนักเรียน ${ctx.classSize} คน โดยใช้การเลือกแบบสมดุลจาก Seed (Balanced / Stratified Selection) เพื่อไม่ให้แต่ละข้อภายในชุดของคนเดียวกันซ้ำเรื่องเดิม`
      );
    }

    return [
      '## 6. กลยุทธ์สร้างโจทย์เฉพาะบุคคล (Personalized Assessment Engine)',
      `- กลยุทธ์หลักที่เลือกใช้: **${strategy.code}: ${strategy.name}** (${strategy.thaiName})`,
      `- เหตุผลความเหมาะสม: ${strategy.shortDesc}`,
      '',
      '### กติกาการออกแบบกลยุทธ์นี้',
      formatBulletList(extraEngineRules),
      formatBulletList(strategy.principles),
      '',
      '### ข้อควรระวังที่ห้ามทำผิดพลาด',
      formatBulletList(strategy.pitfalls),
      '',
      '### การตรวจสอบความถูกต้องและความซ้ำของโจทย์ (Mandatory Validation & Guardrails)',
      `- ต้องเขียนฟังก์ชันตรวจสอบภายใน (เช่นในโหมดครู) เพื่อสุ่มตรวจชุดโจทย์ของนักเรียนทั้งห้องตั้งแต่เลขที่ 1 ถึง ${ctx.classSize}:`,
      '  1. **ตรวจสอบความซ้ำ (Collision Audit)**: คำนวณอัตราการซ้ำของโจทย์/ชุดบริบทในช่วงเลขที่ 1–' + ctx.classSize + ' และแสดงผลให้ครูเห็นตามจริง',
      '  2. **ตรวจสอบความถูกต้องของเฉลย (Answer Integrity)**: ยืนยันว่าคำตอบเฉลยคำนวณสอดคล้องกับพารามิเตอร์/บริบทที่สุ่มได้จริงทุกข้อ ไม่มีค่า NaN, Infinity หรือคำตอบหลุดขอบเขต',
      '  3. **ตรวจสอบระดับความยากที่เทียบเคียงกัน (Difficulty Equivalence)**: ทุกเลขที่ต้องแก้โจทย์ด้วยจำนวนขั้นตอนและระดับความซับซ้อนเทียบเท่ากัน',
      '  4. **คำเตือนด้านข้อจำกัดจำนวนชุดโจทย์**: หากพื้นที่ตัวแปรหรือคลังสถานการณ์มีจำนวนรูปแบบที่เป็นไปได้น้อยกว่าจำนวนนักเรียนในห้อง ระบบต้องแจ้งข้อจำกัดให้ครูทราบอย่างตรงไปตรงมา — **ห้ามกล่าวอ้างว่าโจทย์ไม่ซ้ำกัน 100% หากยังไม่ได้ตรวจสอบหรือจำนวนชุดไม่เพียงพอ**',
      '  5. **ข้อความเตือนครูผู้สอน**: แสดงข้อความชัดเจนในหน้าโหมดครูว่า "โปรดตรวจสอบความถูกต้องของโจทย์ เฉลย และเกณฑ์ประเมินสำหรับเลขที่ตัวอย่างก่อนนำไปใช้สอนจริง"'
    ].join('\n');
  }

  function buildAssessmentCriteriaSection(ctx) {
    const feedbackRule = ctx.enableFeedback
      ? 'เปิดการแสดง Feedback: แสดงคำอธิบายเหตุผล จุดที่มักเข้าใจผิด และคำแนะนำเพิ่มเติมอย่างสร้างสรรค์ตามโหมดที่กำหนด'
      : 'ปิดการแสดง Feedback เชิงละเอียดระหว่างทำ: แสดงเฉพาะสถานะการส่งคำตอบและผลสรุปรวมตามเหมาะสม';

    const answerRule = ctx.showAnswers
      ? 'เปิดการแสดงเฉลย/แนวคำตอบ: แสดงเฉลยที่สัมพันธ์กับเลขที่นักเรียนคนนั้นหลังส่งคำตอบ (พร้อมวิธีคิดหรือแนวคำตอบเทียบเคียง)'
      : 'ปิดการแสดงเฉลยทันทีสำหรับนักเรียน: เก็บเฉลยและ Rubric ไว้เฉพาะใน "โหมดครู (Teacher Mode)" เพื่อป้องกันการส่งต่อเฉลยระหว่างทำกิจกรรม';

    const modeRule = ctx.appMode === 'practice'
      ? [
          'โหมดฝึกซ้อม (Practice Mode):',
          '- อนุญาตให้นักเรียนตรวจสอบคำตอบ/รับ Feedback เพื่อเรียนรู้แก้ไขความเข้าใจผิด และสามารถกด "ทำใหม่อีกครั้ง" หรือทดลองฝึกซ้ำได้',
          '- เน้นการเสริมแรงทางบวกและชี้แนะขั้นตอนการคิด'
        ].join('\n')
      : [
          'โหมดประเมินจริง (Assessment Mode):',
          '- ระหว่างกำลังทำข้อสอบ ห้ามแสดงเฉลยทันทีเป็นรายข้อ ให้ตรวจและสรุปผลหลังกดปุ่ม "ส่งคำตอบทั้งหมด" เท่านั้น',
          '- จำกัดการกดทำซ้ำหรือแสดงสถานะ "ส่งคำตอบแล้ว" อย่างชัดเจน พร้อมปุ่มดาวน์โหลด/พิมพ์ใบสรุปคำตอบของนักเรียน (เช่น JSON/CSV หรือหน้าพิมพ์)'
        ].join('\n');

    const subjectiveRule = ctx.activityType.isSubjective
      ? [
          '- **ข้อกำหนดสำคัญสำหรับคำถามปลายเปิด/สถานการณ์/กรณีศึกษา**:',
          '  - **ห้ามใช้ Keyword Matching เพียงอย่างเดียวในการตัดสินถูก-ผิด** ของคำตอบเชิงวิเคราะห์หรือให้เหตุผล',
          '  - ให้แสดง **เกณฑ์การให้คะแนน (Scoring Rubric)** แบบตารางชัดเจน (เช่น ระดับดีมาก / ดี / พอใช้ / ควรพัฒนา) พร้อมแนวประเด็นสำคัญ (Key Reasoning Points) เพื่อให้นักเรียนประเมินตนเองและครูใช้ตรวจให้คะแนนจริงได้สะดวก'
        ].join('\n')
      : '- สำหรับข้อตรวจอัตโนมัติ (ปรนัย/เติมคำ/คำนวณ) ให้ตรวจจากค่าคำตอบที่คำนวณได้จริง พร้อมรองรับรูปแบบที่เทียบเท่ากันและค่าคลาดเคลื่อนทศนิยมที่ระบุไว้';

    return [
      '## 7. เกณฑ์การประเมินและพฤติกรรมเฉลย (Assessment Criteria & Feedback)',
      `- ${feedbackRule}`,
      `- ${answerRule}`,
      modeRule,
      subjectiveRule
    ].join('\n');
  }

  function buildTechnicalRequirementsSection(ctx) {
    const packagingInstruction = ctx.outputStructure === 'single-file'
      ? [
          '- รูปแบบผลลัพธ์โค้ด: **ไฟล์ HTML เดียวแบบครบวงจร (`index.html`)** ที่มี `<style>` และ `<script>` ฝังภายในไฟล์เดียว',
          '  - เหตุผล: ครูสามารถบันทึกไฟล์เดียวแล้วเปิดใช้งานบนเครื่องได้ทันที (Double-click `index.html`) หรืออัปโหลดขึ้น GitHub Pages ได้โดยไม่ติดปัญหา Path หรือ CORS'
        ].join('\n')
      : [
          '- รูปแบบผลลัพธ์โค้ด: **โครงสร้างโปรเจกต์แยกไฟล์พร้อมขึ้น GitHub Pages** ประกอบด้วย `index.html`, `css/style.css`, `js/app.js`, `js/question-engine.js`, `.nojekyll` และ `README.md`',
          '  - ใช้ Relative Path ทั้งหมด (ห้ามขึ้นต้นด้วย `/`) และหลีกเลี่ยง ES Module CORS เมื่อเปิดแบบ Local หากไม่ได้รันผ่าน Server'
        ].join('\n');

    return [
      '## 8. ข้อกำหนดเว็บแอปและสถาปัตยกรรมทางเทคนิค (Technical Requirements)',
      '- เทคโนโลยีที่ใช้: **HTML5, CSS3, Vanilla JavaScript (ES6+) เท่านั้น** (ห้ามใช้ React, Vue, Next.js, Node.js Backend หรือ Database)',
      '- ห้ามเชื่อมต่อ AI API ภายนอก ห้ามใช้ API Key, Token หรือบริการ Login จากภายนอก',
      '- หลีกเลี่ยง CDN หรือ Library ภายนอกที่ไม่จำเป็น เพื่อให้เปิดใช้งานแบบ Offline และบน GitHub Pages ได้อย่างเสถียร',
      packagingInstruction,
      '- **Responsive Design & Accessibility**: ใช้งานได้ดีทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์ ใช้ Semantic HTML, `<label>` คู่กับ input, ขนาดตัวอักษรภาษาไทยอ่านง่าย คอนทราสต์ชัดเจน และแจ้งเตือน Error อย่างสุภาพ (เช่น ลืมกรอกเลขที่หรือกรอกเลขที่เกินช่วง)',
      '- **ความปลอดภัยของโค้ด (Code Security)**: ป้องกัน Unsafe HTML Injection (ใช้ `textContent` แทนการต่อสตริงลง `innerHTML` โดยตรง) และห้ามใช้ `eval()`',
      '',
      '### ข้อจำกัดด้าน Static Web ที่ต้องระบุอย่างซื่อสัตย์ในแอปและเอกสาร',
      '- เว็บแอปแบบ Static Client-Side **ไม่สามารถปกปิดเฉลยใน Source Code หรือป้องกันการแก้ไขข้อมูลฝั่งเบราว์เซอร์ได้ 100%**',
      '- ห้ามกล่าวอ้างว่าเป็นระบบสอบที่ป้องกันการทุจริตได้สมบูรณ์สำหรับงานสอบที่มีผลต่อคะแนนสำคัญ',
      '- เนื่องจากไม่มี Backend **ห้ามกล่าวอ้างว่าระบบจัดเก็บหรือส่งคะแนนนักเรียนเข้าสู่ระบบกลางของครูได้อย่างถาวรและปลอดภัย** (สามารถใช้ `localStorage` บันทึกความคืบหน้าชั่วคราวบนเครื่องนักเรียน หรือให้ดาวน์โหลด/พิมพ์ใบสรุปผลส่งครูแทน)'
    ].join('\n');
  }

  function buildStudentAndTeacherExperienceSection(ctx) {
    return [
      '## 9. พฤติกรรมของผู้เรียนและเครื่องมือสำหรับครู (Student UX & Teacher Toolkit)',
      '### ประสบการณ์ฝั่งนักเรียน (Student Flow)',
      `1. เปิดหน้าเว็บ เห็นชื่อรายวิชา "${ctx.effectiveSubject}" (${ctx.grade}), หัวข้อ "${ctx.topic}", คำชี้แจง และเวลาแนะนำ ${ctx.durationMinutes} นาที`,
      ctx.useStudentSeed
        ? `2. กรอก "เลขที่นักเรียน" (1–${ctx.classSize}) เพื่อสร้าง/โหลดชุดโจทย์เฉพาะบุคคลของตนเอง`
        : '2. กรอกเลขที่/ชื่อเล่นเพื่อระบุตัวตนบนใบสรุปผล แล้วเริ่มทำกิจกรรม',
      '3. ทำแบบฝึกหัดทีละข้อหรือดูภาพรวมทุกข้อ พร้อมแสดงความคืบหน้าและป้องกันการส่งโดยไม่ได้ตั้งใจ',
      '4. กดส่งคำตอบ ระบบตรวจอัตโนมัติในข้อที่มีเกณฑ์ชัดเจน แสดง Feedback/แนวคำตอบ/Rubric ตามการตั้งค่าของครู และสรุปคะแนนหรือผลการประเมินตนเอง',
      '5. รองรับการทำซ้ำหรือดาวน์โหลด/พิมพ์สรุปคำตอบตามโหมดที่ครูเลือก',
      '',
      '### เครื่องมือฝั่งครู (Built-in Teacher Panel / Mode)',
      '- มีปุ่มเข้าสู่ "มุมมองครู / ตรวจสอบชุดโจทย์ (Teacher Inspector)" ที่แยกส่วนชัดเจนจากหน้าจอทำกิจกรรมของนักเรียน',
      '- **ตัวตรวจเลขที่นักเรียนหลายคน (Multi-Student Inspector)**: ครูสามารถกรอกหรือเลือกดูตัวอย่างโจทย์ เฉลย และวิธีทำของเลขที่ใด ๆ ในช่วง 1–' + ctx.classSize + ' ได้ทันที รวมถึงสรุปผลตรวจสอบความซ้ำของโจทย์ทั้งห้อง',
      '- แสดงตารางเฉลย แนวคำตอบ เกณฑ์การให้คะแนน (Rubric) และคำแนะนำสั้น ๆ สำหรับครูในการนำไฟล์ขึ้น GitHub Pages'
    ].join('\n');
  }

  function buildVerificationChecklistSection(ctx) {
    return [
      '## 10. เงื่อนไขความสำเร็จและการตรวจสอบก่อนส่งมอบ (Success Criteria & Self-Check)',
      'ก่อนส่งคำตอบสุดท้าย ให้ตรวจสอบโค้ดที่คุณสร้างให้ครบทุกข้อต่อไปนี้:',
      '- [ ] โค้ดทำงานได้จริงครบทุกปุ่มและทุกขั้นตอนตั้งแต่กรอกเลขที่จนถึงหน้าสรุปผล ไม่มี Syntax Error หรือ Runtime Error',
      ctx.useStudentSeed
        ? `- [ ] ทดสอบเทียบเลขที่ 1, 2 และ ${Math.min(ctx.classSize, 15)} แล้วพบว่าได้โจทย์ที่แตกต่างกันอย่างมีความหมาย แต่ยังคงวัด "${ctx.topic}" ด้วยความยากเทียบเท่ากัน`
        : '- [ ] ทดสอบทำกิจกรรมจนจบและตรวจสอบการแสดงผลสรุปครบถ้วน',
      '- [ ] เฉลยและวิธีทำคำนวณ/จับคู่สอดคล้องกับโจทย์ที่แสดงจริง 100% และมีข้อความเตือนให้ครูตรวจทานก่อนใช้งานจริง',
      '- [ ] หากมีข้อคำถามปลายเปิด ต้องแสดง Rubric ที่ชัดเจนและไม่ใช้ Keyword Matching ตัดสินคะแนนแบบตายตัว',
      '- [ ] มีคำอธิบายวิธีเปิดใช้งานบนเครื่อง วิธีอัปโหลดขึ้น GitHub Pages และหมายเหตุข้อจำกัดของ Static Web App อย่างชัดเจน'
    ].join('\n');
  }

  function renderFullPromptText(ctx) {
    const sections = [
      '# PROMPT: สร้างเว็บแอปพลิเคชันการเรียนรู้เฉพาะบุคคล (Personalized Learning Web App)',
      '',
      buildRoleSection(ctx),
      '',
      buildTeachingContextSection(ctx),
      '',
      buildObjectivesSection(ctx),
      '',
      buildAcademicSpecsSection(ctx),
      '',
      buildQuestionFormatSection(ctx),
      '',
      buildPersonalizedStrategySection(ctx),
      '',
      buildAssessmentCriteriaSection(ctx),
      '',
      buildTechnicalRequirementsSection(ctx),
      '',
      buildStudentAndTeacherExperienceSection(ctx),
      '',
      buildVerificationChecklistSection(ctx)
    ];

    return sections.join('\n');
  }

  TPS.templates = {
    renderFullPromptText
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TPS.templates;
  }
})(typeof window !== 'undefined' ? window : globalThis);
