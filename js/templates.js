/**
 * Teacher Prompt Studio — Rule-Based Prompt Templates
 *
 * Pure modular section builders that compose a concise, execution-ready
 * 10-part Prompt instructing external AI chats/agents to output a complete,
 * directly runnable learning web app. Contains zero AI API calls.
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

  function buildCreatorCreditText(ctx) {
    const parts = [];
    if (ctx.creatorName) {
      parts.push(`ผู้จัดทำ: ${ctx.creatorName}`);
    }
    if (ctx.schoolName) {
      parts.push(`สถานศึกษา: ${ctx.schoolName}`);
    }
    return parts.join(' | ');
  }

  function buildRoleSection(ctx) {
    const activityDisplay = ctx.effectiveActivityLabel || ctx.activityType.thaiLabel;
    const deliveryContract =
      ctx.outputStructure === 'single-file'
        ? '- **ส่งมอบโค้ดทั้งหมดในไฟล์ `index.html` ไฟล์เดียว (ฝัง CSS และ JS ภายใน)** ภายใน Code Block เดียวที่คัดลอกไปบันทึกแล้วดับเบิลคลิกเปิดใช้งานได้ทันที'
        : '- **ส่งมอบโค้ดครบทุกไฟล์** (`index.html`, `css/style.css`, `js/app.js`, `js/question-engine.js`, `.nojekyll`, `README.md`) โดยระบุชื่อไฟล์เหนือทุก Code Block';

    return [
      '## 1. บทบาทของ AI และคำสั่งการส่งมอบโค้ด (AI Role & Delivery Contract)',
      `คุณคือ Senior Educational Web Developer และ Instructional Designer สำหรับระดับ "${ctx.effectiveGrade}"`,
      `ภารกิจ: **เขียนโค้ดเว็บแอปพลิเคชัน "${activityDisplay}" เรื่อง "${ctx.topic}" วิชา "${ctx.effectiveSubject}" ที่เปิดใช้งานได้จริงทันที**`,
      '- **เริ่มเขียนโค้ดฉบับสมบูรณ์ทันทีในคำตอบนี้** ห้ามถามยืนยันก่อน ห้ามตอบเป็นเพียงโครงร่างหรือรายการคำถาม',
      `- **ห้ามย่อโค้ดหรือละไว้ในฐานที่เข้าใจ** (ห้ามใช้ \`// TODO\` หรือ \`// เพิ่มข้อที่เหลือเอง\`) — ต้องสร้างโจทย์/คลังข้อมูล/เฉลยครบทั้ง ${ctx.questionCount} ข้อและทุกปุ่มทำงานได้ 100%`,
      deliveryContract
    ].join('\n');
  }

  function buildTeachingContextSection(ctx) {
    const seedLabel = ctx.useStudentSeed
      ? `เปิดใช้งาน (ใช้เลขที่นักเรียน 1–${ctx.classSize} เป็น Seed กำหนดชุดโจทย์)`
      : 'ปิดใช้งาน (นักเรียนทุกคนทำชุดเดียวกัน)';

    const lines = [
      '## 2. บริบทการสอน (Teaching Context)',
      `- กลุ่มสาระการเรียนรู้: ${ctx.effectiveGroupLabel}`,
      `- รายวิชา: ${ctx.effectiveSubject}`,
      `- ระดับชั้น: ${ctx.effectiveGrade}`,
      `- หัวข้อที่สอน: ${ctx.topic}`,
      `- ระดับความยาก: ${ctx.difficulty.label} — ${ctx.difficulty.desc}`,
      `- จำนวนข้อ/ภารกิจ: ${ctx.questionCount} ข้อ | เวลาแนะนำ: ${ctx.durationMinutes} นาที`,
      `- จำนวนนักเรียนในห้อง: ${ctx.classSize} คน (เลขที่ 1 ถึง ${ctx.classSize})`,
      `- โหมดใช้งาน: ${ctx.appModeLabel}`,
      `- โจทย์แยกตามเลขที่นักเรียน: ${seedLabel}`
    ];

    if (ctx.creatorName) {
      lines.push(`- ครูผู้สร้าง/ผู้สอน: ${ctx.creatorName}`);
    }
    if (ctx.schoolName) {
      lines.push(`- โรงเรียน/สถานศึกษา: ${ctx.schoolName}`);
    }

    return lines.join('\n');
  }

  function buildObjectivesSection(ctx) {
    return [
      '## 3. จุดประสงค์การเรียนรู้ (Learning Objectives)',
      'ทุกข้อคำถามและเกณฑ์ประเมินต้องวัดผลตรงตามจุดประสงค์ต่อไปนี้:',
      `> ${ctx.objectives}`,
      '- คำอธิบาย Feedback และเฉลยต้องช่วยให้นักเรียนเข้าใจแนวคิด ไม่ใช่แค่บอกว่าถูกหรือผิด'
    ].join('\n');
  }

  function buildAcademicSpecsSection(ctx) {
    const groupRules = ctx.group.academicRules || [];
    const extraNotes = ctx.teacherNotes
      ? `\n### เงื่อนไขเพิ่มเติมจากครูผู้สอน (ต้องทำตาม)\n${ctx.teacherNotes}`
      : '';

    return [
      '## 4. ข้อกำหนดด้านวิชาการ (Academic Rules)',
      formatBulletList(groupRules),
      `- ใช้ภาษาไทยที่เหมาะกับผู้เรียนชั้น ${ctx.effectiveGrade} และเหมาะสมกับเวลา ${ctx.durationMinutes} นาที${extraNotes}`
    ].join('\n');
  }

  function buildQuestionFormatSection(ctx) {
    const formatGuidelines = {
      'multiple-choice': [
        'สร้างตัวเลือก 4 ตัวเลือก (ก–ง) ที่ตัวลวงสะท้อนความเข้าใจคลาดเคลื่อนจริง และสุ่มลำดับตัวเลือกอย่างกำหนดซ้ำได้เมื่อเปิด Seed'
      ],
      'short-answer': [
        'มีช่องพิมพ์คำตอบสั้นพร้อมคำแนะนำขอบเขต และแสดงแนวคำตอบสำคัญ + Rubric ให้เทียบประเมิน'
      ],
      'fill-blank': [
        'มีช่องเติมคำ/เติมค่าที่ระบุหน่วยชัดเจน และตรวจคำตอบโดยตัดช่องว่างหน้า-หลังอัตโนมัติ'
      ],
      'calculation': [
        'แยกข้อมูลที่โจทย์กำหนด สิ่งที่ต้องหา ช่องกรอกคำตอบพร้อมหน่วย และแสดงวิธีแทนค่าสูตรทีละขั้นในเฉลย'
      ],
      'scenario': [
        'แสดงสถานการณ์จำลองหรือบทอ่านสั้นชัดเจนก่อนเข้าคำถาม หากมีข้อวิเคราะห์ให้ประเมินด้วย Rubric'
      ],
      'case-study': [
        'นำเสนอกรณีศึกษาพร้อมข้อมูลและผู้เกี่ยวข้อง แบ่งช่องตอบเป็นขั้นตอน (ประเด็น-หลักการ-แนวทาง) และมี Rubric 3–4 ระดับ'
      ],
      'interactive': [
        'สร้างกิจกรรมโต้ตอบในเบราว์เซอร์ (เช่น จับคู่ เรียงลำดับ จำแนก หรือปรับค่าทดลอง) ที่กดใช้งานได้ทั้งเมาส์ สัมผัส และคีย์บอร์ด'
      ],
      'mixed': [
        `ผสานข้อตรวจอัตโนมัติ (ปรนัย/คำนวณ/เติมคำ) เข้ากับข้อวิเคราะห์สถานการณ์อย่างสมดุลครบ ${ctx.questionCount} ข้อ`
      ],
      'custom': [
        `ออกแบบกิจกรรมให้ตรงตามรูปแบบที่ครูกำหนด: "${ctx.customActivity}" ครบทั้ง ${ctx.questionCount} ข้อ/ภารกิจ พร้อมคำชี้แจงและเกณฑ์ตรวจชัดเจน`
      ]
    };

    const specificRules = formatGuidelines[ctx.activityType.id] || formatGuidelines['mixed'];
    const activityDisplay = ctx.effectiveActivityLabel || `${ctx.activityType.label} (${ctx.activityType.thaiLabel})`;

    return [
      '## 5. รูปแบบโจทย์และการโต้ตอบ (Question Format)',
      `- รูปแบบหลัก: **${activityDisplay}**`,
      formatBulletList(specificRules),
      '- แสดงแถบความคืบหน้า (Progress Bar) และป้องกันการส่งเมื่อยังตอบไม่ครบโดยไม่ตั้งใจ'
    ].join('\n');
  }

  function buildPersonalizedStrategySection(ctx) {
    const strategy = ctx.strategy;

    if (!ctx.useStudentSeed) {
      return [
        '## 6. กลยุทธ์สร้างโจทย์เฉพาะบุคคล (Personalized Assessment Engine)',
        '- สถานะ Seed ตามเลขที่นักเรียน: **ปิดใช้งาน** (ใช้ชุดกิจกรรมมาตรฐานเดียวกันทั้งห้อง)',
        '- ให้นักเรียนกรอกเลขที่หรือชื่อเล่นเพื่อแสดงบนใบสรุปผลของตนเอง (ไม่ส่งข้อมูลออกนอกเครื่อง)',
        '- มีคำแนะนำเฉพาะจุดเมื่อตอบผิด และมีโหมดครูสำหรับดูเฉลยและ Rubric ทั้งชุด'
      ].join('\n');
    }

    const extraEngineRules = [
      `รับค่า "เลขที่นักเรียน" เป็นจำนวนเต็ม 1 ถึง ${ctx.classSize} (ตรวจสอบค่าว่างและนอกช่วง)`,
      'ใช้ Deterministic PRNG (เช่น Mulberry32) จาก Seed เลขที่นักเรียน + ลำดับข้อ — **ห้ามใช้ `Math.random()` แบบไม่มี Seed** เพื่อให้เลขที่เดิมได้ชุดโจทย์เดิมทุกครั้ง',
      `ระดับความแตกต่าง: **${ctx.differentiation.label}** (${ctx.differentiation.desc})`
    ];

    if (strategy.id === 'contextual' || strategy.id === 'case-based') {
      extraEngineRules.push(
        `เตรียมคลังบริบท/กรณีศึกษาให้เพียงพอต่อการหมุนเวียนสำหรับ ${ctx.questionCount} ข้อ และเลือกแบบสมดุลไม่ให้ซ้ำเรื่องภายในชุดเดียวกัน`
      );
    }

    return [
      '## 6. กลยุทธ์สร้างโจทย์เฉพาะบุคคล (Personalized Assessment Engine)',
      `- กลยุทธ์ที่ใช้: **${strategy.code}: ${strategy.name}** (${strategy.shortDesc})`,
      formatBulletList(extraEngineRules),
      formatBulletList(strategy.principles),
      '',
      '### ข้อห้ามสำคัญของกลยุทธ์',
      formatBulletList(strategy.pitfalls),
      '',
      '### การตรวจสอบความซ้ำและเฉลยในโหมดครู (Mandatory Guardrails)',
      `- มีฟังก์ชันตรวจชุดโจทย์ครอบคลุมเลขที่ 1 ถึง ${ctx.classSize}:`,
      `  1. **Collision Audit**: คำนวณอัตราการซ้ำของโจทย์ในช่วงเลขที่ 1–${ctx.classSize} และรายงานตามจริง`,
      '  2. **Answer Integrity**: ยืนยันว่าเฉลยคำนวณตรงกับตัวเลข/บริบทที่สุ่มได้จริง ไม่มี NaN หรือค่าหลุดขอบเขต',
      '  3. **Difficulty Equivalence**: ทุกเลขที่ต้องแก้โจทย์ด้วยระดับความยากและจำนวนขั้นตอนเทียบเท่ากัน',
      '  4. **คำเตือนด้านความซ้ำ**: ห้ามอ้างว่าโจทย์ไม่ซ้ำ 100% หากยังไม่ได้ตรวจหรือคลังสถานการณ์มีน้อยกว่าจำนวนนักเรียน',
      '  5. **ข้อความเตือนครู**: แสดงข้อความ "โปรดตรวจสอบโจทย์ เฉลย และเกณฑ์ประเมินสำหรับเลขที่ตัวอย่างก่อนนำไปใช้สอนจริง"'
    ].join('\n');
  }

  function buildAssessmentCriteriaSection(ctx) {
    const feedbackRule = ctx.enableFeedback
      ? 'เปิด Feedback: แสดงคำอธิบายเหตุผลและข้อควรระวังเมื่อตอบเสร็จ'
      : 'ปิด Feedback เชิงละเอียด: แสดงเฉพาะสถานะการส่งและสรุปคะแนน';

    const answerRule = ctx.showAnswers
      ? 'เปิดเฉลย/แนวคำตอบ: แสดงเฉลยและวิธีทำที่ตรงกับเลขที่นักเรียนหลังส่งคำตอบ'
      : 'ซ่อนเฉลยจากหน้านักเรียน: แสดงเฉลยและ Rubric เฉพาะใน "โหมดครู" เท่านั้น';

    const modeRule = ctx.appMode === 'practice'
      ? '- โหมดฝึกซ้อม: นักเรียนตรวจคำตอบและกดลองทำใหม่ได้ เน้นเรียนรู้แก้ไขความเข้าใจผิด'
      : '- โหมดประเมินจริง: ห้ามเฉลยรายข้อระหว่างทำ ให้ตรวจและสรุปผลหลังกดส่งทั้งหมด พร้อมปุ่มดาวน์โหลด/พิมพ์ใบสรุปผล';

    const subjectiveRule = ctx.activityType.isSubjective
      ? '- **กติกาข้ออัตนัย/สถานการณ์/กรณีศึกษา**: **ห้ามใช้ Keyword Matching เพียงอย่างเดียวในการตัดสินถูก-ผิด** ให้แสดงตาราง Scoring Rubric และแนวประเด็นคำตอบเพื่อให้นักเรียนประเมินตนเองและครูใช้ตรวจจริง'
      : '- ข้อตรวจอัตโนมัติ (ปรนัย/เติมคำ/คำนวณ) ให้ตรวจจากค่าคำนวณจริงและรองรับความคลาดเคลื่อนทศนิยม/รูปแบบเทียบเท่าอย่างเหมาะสม';

    return [
      '## 7. เกณฑ์การประเมินและ Feedback (Assessment & Feedback)',
      `- ${feedbackRule}`,
      `- ${answerRule}`,
      modeRule,
      subjectiveRule
    ].join('\n');
  }

  function buildTechnicalRequirementsSection(ctx) {
    const packagingNote = ctx.outputStructure === 'single-file'
      ? '- บรรจุ HTML/CSS/JS ทั้งหมดไว้ในไฟล์ `index.html` ไฟล์เดียว ไม่มีโค้ดภายนอกที่ต้องติดตั้งเพิ่มเติม'
      : '- แยกไฟล์โมดูลสะอาดตา ใช้ Relative Path ทั้งหมด และมี `.nojekyll` พร้อมอัปโหลดขึ้น GitHub Pages';

    return [
      '## 8. ข้อกำหนดทางเทคนิคและข้อจำกัด Static Web',
      '- ใช้ **HTML5, CSS3, Vanilla JavaScript (ES6+)** เท่านั้น ห้ามใช้ Framework, Backend, Database, Login ภายนอก, CDN หรือ AI API',
      packagingNote,
      '- Responsive ใช้งานง่ายบนมือถือและคอมพิวเตอร์ ใช้ Semantic HTML และป้องกัน Unsafe HTML Injection (`textContent`, ห้ามใช้ `eval()`)',
      '- **ข้อจำกัด Static Web ที่ต้องแจ้งไว้ในแอปและคู่มือ**:',
      '  - เว็บ Client-Side ไม่สามารถซ่อนเฉลยในโค้ดเบราว์เซอร์หรือป้องกันการทุจริตได้ 100%',
      '  - ไม่มี Backend จึงไม่สามารถส่ง/เก็บคะแนนนักเรียนเข้าฐานข้อมูลกลางของครูได้ถาวร (ใช้ `localStorage` บนเครื่องหรือดาวน์โหลดสรุปผลส่งครูแทน)'
    ].join('\n');
  }

  function buildStudentAndTeacherExperienceSection(ctx) {
    const creditText = buildCreatorCreditText(ctx);
    const creditRequirement = creditText
      ? `- แสดงเครดิตผู้สร้างบนหน้าเว็บอย่างเรียบร้อย (${creditText})`
      : '';

    const lines = [
      '## 9. ขั้นตอนฝั่งนักเรียนและโหมดครู (Student UX & Teacher Panel)',
      '### ฝั่งนักเรียน',
      `1. เปิดเว็บเห็นชื่อวิชา "${ctx.effectiveSubject}" (${ctx.effectiveGrade}), หัวข้อ "${ctx.topic}" และเวลา ${ctx.durationMinutes} นาที`,
      ctx.useStudentSeed
        ? `2. กรอก "เลขที่นักเรียน" (1–${ctx.classSize}) เพื่อสร้างชุดโจทย์เฉพาะของตนเอง`
        : '2. กรอกเลขที่/ชื่อเล่นสำหรับใบสรุปผล แล้วเริ่มทำกิจกรรม',
      '3. ทำแบบฝึกหัด กดส่งคำตอบ รับ Feedback/เฉลย/Rubric ตามการตั้งค่า และทำซ้ำหรือดาวน์โหลดสรุปผลได้',
      '',
      '### โหมดครู (Teacher Inspector)',
      `- มีปุ่มสลับเข้ามุมมองครู เพื่อดูตารางเฉลย, Rubric และทดลองใส่เลขที่ใด ๆ ในช่วง 1–${ctx.classSize} เพื่อตรวจความซ้ำและความถูกต้องของโจทย์`,
      '- แนบคำแนะนำสั้น ๆ สำหรับการนำไฟล์ขึ้น GitHub Pages'
    ];

    if (creditRequirement) {
      lines.push(creditRequirement);
    }

    return lines.join('\n');
  }

  function buildVerificationChecklistSection(ctx) {
    return [
      '## 10. เงื่อนไขความสำเร็จก่อนส่งมอบ (Final Check)',
      '- [ ] โค้ดครบสมบูรณ์เปิดใช้งานในเบราว์เซอร์ได้ทันที ไม่มีปุ่มปลอม ไม่มีฟังก์ชันค้างไว้ และไม่มี Syntax/Runtime Error',
      ctx.useStudentSeed
        ? `- [ ] เทียบเลขที่ 1, 2 และ ${Math.min(ctx.classSize, 15)} แล้วได้โจทย์ต่างกันอย่างเหมาะสม ความยากเท่ากัน และเฉลยตรง 100%`
        : '- [ ] ทดสอบทำกิจกรรมจนถึงหน้าสรุปผลได้ครบถ้วน',
      '- [ ] หากมีข้อเขียนปลายเปิด ต้องแสดง Rubric ที่ชัดเจนและไม่ตัดสินคะแนนด้วย Keyword Matching ตายตัว',
      '- [ ] หลัง Code Block สรุปวิธีบันทึกไฟล์ เปิดใช้งาน และ Deploy บน GitHub Pages สั้น ๆ ไม่เกิน 5 ข้อ'
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
