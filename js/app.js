/**
 * Teacher Prompt Studio — Main UI Controller (Mobile-Portrait First & iOS Liquid Glass)
 *
 * Manages 3-step tabbed navigation, form state, LocalStorage draft persistence,
 * presets, real-time Prompt Preview (Full & Simple views), Clipboard Copy,
 * .txt Export, Lucide icon hydration, and accessible modals.
 */
(function (root) {
  'use strict';

  const STORAGE_KEY = 'teacher_prompt_studio_state_v1';

  const strategies = root.TPS && root.TPS.strategies;
  const engine = root.TPS && root.TPS.engine;
  const icons = root.TPS && root.TPS.icons;

  if (!strategies || !engine) {
    return;
  }

  const ACTIVITY_ICONS = {
    'multiple-choice': 'list-checks',
    'short-answer': 'message-square-text',
    'fill-blank': 'text-cursor-input',
    'calculation': 'calculator',
    'scenario': 'compass',
    'case-study': 'folder-search',
    'interactive': 'mouse-pointer-click',
    'mixed': 'layers'
  };

  let appState = engine.createDefaultState();
  let lastResult = null;
  let activeView = 'full'; // 'full' | 'simple'
  let activeStep = 1; // 1 | 2 | 3 (3 = Prompt screen on mobile)
  let undoSnapshot = null;
  let copyFeedbackTimer = null;
  let lastModalTrigger = null;

  const dom = {};

  function cacheDom() {
    dom.form = document.getElementById('promptBuilderForm');
    dom.presetsContainer = document.getElementById('presetsContainer');
    dom.activePresetLabel = document.getElementById('activePresetLabel');

    dom.navStep1Btn = document.getElementById('navStep1Btn');
    dom.navStep2Btn = document.getElementById('navStep2Btn');
    dom.navStep3Btn = document.getElementById('navStep3Btn');
    dom.mobileTabDot = document.getElementById('mobileTabDot');
    dom.step1Pane = document.getElementById('step-1');
    dom.step2Pane = document.getElementById('step-2');

    dom.goToStep2Btn = document.getElementById('goToStep2Btn');
    dom.backToStep1Btn = document.getElementById('backToStep1Btn');
    dom.goToStep3Btn = document.getElementById('goToStep3Btn');

    dom.subjectGroupSelect = document.getElementById('subjectGroupSelect');
    dom.subjectSelect = document.getElementById('subjectSelect');
    dom.customSubjectWrapper = document.getElementById('customSubjectWrapper');
    dom.customSubjectInput = document.getElementById('customSubjectInput');
    dom.gradeSelect = document.getElementById('gradeSelect');
    dom.difficultySelect = document.getElementById('difficultySelect');
    dom.topicInput = document.getElementById('topicInput');
    dom.objectivesInput = document.getElementById('objectivesInput');
    dom.questionCountInput = document.getElementById('questionCountInput');
    dom.durationInput = document.getElementById('durationInput');
    dom.assessmentTypeGrid = document.getElementById('assessmentTypeGrid');

    dom.useStudentSeedCheckbox = document.getElementById('useStudentSeedCheckbox');
    dom.seedDependentControls = document.getElementById('seedDependentControls');
    dom.classSizeInput = document.getElementById('classSizeInput');
    dom.differentiationSelect = document.getElementById('differentiationSelect');
    dom.strategyModeSelect = document.getElementById('strategyModeSelect');
    dom.activeStrategyBadge = document.getElementById('activeStrategyBadge');
    dom.activeStrategyTitle = document.getElementById('activeStrategyTitle');
    dom.activeStrategyDesc = document.getElementById('activeStrategyDesc');

    dom.enableFeedbackCheckbox = document.getElementById('enableFeedbackCheckbox');
    dom.showAnswersCheckbox = document.getElementById('showAnswersCheckbox');
    dom.appModeRadios = document.querySelectorAll('input[name="appMode"]');
    dom.outputStructureRadios = document.querySelectorAll('input[name="outputStructure"]');
    dom.teacherNotesInput = document.getElementById('teacherNotesInput');

    dom.previewSection = document.getElementById('previewSection');
    dom.charCountText = document.getElementById('charCountText');
    dom.lineCountText = document.getElementById('lineCountText');
    dom.readinessBadge = document.getElementById('readinessBadge');
    dom.validationBannerArea = document.getElementById('validationBannerArea');

    dom.tabFullView = document.getElementById('tabFullView');
    dom.tabSimpleView = document.getElementById('tabSimpleView');
    dom.panelFullView = document.getElementById('panelFullView');
    dom.panelSimpleView = document.getElementById('panelSimpleView');

    dom.fullEmptyState = document.getElementById('fullEmptyState');
    dom.promptOutputPre = document.getElementById('promptOutputPre');
    dom.promptOutputCode = document.getElementById('promptOutputCode');
    dom.simpleViewContent = document.getElementById('simpleViewContent');

    dom.copyPromptBtn = document.getElementById('copyPromptBtn');
    dom.copyBtnLabel = document.getElementById('copyBtnLabel');
    dom.downloadTxtBtn = document.getElementById('downloadTxtBtn');
    dom.resetPreviewBtn = document.getElementById('resetPreviewBtn');
    dom.resetAllBtn = document.getElementById('resetAllBtn');

    dom.mobileDockDot = document.getElementById('mobileDockDot');
    dom.mobileStatusText = document.getElementById('mobileStatusText');
    dom.mobileJumpPreviewBtn = document.getElementById('mobileJumpPreviewBtn');
    dom.mobileJumpLabel = document.getElementById('mobileJumpLabel');
    dom.mobileCopyBtn = document.getElementById('mobileCopyBtn');

    dom.openConceptModalBtn = document.getElementById('openConceptModalBtn');
    dom.openSampleModalBtn = document.getElementById('openSampleModalBtn');
    dom.openStrategyExampleBtn = document.getElementById('openStrategyExampleBtn');
    dom.emptyShowSampleBtn = document.getElementById('emptyShowSampleBtn');
    dom.emptyLoadPhysicsBtn = document.getElementById('emptyLoadPhysicsBtn');

    dom.strategyModal = document.getElementById('strategyModal');
    dom.strategyModalBody = document.getElementById('strategyModalBody');
    dom.conceptModal = document.getElementById('conceptModal');
    dom.sampleModal = document.getElementById('sampleModal');
    dom.samplePromptCode = document.getElementById('samplePromptCode');
    dom.applySamplePresetBtn = document.getElementById('applySamplePresetBtn');
    dom.copySampleBtn = document.getElementById('copySampleBtn');

    dom.toastContainer = document.getElementById('toastContainer');
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined && text !== null) {
      node.textContent = String(text);
    }
    return node;
  }

  function createIcon(name, extraClass) {
    if (icons && typeof icons.createIconSvg === 'function') {
      return icons.createIconSvg(name, extraClass);
    }
    return el('span', extraClass || '');
  }

  function replaceButtonIcon(btn, newIconName) {
    if (!btn) {
      return;
    }
    const existingSvg = btn.querySelector('svg.lucide');
    const replacement = createIcon(newIconName);
    if (existingSvg && existingSvg.parentNode) {
      existingSvg.parentNode.replaceChild(replacement, existingSvg);
    }
  }

  function isDesktopViewport() {
    return root.innerWidth >= 1024;
  }

  function setActiveStep(stepNum, options) {
    const opts = options || {};
    let targetStep = Number(stepNum);
    if (isDesktopViewport() && targetStep === 3) {
      targetStep = 2;
    }
    if (targetStep < 1 || targetStep > 3) {
      targetStep = 1;
    }

    activeStep = targetStep;
    document.body.dataset.activeStep = String(activeStep);

    const tabBtns = [
      { btn: dom.navStep1Btn, num: 1 },
      { btn: dom.navStep2Btn, num: 2 },
      { btn: dom.navStep3Btn, num: 3 }
    ];

    tabBtns.forEach(({ btn, num }) => {
      if (!btn) {
        return;
      }
      const isCurrent = num === activeStep;
      btn.classList.toggle('is-active', isCurrent);
      btn.setAttribute('aria-selected', String(isCurrent));
    });

    if (activeStep === 1) {
      dom.step1Pane.hidden = false;
      dom.step2Pane.hidden = true;
    } else if (activeStep === 2) {
      dom.step1Pane.hidden = true;
      dom.step2Pane.hidden = false;
    } else {
      dom.step1Pane.hidden = true;
      dom.step2Pane.hidden = true;
    }

    // Update mobile dock toggle button text & icon
    if (activeStep === 3) {
      dom.mobileJumpLabel.textContent = 'แก้ไข';
      replaceButtonIcon(dom.mobileJumpPreviewBtn, 'pencil');
    } else {
      dom.mobileJumpLabel.textContent = 'ดู Prompt';
      replaceButtonIcon(dom.mobileJumpPreviewBtn, 'eye');
    }

    if (opts.scrollTop !== false) {
      root.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function populateStaticSelects() {
    dom.subjectGroupSelect.textContent = '';
    strategies.SUBJECT_GROUPS.forEach((group) => {
      const option = el('option', '', group.label);
      option.value = group.id;
      dom.subjectGroupSelect.appendChild(option);
    });

    dom.gradeSelect.textContent = '';
    strategies.GRADE_LEVELS.forEach((grade) => {
      const option = el('option', '', grade);
      option.value = grade;
      dom.gradeSelect.appendChild(option);
    });

    dom.difficultySelect.textContent = '';
    strategies.DIFFICULTY_LEVELS.forEach((item) => {
      const option = el('option', '', item.label);
      option.value = item.id;
      dom.difficultySelect.appendChild(option);
    });

    dom.differentiationSelect.textContent = '';
    strategies.DIFFERENTIATION_LEVELS.forEach((item) => {
      const option = el('option', '', item.label);
      option.value = item.id;
      dom.differentiationSelect.appendChild(option);
    });
  }

  function renderPresets() {
    dom.presetsContainer.textContent = '';
    strategies.PRESETS.forEach((preset) => {
      const btn = el('button', 'preset-chip');
      btn.type = 'button';
      btn.dataset.presetId = preset.id;

      btn.appendChild(el('span', 'preset-title', preset.title));
      btn.appendChild(el('span', 'preset-subtitle', preset.subtitle));

      btn.addEventListener('click', () => applyPreset(preset.id));
      dom.presetsContainer.appendChild(btn);
    });
  }

  function renderAssessmentTypes() {
    dom.assessmentTypeGrid.textContent = '';
    strategies.ASSESSMENT_TYPES.forEach((type) => {
      const label = el('label', 'activity-tile');
      label.dataset.typeId = type.id;

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'assessmentType';
      radio.value = type.id;
      radio.id = `activity-${type.id}`;

      const iconWrap = el('span', 'activity-icon-wrap');
      iconWrap.appendChild(createIcon(ACTIVITY_ICONS[type.id] || 'layers'));

      const textWrap = el('span', 'activity-text');
      textWrap.appendChild(el('span', 'activity-thai', type.thaiLabel));
      textWrap.appendChild(el('span', 'activity-en', type.label));

      label.appendChild(radio);
      label.appendChild(iconWrap);
      label.appendChild(textWrap);

      radio.addEventListener('change', () => {
        if (radio.checked) {
          handleFormChange({ markCustom: true });
        }
      });

      dom.assessmentTypeGrid.appendChild(label);
    });
  }

  function updateSubjectOptions(groupId, desiredSubject) {
    const group = strategies.getGroupById(groupId);
    dom.subjectSelect.textContent = '';

    group.subjects.forEach((item) => {
      const option = el('option', '', item.label);
      option.value = item.id;
      dom.subjectSelect.appendChild(option);
    });

    if (group.id !== 'custom') {
      const customOption = el('option', '', 'อื่น ๆ / ระบุชื่อรายวิชาเอง...');
      customOption.value = '__custom__';
      dom.subjectSelect.appendChild(customOption);
    }

    const validValues = Array.from(dom.subjectSelect.options).map((o) => o.value);
    if (desiredSubject && validValues.includes(desiredSubject)) {
      dom.subjectSelect.value = desiredSubject;
    } else if (group.id === 'custom') {
      dom.subjectSelect.value = '__custom__';
    } else {
      dom.subjectSelect.value = validValues[0] || '__custom__';
    }

    const showCustomInput = group.id === 'custom' || dom.subjectSelect.value === '__custom__';
    dom.customSubjectWrapper.classList.toggle('is-hidden', !showCustomInput);
  }

  function syncStateToForm(state) {
    dom.subjectGroupSelect.value = state.subjectGroup;
    updateSubjectOptions(state.subjectGroup, state.subject);
    dom.customSubjectInput.value = state.customSubject;
    dom.gradeSelect.value = state.grade;
    dom.difficultySelect.value = state.difficulty;
    dom.topicInput.value = state.topic;
    dom.objectivesInput.value = state.objectives;
    dom.questionCountInput.value = String(state.questionCount);
    dom.durationInput.value = String(state.durationMinutes);

    const activityRadios = dom.assessmentTypeGrid.querySelectorAll('input[name="assessmentType"]');
    activityRadios.forEach((radio) => {
      const checked = radio.value === state.assessmentType;
      radio.checked = checked;
      const tile = radio.closest('.activity-tile');
      if (tile) {
        tile.classList.toggle('is-selected', checked);
      }
    });

    dom.useStudentSeedCheckbox.checked = state.useStudentSeed;
    dom.seedDependentControls.classList.toggle('is-disabled', !state.useStudentSeed);
    dom.classSizeInput.value = String(state.classSize);
    dom.differentiationSelect.value = state.differentiationLevel;
    dom.strategyModeSelect.value = state.strategyMode;

    dom.enableFeedbackCheckbox.checked = state.enableFeedback;
    dom.showAnswersCheckbox.checked = state.showAnswers;

    dom.appModeRadios.forEach((radio) => {
      radio.checked = radio.value === state.appMode;
    });
    dom.outputStructureRadios.forEach((radio) => {
      radio.checked = radio.value === state.outputStructure;
    });

    dom.teacherNotesInput.value = state.teacherNotes;
    updatePresetHighlight(state.activePresetId);
  }

  function readStateFromForm() {
    const selectedActivity = dom.assessmentTypeGrid.querySelector('input[name="assessmentType"]:checked');
    const selectedAppMode = document.querySelector('input[name="appMode"]:checked');
    const selectedOutput = document.querySelector('input[name="outputStructure"]:checked');

    return {
      subjectGroup: dom.subjectGroupSelect.value,
      subject: dom.subjectSelect.value,
      customSubject: dom.customSubjectInput.value,
      grade: dom.gradeSelect.value,
      difficulty: dom.difficultySelect.value,
      topic: dom.topicInput.value,
      objectives: dom.objectivesInput.value,
      questionCount: dom.questionCountInput.value,
      durationMinutes: dom.durationInput.value,
      assessmentType: selectedActivity ? selectedActivity.value : 'multiple-choice',
      useStudentSeed: dom.useStudentSeedCheckbox.checked,
      classSize: dom.classSizeInput.value,
      differentiationLevel: dom.differentiationSelect.value,
      strategyMode: dom.strategyModeSelect.value,
      enableFeedback: dom.enableFeedbackCheckbox.checked,
      showAnswers: dom.showAnswersCheckbox.checked,
      appMode: selectedAppMode ? selectedAppMode.value : 'practice',
      outputStructure: selectedOutput ? selectedOutput.value : 'single-file',
      teacherNotes: dom.teacherNotesInput.value,
      activePresetId: appState.activePresetId || ''
    };
  }

  function updatePresetHighlight(presetId) {
    const chips = dom.presetsContainer.querySelectorAll('.preset-chip');
    let matchedPreset = null;
    chips.forEach((chip) => {
      const isSelected = Boolean(presetId && chip.dataset.presetId === presetId);
      chip.classList.toggle('is-selected', isSelected);
      if (isSelected) {
        matchedPreset = strategies.PRESETS.find((p) => p.id === presetId);
      }
    });

    if (matchedPreset) {
      dom.activePresetLabel.textContent = matchedPreset.badge;
      dom.activePresetLabel.classList.add('is-preset');
    } else {
      dom.activePresetLabel.textContent = 'กำหนดเอง';
      dom.activePresetLabel.classList.remove('is-preset');
    }
  }

  function clearInvalidHighlights() {
    const invalidInputs = dom.form.querySelectorAll('.is-invalid');
    invalidInputs.forEach((node) => node.classList.remove('is-invalid'));
  }

  function markInvalidFields(missingFields) {
    clearInvalidHighlights();
    missingFields.forEach((item) => {
      const target = document.getElementById(item.fieldId);
      if (target) {
        target.classList.add('is-invalid');
      }
    });
  }

  function renderValidationBanners(validation) {
    dom.validationBannerArea.textContent = '';

    if (!validation.isValid) {
      const missingBox = el('div', 'alert-box alert-missing');
      missingBox.appendChild(el('strong', '', 'กรุณากรอกข้อมูลที่จำเป็น:'));

      const chips = el('div', 'missing-chips');
      validation.missingFields.forEach((field) => {
        const chipBtn = el('button', 'missing-chip', `+ ${field.label}`);
        chipBtn.type = 'button';
        chipBtn.addEventListener('click', () => focusFormField(field.fieldId));
        chips.appendChild(chipBtn);
      });
      missingBox.appendChild(chips);
      dom.validationBannerArea.appendChild(missingBox);
    }

    validation.warnings.forEach((warn) => {
      const warnBox = el('div', 'alert-box alert-info', warn.message);
      dom.validationBannerArea.appendChild(warnBox);
    });
  }

  function renderSimpleView(summary, result) {
    dom.simpleViewContent.textContent = '';

    const items = [
      {
        label: 'รายวิชาและเป้าหมายการเรียนรู้',
        value: `${summary.subjectLabel} • ${summary.gradeLabel} (${summary.groupLabel})`,
        sub: `หัวข้อ: ${summary.topicLabel} | จุดประสงค์: ${summary.objectivesLabel}`
      },
      {
        label: 'รูปแบบกิจกรรมและปริมาณงาน',
        value: summary.activityLabel,
        sub: summary.workloadLabel
      },
      {
        label: 'กลยุทธ์สร้างโจทย์เฉพาะบุคคล',
        value: summary.strategyLabel,
        sub: summary.classScopeLabel
      },
      {
        label: 'เกณฑ์การประเมินและผลลัพธ์โค้ด',
        value: summary.feedbackRulesLabel,
        sub: `รูปแบบโค้ด: ${summary.outputLabel}`
      }
    ];

    items.forEach((item) => {
      const card = el('div', 'simple-card');
      card.appendChild(el('div', 'simple-card-label', item.label));
      card.appendChild(el('div', 'simple-card-value', item.value));
      card.appendChild(el('div', 'simple-card-sub', item.sub));
      dom.simpleViewContent.appendChild(card);
    });

    const checklistCard = el('div', 'simple-card');
    checklistCard.appendChild(
      el('div', 'simple-card-label', 'สิ่งที่ AI ปลายทางจะสร้างให้เมื่อนำ Prompt ไปใช้')
    );
    const list = el('ul', 'simple-checklist');
    summary.deliverables.forEach((line) => {
      list.appendChild(el('li', '', line));
    });
    checklistCard.appendChild(list);
    dom.simpleViewContent.appendChild(checklistCard);

    if (!result.validation.isValid) {
      const statusCard = el('div', 'simple-card');
      statusCard.appendChild(el('div', 'simple-card-label', 'สถานะความพร้อม'));
      statusCard.appendChild(
        el(
          'div',
          'simple-card-sub',
          'กรอกหัวข้อที่สอนและจุดประสงค์การเรียนรู้ในขั้นที่ 1 ให้ครบ ระบบจะแสดง Prompt ฉบับเต็มทันที'
        )
      );
      dom.simpleViewContent.appendChild(statusCard);
    }
  }

  function updateStrategyInsight(result) {
    const { strategyInfo, state } = result;
    const strat = strategyInfo.strategy;
    dom.activeStrategyBadge.textContent = strat.code;
    dom.activeStrategyTitle.textContent = strategyInfo.isAuto
      ? `${strat.name} (แนะนำอัตโนมัติ)`
      : strat.name;
    dom.activeStrategyDesc.textContent = state.useStudentSeed
      ? strat.shortDesc
      : 'ปิดใช้เลขที่นักเรียน — ระบบจะสร้างชุดกิจกรรมมาตรฐานเดียวกันทั้งห้อง';
  }

  function updatePreview(result) {
    lastResult = result;
    const { validation, stats, promptText, simpleSummary } = result;

    dom.seedDependentControls.classList.toggle('is-disabled', !result.state.useStudentSeed);
    updateStrategyInsight(result);

    const activityTiles = dom.assessmentTypeGrid.querySelectorAll('.activity-tile');
    activityTiles.forEach((tile) => {
      tile.classList.toggle('is-selected', tile.dataset.typeId === result.state.assessmentType);
    });

    dom.charCountText.textContent = `${stats.charCount.toLocaleString('th-TH')} ตัวอักษร`;
    dom.lineCountText.textContent = `${stats.lineCount.toLocaleString('th-TH')} บรรทัด`;

    if (validation.isValid) {
      dom.readinessBadge.textContent = 'พร้อมคัดลอกใช้งาน';
      dom.readinessBadge.classList.remove('is-incomplete');
      dom.readinessBadge.classList.add('is-ready');
      dom.mobileTabDot.classList.add('is-ready');
      dom.mobileDockDot.classList.add('is-ready');
      dom.mobileStatusText.textContent = `พร้อมใช้งาน • ${stats.charCount.toLocaleString('th-TH')} ตัวอักษร`;
      clearInvalidHighlights();
    } else {
      dom.readinessBadge.textContent = `รอข้อมูล ${validation.missingFields.length} ช่อง`;
      dom.readinessBadge.classList.remove('is-ready');
      dom.readinessBadge.classList.add('is-incomplete');
      dom.mobileTabDot.classList.remove('is-ready');
      dom.mobileDockDot.classList.remove('is-ready');
      dom.mobileStatusText.textContent = `รอข้อมูล ${validation.missingFields.length} ช่อง`;
    }

    renderValidationBanners(validation);

    if (validation.isValid && promptText) {
      dom.fullEmptyState.classList.add('is-hidden');
      dom.promptOutputPre.classList.remove('is-hidden');
      dom.promptOutputCode.textContent = promptText;
    } else {
      dom.fullEmptyState.classList.remove('is-hidden');
      dom.promptOutputPre.classList.add('is-hidden');
      dom.promptOutputCode.textContent = '';
    }

    renderSimpleView(simpleSummary, result);
  }

  function saveStateToStorage(state) {
    try {
      root.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_err) {
      // Ignore storage errors in sandboxed/private modes
    }
  }

  function loadStateFromStorage() {
    try {
      const raw = root.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (_err) {
      return null;
    }
  }

  function clearStateFromStorage() {
    try {
      root.localStorage.removeItem(STORAGE_KEY);
    } catch (_err) {
      // Ignore storage errors
    }
  }

  function handleFormChange(options) {
    const opts = options || {};
    if (opts.markCustom) {
      appState.activePresetId = '';
    }

    const raw = readStateFromForm();
    const result = engine.generatePromptResult(raw);
    appState = result.state;
    updatePresetHighlight(appState.activePresetId);
    updatePreview(result);
    saveStateToStorage(appState);
  }

  function applyPreset(presetId) {
    const preset = strategies.PRESETS.find((p) => p.id === presetId);
    if (!preset) {
      return;
    }

    appState = engine.normalizeState({
      ...preset.state,
      activePresetId: preset.id
    });

    syncStateToForm(appState);
    const result = engine.generatePromptResult(appState);
    updatePreview(result);
    saveStateToStorage(appState);
    showToast(`โหลด ${preset.title} แล้ว — ปรับแก้ต่อได้ทันที`);
  }

  function resetAllData() {
    undoSnapshot = { ...appState };
    appState = engine.createDefaultState();
    syncStateToForm(appState);
    clearInvalidHighlights();
    const result = engine.generatePromptResult(appState);
    updatePreview(result);
    clearStateFromStorage();

    showToast('ล้างข้อมูลทั้งหมดแล้ว', {
      undoLabel: 'เลิกทำ',
      onUndo: () => {
        if (!undoSnapshot) {
          return;
        }
        appState = engine.normalizeState(undoSnapshot);
        syncStateToForm(appState);
        const restored = engine.generatePromptResult(appState);
        updatePreview(restored);
        saveStateToStorage(appState);
        undoSnapshot = null;
        showToast('คืนค่าข้อมูลก่อนหน้าแล้ว');
      }
    });
  }

  function focusFormField(fieldId) {
    const elTarget = document.getElementById(fieldId);
    if (!elTarget) {
      return;
    }

    const ownerPane = elTarget.closest('.step-pane');
    if (ownerPane && ownerPane.id === 'step-2') {
      setActiveStep(2, { scrollTop: false });
    } else {
      setActiveStep(1, { scrollTop: false });
    }

    setTimeout(() => {
      elTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        elTarget.focus({ preventScroll: true });
      }, 180);
    }, 40);
  }

  function ensureReadyOrWarn() {
    if (!lastResult) {
      handleFormChange();
    }
    if (lastResult.validation.isValid && lastResult.promptText) {
      return true;
    }
    const missing = lastResult.validation.missingFields;
    markInvalidFields(missing);
    if (missing.length > 0) {
      focusFormField(missing[0].fieldId);
      const names = missing.map((m) => m.label).join(', ');
      showToast(`กรุณากรอกข้อมูลที่จำเป็นก่อน: ${names}`, { variant: 'warning' });
    }
    return false;
  }

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (_err) {
      copied = false;
    }
    document.body.removeChild(textarea);
    return copied;
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_err) {
        return fallbackCopyText(text);
      }
    }
    return fallbackCopyText(text);
  }

  async function handleCopyPrompt() {
    if (!ensureReadyOrWarn()) {
      return;
    }
    const ok = await copyTextToClipboard(lastResult.promptText);
    if (!ok) {
      showToast('ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาคัดลอกจากกล่อง Prompt โดยตรง', {
        variant: 'warning'
      });
      return;
    }

    dom.copyPromptBtn.classList.add('is-copied');
    dom.copyBtnLabel.textContent = 'คัดลอก Prompt แล้ว!';
    replaceButtonIcon(dom.copyPromptBtn, 'check');

    clearTimeout(copyFeedbackTimer);
    copyFeedbackTimer = setTimeout(() => {
      dom.copyPromptBtn.classList.remove('is-copied');
      dom.copyBtnLabel.textContent = 'คัดลอก Prompt';
      replaceButtonIcon(dom.copyPromptBtn, 'copy');
    }, 2200);

    showToast('คัดลอก Prompt ฉบับเต็มแล้ว — พร้อมวางใน AI ของคุณ');
  }

  function buildDownloadFilename(state) {
    const rawSubject = state.effectiveSubject || 'prompt';
    const safeSubject = rawSubject
      .replace(/[\\/:*?"<>|\s]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
    const safeGrade = (state.grade || '')
      .replace(/[\\/:*?"<>|\s]+/g, '')
      .slice(0, 15);
    const parts = ['teacher-prompt', safeSubject || 'custom', safeGrade].filter(Boolean);
    return `${parts.join('-')}.txt`;
  }

  function handleDownloadTxt() {
    if (!ensureReadyOrWarn()) {
      return;
    }
    const filename = buildDownloadFilename(lastResult.state);
    const blob = new Blob([lastResult.promptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`ดาวน์โหลด ${filename} แล้ว`);
  }

  function switchPreviewView(viewName) {
    activeView = viewName === 'simple' ? 'simple' : 'full';
    const isFull = activeView === 'full';

    dom.tabFullView.classList.toggle('is-active', isFull);
    dom.tabFullView.setAttribute('aria-selected', String(isFull));
    dom.tabSimpleView.classList.toggle('is-active', !isFull);
    dom.tabSimpleView.setAttribute('aria-selected', String(!isFull));

    dom.panelFullView.hidden = !isFull;
    dom.panelSimpleView.hidden = isFull;
  }

  function openModal(modalEl, triggerEl) {
    if (!modalEl) {
      return;
    }
    lastModalTrigger = triggerEl || document.activeElement;
    modalEl.hidden = false;
    const closeBtn = modalEl.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeModal(modalEl) {
    if (!modalEl || modalEl.hidden) {
      return;
    }
    modalEl.hidden = true;
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
      lastModalTrigger.focus();
    }
  }

  function openStrategyExampleModal(triggerEl) {
    const current = lastResult || engine.generatePromptResult(appState);
    const { state, strategyInfo } = current;
    const group = strategies.getGroupById(state.subjectGroup);
    const strat = strategyInfo.strategy;

    dom.strategyModalBody.textContent = '';

    const intro = el(
      'p',
      '',
      `สำหรับรายวิชา "${state.effectiveSubject || group.label}" (${
        strategies.getAssessmentTypeById(state.assessmentType).thaiLabel
      }) ระบบใช้:`
    );
    dom.strategyModalBody.appendChild(intro);

    const badgeLine = el('div', 'strategy-glass-pill');
    badgeLine.appendChild(el('span', 'strategy-badge', strat.code));
    const pillCopy = el('div', 'strategy-pill-copy');
    pillCopy.appendChild(el('strong', '', strat.thaiName));
    pillCopy.appendChild(el('p', 'strategy-insight-desc', strat.shortDesc));
    badgeLine.appendChild(pillCopy);
    dom.strategyModalBody.appendChild(badgeLine);

    if (state.topic) {
      dom.strategyModalBody.appendChild(
        el('p', '', `หัวข้อที่กำลังออกแบบ: "${state.topic}" (ระดับชั้น ${state.grade})`)
      );
    }

    const matchedSubject = group.subjects.find(
      (s) => s.id === state.effectiveSubject || s.id === state.subject
    );
    let samplePair = strat.sampleVariation;
    if (matchedSubject && matchedSubject.sampleVariation && matchedSubject.strategy === strat.id) {
      samplePair = matchedSubject.sampleVariation;
    } else if (
      group.sampleVariation &&
      (strat.id === group.defaultStrategy ||
        (matchedSubject &&
          matchedSubject.strategy === strat.id &&
          group.id === 'science' &&
          strat.id === 'numerical'))
    ) {
      samplePair = group.sampleVariation;
    }

    const compareGrid = el('div', 'strategy-compare-grid');
    const card1 = el('div', 'student-sample-card');
    card1.appendChild(el('h4', '', 'ตัวอย่างนักเรียนเลขที่ 1'));
    card1.appendChild(el('p', '', samplePair.student1));

    const card2 = el('div', 'student-sample-card');
    card2.appendChild(el('h4', '', 'ตัวอย่างนักเรียนเลขที่ 2'));
    card2.appendChild(el('p', '', samplePair.student2));

    compareGrid.appendChild(card1);
    compareGrid.appendChild(card2);
    dom.strategyModalBody.appendChild(compareGrid);

    dom.strategyModalBody.appendChild(
      el('h3', 'modal-list-heading', 'หลักการตรวจสอบที่ AI จะใส่ให้ในเว็บแอป')
    );

    const ul = el('ul', 'simple-checklist');
    strat.principles.forEach((p) => ul.appendChild(el('li', '', p)));
    ul.appendChild(
      el(
        'li',
        '',
        `ตรวจสอบความซ้ำและเฉลยครอบคลุมเลขที่ 1 ถึง ${state.classSize} และเตือนครูตรวจทานก่อนใช้จริง`
      )
    );
    dom.strategyModalBody.appendChild(ul);

    openModal(dom.strategyModal, triggerEl);
  }

  function openSamplePromptModal(triggerEl) {
    const sample = engine.getSamplePromptResult();
    dom.samplePromptCode.textContent = sample.promptText;
    openModal(dom.sampleModal, triggerEl);
  }

  function showToast(message, options) {
    const opts = options || {};
    const toast = el('div', 'toast');
    if (opts.variant === 'warning') {
      toast.classList.add('toast-warning');
    }
    toast.appendChild(el('span', '', message));

    if (opts.undoLabel && typeof opts.onUndo === 'function') {
      const undoBtn = el('button', 'toast-undo-btn', opts.undoLabel);
      undoBtn.type = 'button';
      undoBtn.addEventListener('click', () => {
        opts.onUndo();
        toast.remove();
      });
      toast.appendChild(undoBtn);
    }

    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, opts.onUndo ? 6000 : 3400);
  }

  function bindEvents() {
    // Segmented step switcher
    [dom.navStep1Btn, dom.navStep2Btn, dom.navStep3Btn].forEach((btn) => {
      if (!btn) {
        return;
      }
      btn.addEventListener('click', () => {
        setActiveStep(Number(btn.dataset.stepTab));
      });
    });

    dom.goToStep2Btn.addEventListener('click', () => setActiveStep(2));
    dom.backToStep1Btn.addEventListener('click', () => setActiveStep(1));
    dom.goToStep3Btn.addEventListener('click', () => {
      if (isDesktopViewport()) {
        dom.previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (lastResult && lastResult.validation.isValid) {
          showToast('Prompt พร้อมคัดลอกทางด้านขวาแล้ว');
        } else {
          ensureReadyOrWarn();
        }
      } else {
        setActiveStep(3);
      }
    });

    dom.mobileJumpPreviewBtn.addEventListener('click', () => {
      if (activeStep === 3) {
        setActiveStep(1);
      } else {
        setActiveStep(3);
      }
    });

    // Ensure desktop resize from Mobile Step 3 never hides builder column
    if (typeof root.matchMedia === 'function') {
      const desktopQuery = root.matchMedia('(min-width: 1024px)');
      const handleViewportChange = (e) => {
        if (e.matches && activeStep === 3) {
          setActiveStep(2, { scrollTop: false });
        }
      };
      if (typeof desktopQuery.addEventListener === 'function') {
        desktopQuery.addEventListener('change', handleViewportChange);
      }
    }

    dom.subjectGroupSelect.addEventListener('change', () => {
      updateSubjectOptions(dom.subjectGroupSelect.value, '');
      handleFormChange({ markCustom: true });
    });

    dom.subjectSelect.addEventListener('change', () => {
      const showCustom =
        dom.subjectGroupSelect.value === 'custom' || dom.subjectSelect.value === '__custom__';
      dom.customSubjectWrapper.classList.toggle('is-hidden', !showCustom);
      handleFormChange({ markCustom: true });
      if (showCustom) {
        dom.customSubjectInput.focus();
      }
    });

    const liveInputFields = [
      dom.customSubjectInput,
      dom.gradeSelect,
      dom.difficultySelect,
      dom.topicInput,
      dom.objectivesInput,
      dom.questionCountInput,
      dom.durationInput,
      dom.useStudentSeedCheckbox,
      dom.classSizeInput,
      dom.differentiationSelect,
      dom.strategyModeSelect,
      dom.enableFeedbackCheckbox,
      dom.showAnswersCheckbox,
      dom.teacherNotesInput
    ];

    liveInputFields.forEach((field) => {
      const eventName =
        field.tagName === 'SELECT' || field.type === 'checkbox' ? 'change' : 'input';
      field.addEventListener(eventName, () => handleFormChange({ markCustom: true }));
      if (eventName === 'input') {
        field.addEventListener('change', () => handleFormChange({ markCustom: true }));
      }
    });

    dom.appModeRadios.forEach((radio) => {
      radio.addEventListener('change', () => handleFormChange({ markCustom: true }));
    });
    dom.outputStructureRadios.forEach((radio) => {
      radio.addEventListener('change', () => handleFormChange({ markCustom: true }));
    });

    dom.tabFullView.addEventListener('click', () => switchPreviewView('full'));
    dom.tabSimpleView.addEventListener('click', () => switchPreviewView('simple'));

    dom.copyPromptBtn.addEventListener('click', handleCopyPrompt);
    dom.mobileCopyBtn.addEventListener('click', handleCopyPrompt);
    dom.downloadTxtBtn.addEventListener('click', handleDownloadTxt);

    dom.resetAllBtn.addEventListener('click', resetAllData);
    dom.resetPreviewBtn.addEventListener('click', resetAllData);

    dom.openConceptModalBtn.addEventListener('click', () =>
      openModal(dom.conceptModal, dom.openConceptModalBtn)
    );
    dom.openSampleModalBtn.addEventListener('click', () =>
      openSamplePromptModal(dom.openSampleModalBtn)
    );
    dom.emptyShowSampleBtn.addEventListener('click', () =>
      openSamplePromptModal(dom.emptyShowSampleBtn)
    );
    dom.emptyLoadPhysicsBtn.addEventListener('click', () => applyPreset('preset-physics'));
    dom.openStrategyExampleBtn.addEventListener('click', () =>
      openStrategyExampleModal(dom.openStrategyExampleBtn)
    );

    dom.applySamplePresetBtn.addEventListener('click', () => {
      applyPreset('preset-physics');
      closeModal(dom.sampleModal);
    });

    dom.copySampleBtn.addEventListener('click', async () => {
      const sample = engine.getSamplePromptResult();
      const ok = await copyTextToClipboard(sample.promptText);
      if (ok) {
        showToast('คัดลอกตัวอย่าง Prompt แล้ว');
      }
    });

    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.dataset.closeModal);
        closeModal(modal);
      });
    });

    [dom.strategyModal, dom.conceptModal, dom.sampleModal].forEach((backdrop) => {
      backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
          closeModal(backdrop);
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        [dom.strategyModal, dom.conceptModal, dom.sampleModal].forEach((modal) => {
          if (!modal.hidden) {
            closeModal(modal);
          }
        });
      }
    });

    dom.form.addEventListener('submit', (event) => {
      event.preventDefault();
      handleCopyPrompt();
    });
  }

  function init() {
    cacheDom();
    if (icons && typeof icons.hydrateIcons === 'function') {
      icons.hydrateIcons(document);
    }

    populateStaticSelects();
    renderPresets();
    renderAssessmentTypes();

    const saved = loadStateFromStorage();
    appState = saved ? engine.normalizeState(saved) : engine.createDefaultState();

    syncStateToForm(appState);
    const initialResult = engine.generatePromptResult(appState);
    updatePreview(initialResult);
    setActiveStep(1, { scrollTop: false });
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
