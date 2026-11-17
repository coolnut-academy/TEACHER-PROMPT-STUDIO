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
      subject: 'ฟิสิกส์',
      customSubject: '',
      grade: 'ม.4',
      topic: '',
      objectives: '',
      difficulty: 'medium',
      questionCount: 5,
      durationMinutes: 30,
      assessmentType: 'multiple-choice',
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
    let subject = sanitizeSingleLine(input.subject || '');

    if (!subject) {
      subject = group.subjects[0] ? group.subjects[0].id : '__custom__';
    } else if (group.id !== 'custom' && subject !== '__custom__') {
      const existsInGroup = group.subjects.some((s) => s.id === subject);
      if (!existsInGroup) {
        // Preserve unexpected subject values safely as custom subject if needed
        subject = '__custom__';
      }
    }

    const customSubject = sanitizeSingleLine(input.customSubject || '');
    const effectiveSubject =
      group.id === 'custom' || subject === '__custom__'
        ? customSubject
        : subject;

    const strategyModeRaw = String(input.strategyMode || defaults.strategyMode);
    const validStrategyModes = ['auto', 'numerical', 'contextual', 'case-based', 'hybrid'];
    const strategyMode = validStrategyModes.includes(strategyModeRaw) ? strategyModeRaw : 'auto';

    return {
      subjectGroup: group.id,
      subject,
      customSubject,
      effectiveSubject,
      grade: sanitizeSingleLine(input.grade || defaults.grade),
      topic: sanitizeSingleLine(input.topic || ''),
      objectives: sanitizeMultiLine(input.objectives || ''),
      difficulty: String(input.difficulty || defaults.difficulty),
      questionCount: clampInt(input.questionCount, 1, 50, defaults.questionCount),
      durationMinutes: clampInt(input.durationMinutes, 5, 240, defaults.durationMinutes),
      assessmentType: String(input.assessmentType || defaults.assessmentType),
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

    if (!state.grade) {
      missingFields.push({ fieldId: 'gradeSelect', label: 'ระดับชั้น' });
    }

    if (!state.topic) {
      missingFields.push({ fieldId: 'topicInput', label: 'หัวข้อหรือเนื้อหาที่สอน' });
    }

    if (!state.objectives) {
      missingFields.push({ fieldId: 'objectivesInput', label: 'จุดประสงค์การเรียนรู้' });
    }

    const activityType = strategies.getAssessmentTypeById(state.assessmentType);
    const strategyInfo = resolveStrategy(state);

    if (state.appMode === 'assessment' && state.showAnswers) {
      warnings.push({
        id: 'assessment-answers-visible',
        level: 'info',
        message:
          'โหมดประเมินจริงกำลังเปิดแสดงเฉลยหลังส่งคำตอบ — เหมาะกับการเรียนรู้ด้วยตนเอง แต่หากต้องการลดการส่งต่อเฉลยระหว่างคาบ แนะนำให้ปิด "แสดงเฉลย" เพื่อให้ดูเฉพาะในโหมดครู'
      });
    }

    if (activityType.isSubjective && strategyInfo.effectiveStrategyId === 'numerical') {
      warnings.push({
        id: 'subjective-with-numerical',
        level: 'warning',
        message:
          'กิจกรรมที่เลือกเน้นการวิเคราะห์/สถานการณ์ ขณะที่กลยุทธ์เป็นแบบเปลี่ยนตัวเลข (Strategy A) — พิจารณาเลือกกลยุทธ์ B, C หรือ D เพื่อให้สอดคล้องกับรูปแบบคำถามมากขึ้น'
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
        message: `ห้องเรียนขนาด ${state.classSize} คน: Prompt ได้สั่งให้ AI ตรวจสอบคลังสถานการณ์และแจ้งเตือนหากจำนวนชุดที่สร้างได้น้อยกว่าจำนวนนักเรียน`
      });
    }

    if (state.questionCount > 20 && state.durationMinutes < state.questionCount) {
      warnings.push({
        id: 'time-per-question-tight',
        level: 'info',
        message: `เวลาเฉลี่ยต่อข้อน้อยกว่า 1 นาที (${state.durationMinutes} นาที / ${state.questionCount} ข้อ) โปรดตรวจความเหมาะสมกับระดับชั้น`
      });
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings
    };
  }

  function buildSimpleSummary(ctx, validation) {
    return {
      isReady: validation.isValid,
      subjectLabel: ctx.effectiveSubject || 'ยังไม่ระบุรายวิชา',
      groupLabel: ctx.group.label,
      gradeLabel: ctx.grade || 'ยังไม่ระบุระดับชั้น',
      topicLabel: ctx.topic || 'ยังไม่ระบุหัวข้อที่สอน',
      objectivesLabel: ctx.objectives || 'ยังไม่ระบุจุดประสงค์การเรียนรู้',
      workloadLabel: `${ctx.questionCount} ข้อ/ภารกิจ • ${ctx.durationMinutes} นาที • ${ctx.difficulty.label}`,
      activityLabel: `${ctx.activityType.label} (${ctx.activityType.thaiLabel})`,
      strategyLabel: ctx.useStudentSeed
        ? `${ctx.strategy.code}: ${ctx.strategy.name} (${ctx.differentiation.label})`
        : 'ปิด Seed รายบุคคล (ชุดมาตรฐานเดียวกันทั้งห้อง)',
      classScopeLabel: ctx.useStudentSeed
        ? `สร้างและตรวจความซ้ำสำหรับเลขที่ 1–${ctx.classSize}`
        : `รองรับผู้เรียน ${ctx.classSize} คน`,
      feedbackRulesLabel: [
        ctx.appModeLabel,
        ctx.enableFeedback ? 'แสดง Feedback' : 'ปิด Feedback ละเอียด',
        ctx.showAnswers ? 'แสดงเฉลย/แนวคำตอบ' : 'ซ่อนเฉลยไว้ในโหมดครู'
      ].join(' • '),
      outputLabel:
        ctx.outputStructure === 'single-file'
          ? 'ไฟล์ HTML เดียวเปิดใช้ได้ทันที'
          : 'โปรเจกต์แยกไฟล์พร้อมขึ้น GitHub Pages',
      deliverables: [
        'หน้าเว็บแอปสำหรับนักเรียน (Responsive + ภาษาไทย)',
        ctx.useStudentSeed
          ? 'ระบบสุ่ม/เลือกโจทย์กำหนดซ้ำได้จากเลขที่นักเรียน'
          : 'แบบฝึกหัด/กิจกรรมโต้ตอบเรียงลำดับชัดเจน',
        ctx.activityType.isSubjective
          ? 'ตาราง Rubric ประเมินเหตุผล (หลีกเลี่ยง Keyword Matching)'
          : 'ระบบตรวจคำตอบอัตโนมัติพร้อมคำอธิบายวิธีคิด',
        'โหมดครู + ตัวตรวจเลขที่นักเรียน + คำแนะนำ GitHub Pages'
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
