/**
 * Teacher Prompt Studio — Prompt Engine
 *
 * Pure deterministic engine that normalizes teacher inputs, validates completeness,
 * resolves the optimal personalized assessment strategy, and constructs both
 * the Simple View summary and the Full Structured Prompt.
 */
(function (root) {
  'use strict';

  const TPS = (root.TPS = root.TPS || {});

  function getDependencies() {
    if (TPS.strategies && TPS.templates) {
      return { strategies: TPS.strategies, templates: TPS.templates };
    }
    if (typeof require === 'function') {
      return {
        strategies: require('./subject-strategies.js'),
        templates: require('./templates.js')
      };
    }
    throw new Error('Teacher Prompt Studio dependencies are not loaded.');
  }

  function clampInt(value, min, max, fallback) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, parsed));
  }

  function sanitizeSingleLine(value) {
    return String(value == null ? '' : value)
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function sanitizeMultiLine(value) {
    return String(value == null ? '' : value)
      .replace(/\r\n/g, '\n')
      .trim();
  }

  function createDefaultState() {
    return {
      subjectGroup: 'science',
      customGroup: '',
      subject: 'ฟิสิกส์',
      customSubject: '',
      grade: 'ม.4',
      customGrade: '',
      topic: '',
      objectives: '',
      creatorName: '',
      schoolName: '',
      difficulty: 'medium',
      questionCount: 5,
      durationMinutes: 30,
      assessmentType: 'multiple-choice',
      customActivity: '',
      useStudentSeed: true,
      classSize: 40,
      strategyMode: 'auto',
      differentiationLevel: 'medium',
      enableFeedback: true,
      showAnswers: true,
      appMode: 'practice',
      outputStructure: 'single-file',
      teacherNotes: '',
      activePresetId: ''
    };
  }

  function normalizeState(rawState) {
    const { strategies } = getDependencies();
    const defaults = createDefaultState();
    const input = rawState && typeof rawState === 'object' ? rawState : {};

    const group = strategies.getGroupById(input.subjectGroup || defaults.subjectGroup);
    const customGroup = sanitizeSingleLine(input.customGroup || '');
    const effectiveGroupLabel =
      group.id === 'custom' && customGroup ? customGroup : group.label;

    let subject = sanitizeSingleLine(input.subject || '');

    if (!subject) {
      subject = group.subjects[0] ? group.subjects[0].id : '__custom__';
    } else if (group.id !== 'custom' && subject !== '__custom__') {
      const existsInGroup = group.subjects.some((s) => s.id === subject);
      if (!existsInGroup) {
        subject = '__custom__';
      }
    }

    const customSubject = sanitizeSingleLine(input.customSubject || '');
    const effectiveSubject =
      group.id === 'custom' || subject === '__custom__'
        ? customSubject
        : subject;

    let gradeRaw = sanitizeSingleLine(input.grade || defaults.grade);
    if (gradeRaw === 'อื่น ๆ / ไม่จำกัดระดับชั้น') {
      gradeRaw = '__custom__';
    }
    const validGradeIds = strategies.GRADE_LEVELS.map((g) => (typeof g === 'string' ? g : g.id));
    const grade = validGradeIds.includes(gradeRaw) ? gradeRaw : '__custom__';
    const customGrade = sanitizeSingleLine(
      input.customGrade !== undefined
        ? input.customGrade
        : !validGradeIds.includes(gradeRaw) && gradeRaw !== '__custom__'
          ? gradeRaw
          : ''
    );
    const effectiveGrade = grade === '__custom__' ? customGrade : grade;

    const assessmentType = String(input.assessmentType || defaults.assessmentType);
    const activityObj = strategies.getAssessmentTypeById(assessmentType);
    const customActivity = sanitizeSingleLine(input.customActivity || '');
    const effectiveActivityLabel =
      assessmentType === 'custom'
        ? customActivity
        : `${activityObj.label} (${activityObj.thaiLabel})`;

    const strategyModeRaw = String(input.strategyMode || defaults.strategyMode);
    const validStrategyModes = ['auto', 'numerical', 'contextual', 'case-based', 'hybrid'];
    const strategyMode = validStrategyModes.includes(strategyModeRaw) ? strategyModeRaw : 'auto';

    return {
      subjectGroup: group.id,
      customGroup,
      effectiveGroupLabel,
      subject,
      customSubject,
      effectiveSubject,
      grade,
      customGrade,
      effectiveGrade,
      topic: sanitizeSingleLine(input.topic || ''),
      objectives: sanitizeMultiLine(input.objectives || ''),
      creatorName: sanitizeSingleLine(input.creatorName || ''),
      schoolName: sanitizeSingleLine(input.schoolName || ''),
      difficulty: String(input.difficulty || defaults.difficulty),
      questionCount: clampInt(input.questionCount, 1, 50, defaults.questionCount),
      durationMinutes: clampInt(input.durationMinutes, 5, 240, defaults.durationMinutes),
      assessmentType: activityObj.id,
      customActivity,
      effectiveActivityLabel,
      useStudentSeed: Boolean(
        input.useStudentSeed === undefined ? defaults.useStudentSeed : input.useStudentSeed
      ),
      classSize: clampInt(input.classSize, 1, 300, defaults.classSize),
      strategyMode,
      differentiationLevel: String(input.differentiationLevel || defaults.differentiationLevel),
      enableFeedback: Boolean(
        input.enableFeedback === undefined ? defaults.enableFeedback : input.enableFeedback
      ),
      showAnswers: Boolean(
        input.showAnswers === undefined ? defaults.showAnswers : input.showAnswers
      ),
      appMode: input.appMode === 'assessment' ? 'assessment' : 'practice',
      outputStructure: input.outputStructure === 'multi-file' ? 'multi-file' : 'single-file',
      teacherNotes: sanitizeMultiLine(input.teacherNotes || ''),
      activePresetId: sanitizeSingleLine(input.activePresetId || '')
    };
  }

  function resolveStrategy(state) {
    const { strategies } = getDependencies();
    const recommendedId = strategies.recommendStrategyId(
      state.subjectGroup,
      state.effectiveSubject || state.subject,
      state.assessmentType
    );

    const isAuto = state.strategyMode === 'auto' || !strategies.STRATEGIES[state.strategyMode];
    const effectiveId = isAuto ? recommendedId : state.strategyMode;

    return {
      isAuto,
      recommendedStrategyId: recommendedId,
      effectiveStrategyId: effectiveId,
      strategy: strategies.STRATEGIES[effectiveId] || strategies.STRATEGIES.hybrid,
      recommendedStrategy: strategies.STRATEGIES[recommendedId] || strategies.STRATEGIES.hybrid
    };
  }

  function validateState(state) {
    const { strategies } = getDependencies();
    const missingFields = [];
    const warnings = [];

    if (!state.effectiveSubject) {
      missingFields.push({
        fieldId: state.subjectGroup === 'custom' || state.subject === '__custom__' ? 'customSubjectInput' : 'subjectSelect',
        label: 'รายวิชา'
      });
    }

    if (!state.effectiveGrade) {
      missingFields.push({
        fieldId: state.grade === '__custom__' ? 'customGradeInput' : 'gradeSelect',
        label: 'ระดับชั้น'
      });
    }

    if (!state.topic) {
      missingFields.push({ fieldId: 'topicInput', label: 'หัวข้อที่สอน' });
    }

    if (!state.objectives) {
      missingFields.push({ fieldId: 'objectivesInput', label: 'จุดประสงค์การเรียนรู้' });
    }

    if (state.assessmentType === 'custom' && !state.customActivity) {
      missingFields.push({ fieldId: 'customActivityInput', label: 'รูปแบบกิจกรรมกำหนดเอง' });
    }

    const activityType = strategies.getAssessmentTypeById(state.assessmentType);
    const strategyInfo = resolveStrategy(state);

    if (state.appMode === 'assessment' && state.showAnswers) {
      warnings.push({
        id: 'assessment-answers-visible',
        level: 'info',
        message: 'โหมดประเมินจริงกำลังเปิดเฉลยไว้ — หากใช้เก็บคะแนนแนะนำให้ปิด "แสดงเฉลย" เพื่อเก็บไว้เฉพาะในโหมดครู'
      });
    }

    if (activityType.isSubjective && strategyInfo.effectiveStrategyId === 'numerical') {
      warnings.push({
        id: 'subjective-with-numerical',
        level: 'warning',
        message: 'กิจกรรมที่เลือกเน้นวิเคราะห์/สถานการณ์ แต่กลยุทธ์เป็นแบบเปลี่ยนตัวเลข — ลองเปลี่ยนเป็นกลยุทธ์ B, C หรือ D'
      });
    }

    if (
      state.useStudentSeed &&
      (strategyInfo.effectiveStrategyId === 'contextual' ||
        strategyInfo.effectiveStrategyId === 'case-based') &&
      state.classSize >= 45
    ) {
      warnings.push({
        id: 'large-class-context-pool',
        level: 'info',
        message: `ห้องเรียน ${state.classSize} คน: Prompt สั่งให้ AI ตรวจความซ้ำและแจ้งเตือนหากคลังโจทย์มีไม่พอ`
      });
    }

    if (state.questionCount > 20 && state.durationMinutes < state.questionCount) {
      warnings.push({
        id: 'time-per-question-tight',
        level: 'info',
        message: `เวลาเฉลี่ยไม่ถึงข้อละ 1 นาที (${state.durationMinutes} นาที / ${state.questionCount} ข้อ)`
      });
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings
    };
  }

  function buildSimpleSummary(ctx, validation) {
    const creditParts = [];
    if (ctx.creatorName) {
      creditParts.push(`ผู้สร้าง: ${ctx.creatorName}`);
    }
    if (ctx.schoolName) {
      creditParts.push(`โรงเรียน: ${ctx.schoolName}`);
    }

    return {
      isReady: validation.isValid,
      subjectLabel: ctx.effectiveSubject || 'ยังไม่ระบุรายวิชา',
      groupLabel: ctx.effectiveGroupLabel,
      gradeLabel: ctx.effectiveGrade || 'ยังไม่ระบุระดับชั้น',
      topicLabel: ctx.topic || 'ยังไม่ระบุหัวข้อที่สอน',
      objectivesLabel: ctx.objectives || 'ยังไม่ระบุจุดประสงค์การเรียนรู้',
      creditLabel: creditParts.join(' • '),
      workloadLabel: `${ctx.questionCount} ข้อ • ${ctx.durationMinutes} นาที • ${ctx.difficulty.label}`,
      activityLabel: ctx.effectiveActivityLabel || `${ctx.activityType.label} (${ctx.activityType.thaiLabel})`,
      strategyLabel: ctx.useStudentSeed
        ? `${ctx.strategy.code}: ${ctx.strategy.name} (${ctx.differentiation.label})`
        : 'ชุดมาตรฐานเดียวกันทั้งห้อง (ไม่แยกเลขที่)',
      classScopeLabel: ctx.useStudentSeed
        ? `ตรวจความซ้ำเลขที่ 1–${ctx.classSize}`
        : `รองรับ ${ctx.classSize} คน`,
      feedbackRulesLabel: [
        ctx.appMode === 'practice' ? 'โหมดฝึกซ้อม' : 'โหมดประเมินจริง',
        ctx.enableFeedback ? 'แสดง Feedback' : 'ปิด Feedback',
        ctx.showAnswers ? 'แสดงเฉลย' : 'ซ่อนเฉลยในโหมดครู'
      ].join(' • '),
      outputLabel:
        ctx.outputStructure === 'single-file'
          ? 'เล่นในแชท AI ทันที (ไฟล์ HTML เดียว)'
          : 'โปรเจกต์แยกไฟล์สำหรับ GitHub Pages',
      deliverables: [
        'หน้าเว็บแอปสำหรับนักเรียน (รองรับมือถือ + ภาษาไทย)',
        ctx.useStudentSeed
          ? 'ระบบสร้างโจทย์ตามเลขที่นักเรียน (เปิดซ้ำได้ชุดเดิม)'
          : 'แบบฝึกหัดเรียงลำดับชัดเจน',
        ctx.activityType.isSubjective
          ? 'ตาราง Rubric ประเมินเหตุผล (ไม่ใช้ Keyword Matching อย่างเดียว)'
          : 'ระบบตรวจคำตอบอัตโนมัติพร้อมคำอธิบาย',
        'โหมดครูสำหรับตรวจโจทย์หลายเลขที่ + คู่มือ GitHub Pages'
      ]
    };
  }

  function generatePromptResult(rawState) {
    const { strategies, templates } = getDependencies();
    const state = normalizeState(rawState);
    const validation = validateState(state);
    const strategyInfo = resolveStrategy(state);
    const group = strategies.getGroupById(state.subjectGroup);
    const activityType = strategies.getAssessmentTypeById(state.assessmentType);
    const difficulty = strategies.getDifficultyById(state.difficulty);
    const differentiation = strategies.getDifferentiationById(state.differentiationLevel);

    const ctx = {
      ...state,
      group,
      activityType,
      difficulty,
      differentiation,
      strategy: strategyInfo.strategy,
      appModeLabel:
        state.appMode === 'practice'
          ? 'โหมดฝึกซ้อม (Practice Mode — เน้นเรียนรู้ ทำซ้ำได้)'
          : 'โหมดประเมินจริง (Assessment Mode — ตรวจรวมหลังส่ง)'
    };

    const promptText = validation.isValid ? templates.renderFullPromptText(ctx) : '';
    const simpleSummary = buildSimpleSummary(ctx, validation);
    const lineCount = promptText ? promptText.split('\n').length : 0;

    return {
      state,
      validation,
      strategyInfo,
      simpleSummary,
      promptText,
      stats: {
        charCount: promptText.length,
        lineCount,
        sectionCount: promptText ? 10 : 0
      }
    };
  }

  function getSamplePromptResult() {
    const { strategies } = getDependencies();
    const samplePreset = strategies.PRESETS[0];
    return generatePromptResult(samplePreset.state);
  }

  TPS.engine = {
    createDefaultState,
    normalizeState,
    resolveStrategy,
    validateState,
    generatePromptResult,
    getSamplePromptResult
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TPS.engine;
  }
})(typeof window !== 'undefined' ? window : globalThis);
