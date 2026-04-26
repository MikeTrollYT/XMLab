// ─── STATE ───────────────────────────────────────────────────────────────────
let currentSection = 'xml';
let currentIdx = 0;

const solvedBySection = {
  xml: new Set(JSON.parse(localStorage.getItem('xml_solved') || '[]')),
  xsd: new Set(JSON.parse(localStorage.getItem('xsd_solved') || '[]')),
  xpath: new Set(JSON.parse(localStorage.getItem('xpath_solved') || '[]')),
  xquery: new Set(JSON.parse(localStorage.getItem('xquery_solved') || '[]')),
};

const userCodeBySection = {
  xml: {},
  xsd: {},
  xpath: {},
  xquery: {},
};

const queryResultBySection = {
  xpath: {},
  xquery: {},
};

// ─── INIT ────────────────────────────────────────────────────────────────────
function init() {
  updateSectionUi();
  renderSidebar();
  loadExercise(0);
  const editor = document.getElementById('editor');
  editor.addEventListener('input', onEditorInput);
  editor.addEventListener('keydown', handleEditorKeydown);
  editor.addEventListener('scroll', syncLineNumsScroll);
}

function getActiveExercises() {
  if (currentSection === 'xsd') {
    return xsdExercises;
  }
  if (currentSection === 'xpath') {
    return xpathExercises;
  }
  if (currentSection === 'xquery') {
    return xqueryExercises;
  }
  return exercises;
}

function getActiveSolvedSet() {
  return solvedBySection[currentSection];
}

function persistSolved(section) {
  localStorage.setItem(`${section}_solved`, JSON.stringify([...solvedBySection[section]]));
}

function getEditorExtension() {
  if (currentSection === 'xsd') {
    return 'xsd';
  }
  if (currentSection === 'xpath') {
    return 'xpath';
  }
  if (currentSection === 'xquery') {
    return 'xquery';
  }
  return 'xml';
}

function updateSectionUi() {
  const navXml = document.getElementById('nav-xml');
  const navXsd = document.getElementById('nav-xsd');
  const navXpath = document.getElementById('nav-xpath');
  const navXquery = document.getElementById('nav-xquery');
  const navPlayground = document.getElementById('nav-playground');
  const sidebarTitle = document.getElementById('sidebar-title');
  const sidebarSub = document.getElementById('sidebar-sub');
  const sourcePanel = document.getElementById('source-panel');
  const xpathResultPanel = document.getElementById('xpath-result-panel');
  const queryResultTitle = document.getElementById('query-result-title');
  const editor = document.getElementById('editor');
  const appBody = document.querySelector('.app-body');
  const playgroundPanel = document.getElementById('playground-panel');
  const progressBarHeader = document.querySelector('.progress-bar-header');

  document.body.dataset.section = currentSection;

  navXml.classList.toggle('active', currentSection === 'xml');
  navXsd.classList.toggle('active', currentSection === 'xsd');
  navXpath.classList.toggle('active', currentSection === 'xpath');
  navXquery.classList.toggle('active', currentSection === 'xquery');
  if (navPlayground) {
    navPlayground.classList.toggle('active', currentSection === 'playground');
  }

  if (appBody && playgroundPanel) {
    const inPlayground = currentSection === 'playground';
    appBody.classList.toggle('playground-only', inPlayground);
    playgroundPanel.hidden = !inPlayground;
    if (progressBarHeader) {
      progressBarHeader.style.display = inPlayground ? 'none' : 'flex';
    }
  }

  if (currentSection === 'playground') {
    closeFeedback();
    if (window.playgroundController && typeof window.playgroundController.onSectionEnter === 'function') {
      window.playgroundController.onSectionEnter();
    }
    return;
  }

  if (currentSection === 'xsd') {
    sidebarTitle.textContent = 'XSD — Ejercicios';
    sidebarSub.textContent = 'Esquemas y validación';
    sourcePanel.hidden = false;
    xpathResultPanel.hidden = true;
    xpathResultPanel.style.display = 'none';
    editor.placeholder = '<!-- Escribe tu XSD aquí -->';
  } else if (currentSection === 'xquery') {
    sidebarTitle.textContent = 'XQuery — Ejercicios';
    sidebarSub.textContent = 'Consultas FLWOR y funciones';
    sourcePanel.hidden = false;
    xpathResultPanel.hidden = false;
    xpathResultPanel.style.display = 'flex';
    queryResultTitle.textContent = 'Resultado XQuery';
    editor.placeholder = 'for $p in doc("tienda.xml")/...';
  } else if (currentSection === 'xpath') {
    sidebarTitle.textContent = 'XPath — Ejercicios';
    sidebarSub.textContent = 'Consultas y selección de nodos';
    sourcePanel.hidden = false;
    xpathResultPanel.hidden = false;
    xpathResultPanel.style.display = 'flex';
    queryResultTitle.textContent = 'Resultado XPath';
    editor.placeholder = '/biblioteca/...';
  } else {
    sidebarTitle.textContent = 'XML — Ejercicios';
    sidebarSub.textContent = 'Estructura y marcado';
    sourcePanel.hidden = true;
    xpathResultPanel.hidden = true;
    xpathResultPanel.style.display = 'none';
    editor.placeholder = '<!-- Escribe tu XML aquí -->';
  }
}

function renderSidebar() {
  const list = document.getElementById('ex-list');
  const activeExercises = getActiveExercises();
  const activeSolved = getActiveSolvedSet();
  list.innerHTML = '';
  activeExercises.forEach((ex, i) => {
    const div = document.createElement('div');
    div.className = 'ex-item' + (i === currentIdx ? ' active' : '');
    div.onclick = () => loadExercise(i);

    const statusClass = activeSolved.has(i) ? 'done' : '';
    const statusIcon = activeSolved.has(i) ? '✓' : '';

    div.innerHTML = `
      <span class="ex-num">${String(ex.id).padStart(2,'0')}</span>
      <div class="ex-info">
        <div class="ex-name">${ex.title}</div>
        <div class="ex-tag">${ex.tag}</div>
      </div>
      <div class="ex-status ${statusClass}">${statusIcon}</div>
    `;
    list.appendChild(div);
  });
  updateProgress();
}

function updateProgress() {
  const activeExercises = getActiveExercises();
  const activeSolved = getActiveSolvedSet();
  const total = activeExercises.length;
  const done = activeSolved.size;
  document.getElementById('prog-label').textContent = `${done} / ${total}`;
  document.getElementById('prog-fill').style.width = `${(done/total)*100}%`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadExercise(idx) {
  const activeExercises = getActiveExercises();
  currentIdx = idx;
  const ex = activeExercises[idx];

  // header
  document.getElementById('ex-pill').textContent = `${currentSection.toUpperCase()} · ${String(ex.id).padStart(2,'0')}`;
  document.getElementById('ex-title').textContent = ex.title;
  document.getElementById('ex-desc').innerHTML = ex.desc;
  document.getElementById('ed-filename').textContent = `ejercicio_${String(ex.id).padStart(2,'0')}.${getEditorExtension()}`;
  document.getElementById('ex-counter').textContent = `${idx+1} / ${activeExercises.length}`;

  // source preview (xsd/xpath/xquery)
  const sourceTitle = document.getElementById('source-title');
  const sourceXml = document.getElementById('source-xml');
  if (currentSection === 'xsd' || currentSection === 'xpath' || currentSection === 'xquery') {
    const label = currentSection === 'xsd' ? 'XML del ejercicio' : 'XML base para consultas';
    sourceTitle.textContent = `XML del ejercicio ${String(ex.id).padStart(2, '0')}`;
    if (currentSection === 'xpath' || currentSection === 'xquery') {
      sourceTitle.textContent = label;
    }
    sourceXml.textContent = ex.sourceXml || 'Sin XML de referencia para este ejercicio.';
  }

  if (currentSection !== 'xpath' && currentSection !== 'xquery') {
    clearXPathResultPanel();
  } else {
    restoreStoredQueryResult(idx);
  }

  // requirements
  const reqs = document.getElementById('ex-reqs');
  reqs.innerHTML = ex.requirements.map(r =>
    `<span class="req-tag">${escapeHtml(r.label)}: <b>${escapeHtml(r.detail)}</b></span>`
  ).join('');

  // editor
  const editor = document.getElementById('editor');
  editor.value = userCodeBySection[currentSection][idx] ?? '';
  updateLineNums();
  updateIndentGuides();

  // nav buttons
  document.getElementById('btn-prev').disabled = idx === 0;
  document.getElementById('btn-next').disabled = idx === activeExercises.length - 1;

  // hint
  document.getElementById('hint-panel').classList.remove('show');

  // sidebar
  renderSidebar();
  closeFeedback();
}

function onEditorInput() {
  userCodeBySection[currentSection][currentIdx] = document.getElementById('editor').value;
  updateLineNums();
  updateIndentGuides();
}

function updateLineNums() {
  const lines = (document.getElementById('editor').value.match(/\n/g) || []).length + 1;
  document.getElementById('line-nums').innerHTML =
    Array.from({length: lines}, (_, i) => i+1).join('<br>');
  syncLineNumsScroll();
}

function syncLineNumsScroll() {
  const editor = document.getElementById('editor');
  const lineNums = document.getElementById('line-nums');
  lineNums.scrollTop = editor.scrollTop;
  syncIndentGuidesScroll();
}

function syncIndentGuidesScroll() {
  const editor = document.getElementById('editor');
  const guides = document.getElementById('indent-guides');
  if (!editor || !guides) {
    return;
  }

  guides.style.transform = `translate(${-editor.scrollLeft}px, ${-editor.scrollTop}px)`;
}

function updateIndentGuides() {
  const guides = document.getElementById('indent-guides');
  const editor = document.getElementById('editor');
  if (!guides || !editor) {
    return;
  }

  guides.innerHTML = '';

  if (currentSection !== 'xml' && currentSection !== 'xsd') {
    syncIndentGuidesScroll();
    return;
  }

  const value = editor.value || '';
  if (!value) {
    syncIndentGuidesScroll();
    return;
  }

  const styles = getComputedStyle(editor);
  const lineHeight = parseFloat(styles.lineHeight) || 21;
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const paddingLeft = parseFloat(styles.paddingLeft) || 0;
  const fontSize = parseFloat(styles.fontSize) || 13;
  const tabSize = parseInt(styles.tabSize || '2', 10) || 2;
  const tabPx = fontSize * 0.61 * tabSize;

  const lines = value.split('\n');
  const indentByLine = lines.map((line) => {
    if (!line.trim()) {
      return 0;
    }
    const leading = (line.match(/^[\t ]*/) || [''])[0];
    const columns = leading.split('').reduce((acc, ch) => acc + (ch === '\t' ? tabSize : 1), 0);
    return Math.floor(columns / tabSize);
  });

  const maxLevel = Math.max(...indentByLine, 0);
  if (!maxLevel) {
    syncIndentGuidesScroll();
    return;
  }

  for (let level = 1; level <= maxLevel; level += 1) {
    let start = -1;
    for (let i = 0; i <= indentByLine.length; i += 1) {
      const hasLevel = i < indentByLine.length && indentByLine[i] >= level;
      if (hasLevel && start === -1) {
        start = i;
        continue;
      }

      if (!hasLevel && start !== -1) {
        const end = i - 1;
        const segment = document.createElement('div');
        segment.className = 'indent-guide-segment';
        segment.style.left = `${paddingLeft + level * tabPx}px`;
        segment.style.top = `${paddingTop + start * lineHeight + 2}px`;
        segment.style.height = `${Math.max(2, (end - start + 1) * lineHeight - 4)}px`;
        guides.appendChild(segment);
        start = -1;
      }
    }
  }

  syncIndentGuidesScroll();
}

function handleEditorKeydown(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const ta = e.target;
    const s = ta.selectionStart, end = ta.selectionEnd;
    ta.value = ta.value.substring(0,s) + '  ' + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = s + 2;
    onEditorInput();
    return;
  }

  // Keep indentation level on the next line for XML/XSD editors.
  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
    if (currentSection !== 'xml' && currentSection !== 'xsd') {
      return;
    }

    e.preventDefault();
    const ta = e.target;
    const s = ta.selectionStart;
    const end = ta.selectionEnd;
    const content = ta.value;

    const lineStart = content.lastIndexOf('\n', s - 1) + 1;
    const linePrefix = content.slice(lineStart, s);
    const indent = (linePrefix.match(/^[\t ]*/) || [''])[0];
    const insertion = `\n${indent}`;

    ta.value = content.slice(0, s) + insertion + content.slice(end);
    const caretPos = s + insertion.length;
    ta.selectionStart = ta.selectionEnd = caretPos;
    onEditorInput();
  }
}

function navigate(dir) {
  const activeExercises = getActiveExercises();
  const next = currentIdx + dir;
  if (next >= 0 && next < activeExercises.length) loadExercise(next);
}

function resetEditor() {
  userCodeBySection[currentSection][currentIdx] = '';
  document.getElementById('editor').value = '';
  updateLineNums();
  if (currentSection === 'xpath' || currentSection === 'xquery') {
    delete queryResultBySection[currentSection][currentIdx];
    clearXPathResultPanel();
  }
  closeFeedback();
}

function toggleHint() {
  const panel = document.getElementById('hint-panel');
  const activeExercises = getActiveExercises();
  if (panel.classList.contains('show')) {
    panel.classList.remove('show');
  } else {
    panel.textContent = '💡 ' + activeExercises[currentIdx].hint;
    panel.classList.add('show');
  }
}

// ─── CHECK ───────────────────────────────────────────────────────────────────
async function checkExercise() {
  const activeExercises = getActiveExercises();
  const ex = activeExercises[currentIdx];
  const code = document.getElementById('editor').value.trim();
  if (!code) {
    const msg = currentSection === 'xsd'
      ? 'Escribe tu XSD antes de comprobar.'
      : currentSection === 'xpath'
        ? 'Escribe tu consulta XPath antes de comprobar.'
        : currentSection === 'xquery'
          ? 'Escribe tu consulta XQuery antes de comprobar.'
        : 'Escribe tu XML antes de comprobar.';
    showFeedback('err', '⚠️', 'Editor vacío', msg);
    return;
  }

  // Fast local validation first
  const localResult = currentSection === 'xsd'
    ? validateXsdLocally(code, ex.validate)
    : currentSection === 'xpath'
      ? validateXPathLocally(code, ex.sourceXml)
      : currentSection === 'xquery'
        ? validateXQueryLocally(code, ex.sourceXml)
      : validateLocally(code, ex.validate);

  if (currentSection === 'xpath' || currentSection === 'xquery') {
    if (localResult.ok) {
      renderXPathResult(localResult.entries);
    } else {
      renderXPathResult([], localResult.message);
    }
  }

  if (!localResult.ok) {
    showFeedback('err', '✗', 'Estructura incorrecta', localResult.message);
    return;
  }

  // Strict structural validation against exercise reference XML.
  setLoading(true);
  try {
    const referenceResult = currentSection === 'xsd'
      ? await validateAgainstReferenceXsd(code, ex.solutionPath)
      : currentSection === 'xpath'
        ? await validateAgainstReferenceXPath(code, ex.expectedResultPath || ex.solutionPath, ex.sourceXml)
        : currentSection === 'xquery'
          ? await validateAgainstReferenceXQuery(code, ex.expectedResultPath || ex.solutionPath, ex.sourceXml)
      : await validateAgainstReferenceXml(code, ex.solutionPath);

    if (!referenceResult.ok) {
      showFeedback('err', '✗', 'Estructura incorrecta', referenceResult.message);
      return;
    }

    solvedBySection[currentSection].add(currentIdx);
    persistSolved(currentSection);
    renderSidebar();
    showFeedback(
      'ok',
      '✓',
      '¡Correcto!',
      currentSection === 'xsd'
        ? 'Tu XSD coincide con la estructura esperada del ejercicio y con los puntos clave de la solución.'
        : currentSection === 'xpath'
          ? 'Tu consulta XPath es válida y produce el resultado esperado para el ejercicio.'
          : currentSection === 'xquery'
            ? 'Tu consulta XQuery produce el resultado esperado para el ejercicio.'
        : 'Tu XML coincide con la estructura esperada del ejercicio (etiquetas, orden y atributos).'
    );
  } catch (e) {
    const reason = escapeHtml(e?.message || String(e || 'Error desconocido'));
    showFeedback(
      'warn',
      '⚠',
      'No se pudo validar contra archivo',
      currentSection === 'xsd'
        ? `No se pudo cargar el XSD de referencia del ejercicio. Revisa la ruta configurada y que estés ejecutando el proyecto con un servidor local.<br><br><small>Detalle técnico: ${reason}</small>`
        : currentSection === 'xpath'
          ? `No se pudo cargar el resultado esperado de XPath. Revisa la ruta configurada y que estés ejecutando el proyecto con un servidor local.<br><br><small>Detalle técnico: ${reason}</small>`
          : currentSection === 'xquery'
            ? `No se pudo cargar el resultado esperado de XQuery. Revisa la ruta configurada y que estés ejecutando el proyecto con un servidor local.<br><br><small>Detalle técnico: ${reason}</small>`
          : `No se pudo cargar el XML de referencia del ejercicio. Revisa que exista el archivo en la ruta configurada y que estés ejecutando el proyecto con un servidor local.<br><br><small>Detalle técnico: ${reason}</small>`
    );
  } finally {
    setLoading(false);
  }
}

function setLoading(on) {
  const btn = document.getElementById('check-btn');
  const spinner = document.getElementById('check-spinner');
  const label = document.getElementById('check-label');
  btn.disabled = on;
  spinner.style.display = on ? 'block' : 'none';
  label.textContent = on ? 'Comprobando...' : 'Comprobar ✓';
}

async function validateAgainstReferenceXml(userXmlCode, referencePath) {
  if (!referencePath) {
    return { ok: false, message: 'Este ejercicio no tiene ruta de referencia configurada.' };
  }

  const response = await fetch(referencePath, { cache: 'no-store' });
  if (!response.ok) {
    return {
      ok: false,
      message: `No se encontró el archivo de referencia: <code>${referencePath}</code>.`
    };
  }

  const referenceXmlCode = await response.text();
  const parser = new DOMParser();

  const userDoc = parser.parseFromString(userXmlCode, 'application/xml');
  const userErr = userDoc.querySelector('parsererror');
  if (userErr) {
    return { ok: false, message: 'Tu XML no es válido.' };
  }

  const referenceDoc = parser.parseFromString(referenceXmlCode, 'application/xml');
  const refErr = referenceDoc.querySelector('parsererror');
  if (refErr) {
    return {
      ok: false,
      message: `El XML de referencia tiene errores de sintaxis en <code>${referencePath}</code>.`
    };
  }

  const diff = compareXmlStructure(userDoc.documentElement, referenceDoc.documentElement, '/');
  if (diff) {
    return { ok: false, message: diff };
  }

  return { ok: true };
}

async function validateAgainstReferenceXsd(userXsdCode, referencePath) {
  if (!referencePath) {
    return { ok: false, message: 'Este ejercicio no tiene ruta de referencia configurada.' };
  }

  const response = await fetch(referencePath, { cache: 'no-store' });
  if (!response.ok) {
    return {
      ok: false,
      message: `No se encontró el archivo de referencia: <code>${referencePath}</code>.`
    };
  }

  const referenceXsdCode = await response.text();
  const parser = new DOMParser();

  const userDoc = parser.parseFromString(userXsdCode, 'application/xml');
  const userErr = userDoc.querySelector('parsererror');
  if (userErr) {
    return { ok: false, message: 'Tu XSD no es XML válido.' };
  }

  const referenceDoc = parser.parseFromString(referenceXsdCode, 'application/xml');
  const refErr = referenceDoc.querySelector('parsererror');
  if (refErr) {
    return {
      ok: false,
      message: `El XSD de referencia tiene errores de sintaxis en <code>${referencePath}</code>.`
    };
  }

  const diff = compareXsdImportantStructure(
    userDoc.documentElement,
    referenceDoc.documentElement,
    '/'
  );

  if (diff) {
    return { ok: false, message: diff };
  }

  return { ok: true };
}

async function validateAgainstReferenceXPath(userXPath, referencePath, sourceXml) {
  try {
    if (!referencePath) {
      return { ok: false, message: 'Este ejercicio no tiene ruta de referencia configurada.' };
    }

    const response = await fetch(referencePath, { cache: 'no-store' });
    if (!response.ok) {
      return {
        ok: false,
        message: `No se encontró el archivo de referencia: <code>${referencePath}</code>.`
      };
    }

    const expectedRaw = (await response.text()).trim();
    if (!expectedRaw) {
      return { ok: false, message: `El resultado esperado está vacío en <code>${referencePath}</code>.` };
    }

    const userEval = evaluateXPathExpression(userXPath, sourceXml);
    if (!userEval.ok) {
      return { ok: false, message: userEval.message };
    }

    const userSerialized = serializeXPathEntries(userEval.entries);
    const expectedVariants = parseExpectedResultVariants(expectedRaw)
      .map((entries) => serializeXPathEntries(entries));

    if (!expectedVariants.length) {
      return { ok: false, message: `No se pudieron interpretar resultados esperados en <code>${referencePath}</code>.` };
    }

    if (matchSerializedEntriesAgainstVariants(userSerialized, expectedVariants)) {
      return { ok: true };
    }

    const expectedLengths = [...new Set(expectedVariants.map((variant) => variant.length))];
    if (!expectedLengths.includes(userSerialized.length)) {
      const expectedCountLabel = expectedLengths.length === 1
        ? `<b>${expectedLengths[0]}</b>`
        : `<b>${expectedLengths.join(', ')}</b>`;
      return {
        ok: false,
        message: `La consulta devuelve <b>${userSerialized.length}</b> resultados y se esperaban ${expectedCountLabel}.`
      };
    }

    return {
      ok: false,
      message: 'El resultado de tu consulta no coincide con ninguno de los resultados esperados.'
    };
  } catch (e) {
    const reason = escapeHtml(e?.message || String(e || 'Error desconocido'));
    return {
      ok: false,
      message: `Error interno al validar XPath de referencia.<br><small>Detalle técnico: ${reason}</small>`
    };
  }
}

async function validateAgainstReferenceXQuery(userXQuery, referencePath, sourceXml) {
  try {
    if (!referencePath) {
      return { ok: false, message: 'Este ejercicio no tiene ruta de referencia configurada.' };
    }

    const response = await fetch(referencePath, { cache: 'no-store' });
    if (!response.ok) {
      return {
        ok: false,
        message: `No se encontró el archivo de referencia: <code>${referencePath}</code>.`
      };
    }

    const expectedRaw = (await response.text()).trim();
    if (!expectedRaw) {
      return { ok: false, message: `El resultado esperado está vacío en <code>${referencePath}</code>.` };
    }

    const userEval = evaluateXQueryExpression(userXQuery, sourceXml);
    if (!userEval.ok) {
      return { ok: false, message: userEval.message };
    }

    const userSerialized = serializeXPathEntries(userEval.entries);
    const expectedVariants = parseExpectedResultVariants(expectedRaw)
      .map((entries) => serializeXPathEntries(entries));

    if (!expectedVariants.length) {
      return { ok: false, message: `No se pudieron interpretar resultados esperados en <code>${referencePath}</code>.` };
    }

    if (matchSerializedEntriesAgainstVariants(userSerialized, expectedVariants)) {
      return { ok: true };
    }

    const expectedLengths = [...new Set(expectedVariants.map((variant) => variant.length))];
    if (!expectedLengths.includes(userSerialized.length)) {
      const expectedCountLabel = expectedLengths.length === 1
        ? `<b>${expectedLengths[0]}</b>`
        : `<b>${expectedLengths.join(', ')}</b>`;
      return {
        ok: false,
        message: `La consulta devuelve <b>${userSerialized.length}</b> resultados y se esperaban ${expectedCountLabel}.`
      };
    }

    return {
      ok: false,
      message: 'El resultado de tu consulta no coincide con ninguno de los resultados esperados.'
    };
  } catch (e) {
    const reason = escapeHtml(e?.message || String(e || 'Error desconocido'));
    return {
      ok: false,
      message: `Error interno al validar XQuery de referencia.<br><small>Detalle técnico: ${reason}</small>`
    };
  }
}

function parseExpectedResultVariants(rawText) {
  const separators = /^\s*(?:---+|===+)\s*$/m;
  if (!separators.test(rawText)) {
    return [parseExpectedResultEntries(rawText)];
  }

  return rawText
    .split(/^\s*(?:---+|===+)\s*$/gm)
    .map((chunk) => parseExpectedResultEntries(chunk))
    .filter((variant) => variant.length > 0);
}

function matchSerializedEntriesAgainstVariants(userSerialized, expectedVariants) {
  for (const expectedSerialized of expectedVariants) {
    if (userSerialized.length !== expectedSerialized.length) {
      continue;
    }

    let allMatch = true;
    for (let i = 0; i < expectedSerialized.length; i++) {
      if (!areResultEntriesEquivalent(userSerialized[i], expectedSerialized[i])) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      return true;
    }
  }

  return false;
}

function areResultEntriesEquivalent(a, b) {
  const formsA = getComparableEntryForms(a);
  const formsB = getComparableEntryForms(b);
  for (const value of formsA) {
    if (formsB.has(value)) {
      return true;
    }
  }
  return false;
}

function getComparableEntryForms(entry) {
  const forms = new Set();
  const normalized = normalizeResultEntry(entry);
  forms.add(normalized);

  const xmlText = tryExtractXmlTextContent(normalized);
  if (xmlText) {
    forms.add(xmlText);
  }

  return forms;
}

function tryExtractXmlTextContent(value) {
  if (!value || !value.includes('<') || !value.includes('>')) {
    return null;
  }

  const parser = new DOMParser();
  const wrapped = `<root>${value}</root>`;
  const doc = parser.parseFromString(wrapped, 'application/xml');
  const parseErr = doc.querySelector('parsererror');
  if (parseErr) {
    return null;
  }

  const root = doc.documentElement;
  const elementChildren = Array.from(root.childNodes).filter((node) => node.nodeType === Node.ELEMENT_NODE);
  const nonEmptyTextNodes = Array.from(root.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  );

  if (elementChildren.length !== 1 || nonEmptyTextNodes.length > 0) {
    return null;
  }

  return normalizeResultEntry(elementChildren[0].textContent || '');
}

function normalizeResultEntry(value) {
  return String(value || '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseExpectedResultEntries(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return [];
  }

  // Best effort: parse as XML fragments wrapped in a synthetic root.
  const parser = new DOMParser();
  const wrapped = `<root>${trimmed}</root>`;
  const doc = parser.parseFromString(wrapped, 'application/xml');
  const parseErr = doc.querySelector('parsererror');
  if (!parseErr) {
    const out = [];
    for (const node of Array.from(doc.documentElement.childNodes)) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        out.push(new XMLSerializer().serializeToString(node));
      } else if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent
          .split(/\r?\n/)
          .map((p) => p.trim())
          .filter(Boolean);
        out.push(...parts);
      }
    }
    if (out.length) {
      return out;
    }
  }

  // Fallback: one result per line.
  return trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function compareXmlStructure(userNode, refNode, path) {
  if (!userNode || !refNode) {
    return 'No se pudo comparar la estructura XML.';
  }

  const currentPath = `${path}${refNode.tagName}`;

  if (userNode.tagName !== refNode.tagName) {
    return `Etiqueta incorrecta en <code>${currentPath}</code>. Se esperaba <code>&lt;${refNode.tagName}&gt;</code> y se encontró <code>&lt;${userNode.tagName}&gt;</code>.`;
  }

  const userAttrs = getSortedAttributeNames(userNode);
  const refAttrs = getSortedAttributeNames(refNode);
  if (userAttrs.join('|') !== refAttrs.join('|')) {
    return `Atributos incorrectos en <code>${currentPath}</code>. Se esperan: <code>${refAttrs.join(', ') || '(sin atributos)'}</code>.`;
  }

  const userChildren = getElementChildren(userNode);
  const refChildren = getElementChildren(refNode);

  if (userChildren.length !== refChildren.length) {
    return `Número de elementos hijo incorrecto en <code>${currentPath}</code>. Se esperan <b>${refChildren.length}</b> y hay <b>${userChildren.length}</b>.`;
  }

  for (let i = 0; i < refChildren.length; i++) {
    const nestedDiff = compareXmlStructure(userChildren[i], refChildren[i], `${currentPath}/`);
    if (nestedDiff) {
      return nestedDiff;
    }
  }

  return null;
}

function compareXsdImportantStructure(userNode, refNode, path) {
  if (!userNode || !refNode) {
    return 'No se pudo comparar la estructura XSD.';
  }

  const currentPath = `${path}${refNode.localName || refNode.tagName}`;
  const userName = userNode.localName || userNode.tagName;
  const refName = refNode.localName || refNode.tagName;

  if (userName !== refName) {
    return `Etiqueta XSD incorrecta en <code>${currentPath}</code>. Se esperaba <code>${refName}</code> y se encontró <code>${userName}</code>.`;
  }

  const importantAttrs = [
    'name', 'type', 'ref', 'base', 'value', 'fixed', 'default',
    'minOccurs', 'maxOccurs', 'use', 'itemType', 'memberTypes'
  ];

  for (const attr of importantAttrs) {
    const userVal = userNode.getAttribute(attr);
    const refVal = refNode.getAttribute(attr);
    if ((userVal || refVal) && userVal !== refVal) {
      return `Atributo importante diferente en <code>${currentPath}</code>: <code>${attr}</code>.`;
    }
  }

  const userChildren = getImportantXsdChildren(userNode);
  const refChildren = getImportantXsdChildren(refNode);

  if (userChildren.length !== refChildren.length) {
    return `Número de bloques XSD incorrecto en <code>${currentPath}</code>. Se esperan <b>${refChildren.length}</b> y hay <b>${userChildren.length}</b>.`;
  }

  for (let i = 0; i < refChildren.length; i++) {
    const nestedDiff = compareXsdImportantStructure(userChildren[i], refChildren[i], `${currentPath}/`);
    if (nestedDiff) {
      return nestedDiff;
    }
  }

  return null;
}

function getImportantXsdChildren(node) {
  const ignored = new Set(['annotation', 'documentation', 'appinfo']);
  return Array.from(node.childNodes).filter((child) => {
    if (child.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const name = child.localName || child.tagName;
    return !ignored.has(name);
  });
}

function getElementChildren(node) {
  return Array.from(node.childNodes).filter((child) => child.nodeType === Node.ELEMENT_NODE);
}

function getSortedAttributeNames(node) {
  return Array.from(node.attributes || []).map((a) => a.name).sort();
}

function validateXPathLocally(xpathQuery, sourceXml) {
  const query = xpathQuery.trim();
  if (!query) {
    return { ok: false, message: 'Escribe una consulta XPath antes de comprobar.' };
  }

  const evaluated = evaluateXPathExpression(query, sourceXml);
  if (!evaluated.ok) {
    return evaluated;
  }

  return { ok: true, entries: evaluated.entries };
}

function validateXQueryLocally(xqueryCode, sourceXml) {
  const query = xqueryCode.trim();
  if (!query) {
    return { ok: false, message: 'Escribe una consulta XQuery antes de comprobar.' };
  }

  const evaluated = evaluateXQueryExpression(query, sourceXml);
  if (!evaluated.ok) {
    return evaluated;
  }

  return { ok: true, entries: evaluated.entries };
}

function evaluateXPathExpression(xpathQuery, sourceXml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(sourceXml, 'application/xml');
  const parseErr = doc.querySelector('parsererror');
  if (parseErr) {
    return { ok: false, message: 'El XML base del ejercicio no es válido.' };
  }

  try {
    const raw = doc.evaluate(xpathQuery, doc, null, XPathResult.ANY_TYPE, null);
    const entries = extractXPathEntries(raw);
    return { ok: true, entries };
  } catch (e) {
    return { ok: false, message: 'Consulta XPath no válida. Revisa la sintaxis.' };
  }
}

function extractXPathEntries(result) {
  const entries = [];

  switch (result.resultType) {
    case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
    case XPathResult.ORDERED_NODE_ITERATOR_TYPE: {
      let node = result.iterateNext();
      while (node) {
        entries.push(formatXPathNode(node));
        node = result.iterateNext();
      }
      break;
    }
    case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
    case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
      for (let i = 0; i < result.snapshotLength; i++) {
        entries.push(formatXPathNode(result.snapshotItem(i)));
      }
      break;
    case XPathResult.STRING_TYPE:
      entries.push(result.stringValue);
      break;
    case XPathResult.NUMBER_TYPE:
      entries.push(String(result.numberValue));
      break;
    case XPathResult.BOOLEAN_TYPE:
      entries.push(String(result.booleanValue));
      break;
    case XPathResult.ANY_UNORDERED_NODE_TYPE:
    case XPathResult.FIRST_ORDERED_NODE_TYPE:
      if (result.singleNodeValue) {
        entries.push(formatXPathNode(result.singleNodeValue));
      }
      break;
    default:
      break;
  }

  return entries;
}

function formatXPathNode(node) {
  if (!node) {
    return '';
  }

  if (node.nodeType === Node.ATTRIBUTE_NODE) {
    return `${node.name}="${node.value}"`;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.trim();
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(node);
  }

  return node.textContent?.trim() || '';
}

function serializeXPathEntries(entries) {
  return entries.map((entry) => (entry || '').replace(/\s+/g, ' ').trim());
}

function evaluateXQueryExpression(xqueryCode, sourceXml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(sourceXml, 'application/xml');
  const parseErr = doc.querySelector('parsererror');
  if (parseErr) {
    return { ok: false, message: 'El XML base del ejercicio no es válido.' };
  }

  try {
    const normalized = xqueryCode.replace(/\r/g, '').trim();
    validateXQuerySyntaxBasics(normalized);
    const entries = runMiniXQuery(normalized, doc);
    return { ok: true, entries: entries.map((v) => String(v).trim()).filter(Boolean) };
  } catch (e) {
    const detail = e?.message || 'Error de sintaxis.';
    const hasLine = Number.isInteger(e?.xqLine) && Number.isInteger(e?.xqColumn);
    const location = hasLine ? ` (linea ${e.xqLine}, columna ${e.xqColumn})` : '';
    return {
      ok: false,
      message: `Consulta XQuery no valida: ${detail}${location}`
    };
  }
}

function validateXQuerySyntaxBasics(query) {
  if (!query) {
    throw createXQuerySyntaxError('Escribe una consulta XQuery.', query, 0);
  }

  const returnIdx = indexOfWord(query, 'return');
  if (returnIdx < 0) {
    throw createXQuerySyntaxError('Falta la clausula return.', query, Math.max(query.length - 1, 0));
  }

  const stack = [];
  let quote = '';

  for (let i = 0; i < query.length; i++) {
    const ch = query[i];

    if (quote) {
      if (ch === quote) {
        quote = '';
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }

    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push({ ch, i });
      continue;
    }

    if (ch === ')' || ch === '}' || ch === ']') {
      const expected = ch === ')' ? '(' : ch === '}' ? '{' : '[';
      const top = stack.pop();
      if (!top || top.ch !== expected) {
        throw createXQuerySyntaxError(`Cierre inesperado '${ch}'.`, query, i);
      }
    }
  }

  if (quote) {
    throw createXQuerySyntaxError('Comilla sin cerrar en la consulta.', query, query.length - 1);
  }

  if (stack.length) {
    const open = stack[stack.length - 1];
    throw createXQuerySyntaxError(`Falta cerrar '${open.ch}'.`, query, open.i);
  }
}

function createXQuerySyntaxError(message, source, index) {
  const err = new Error(message);
  const loc = getLineColumnFromIndex(source || '', index || 0);
  err.xqLine = loc.line;
  err.xqColumn = loc.column;
  return err;
}

function getLineColumnFromIndex(source, index) {
  const safeSource = String(source || '');
  const safeIndex = Math.max(0, Math.min(index, safeSource.length));
  let line = 1;
  let column = 1;

  for (let i = 0; i < safeIndex; i++) {
    if (safeSource[i] === '\n') {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }

  return { line, column };
}

function runMiniXQuery(query, xmlDoc) {
  const returnIdx = indexOfWord(query, 'return');
  if (returnIdx < 0) {
    throw createXQuerySyntaxError('Falta la clausula return.', query, Math.max(query.length - 1, 0));
  }

  const prefix = query.slice(0, returnIdx).trim();
  const returnExpr = query.slice(returnIdx + 6).trim();

  if (!prefix) {
    return evaluateXQueryExprAsStrings(returnExpr, {}, xmlDoc);
  }

  if (prefix.toLowerCase().startsWith('let ')) {
    const env = evaluateLetClauses(prefix, {}, xmlDoc);
    return evaluateXQueryExprAsStrings(returnExpr, env, xmlDoc);
  }

  if (!prefix.toLowerCase().startsWith('for ')) {
    throw createXQuerySyntaxError('La consulta debe empezar con for ... return o let ... return.', query, 0);
  }

  const forParsed = parseForClause(prefix, query);
  let rows = evaluateXQuerySequence(forParsed.inExpr, {}, xmlDoc).map((item) => ({ [forParsed.varName]: item }));

  if (forParsed.letPart) {
    rows = rows.map((row) => ({ ...row, ...evaluateLetClauses(forParsed.letPart, row, xmlDoc) }));
  }

  if (forParsed.whereExpr) {
    rows = rows.filter((row) => evaluateXQueryCondition(forParsed.whereExpr, row, xmlDoc));
  }

  if (forParsed.orderExpr) {
    const dir = forParsed.orderDescending ? -1 : 1;
    rows.sort((a, b) => {
      const va = evaluateXQueryScalar(forParsed.orderExpr, a, xmlDoc);
      const vb = evaluateXQueryScalar(forParsed.orderExpr, b, xmlDoc);
      const na = Number(va);
      const nb = Number(vb);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) {
        return (na - nb) * dir;
      }
      return String(va).localeCompare(String(vb)) * dir;
    });
  }

  const result = [];
  for (const row of rows) {
    result.push(...evaluateXQueryExprAsStrings(returnExpr, row, xmlDoc));
  }
  return result;
}

function parseForClause(prefix) {
  const forMatch = prefix.match(/^for\s+\$(\w+)\s+in\s+([\s\S]+?)(?=\s+(?:let|where|order\s+by)\b|$)([\s\S]*)$/i);
  if (!forMatch) {
    throw createXQuerySyntaxError('Clausula for invalida. Usa: for $var in ruta ... return ...', prefix, 0);
  }

  let rest = (forMatch[3] || '').trim();
  let letPart = '';
  let whereExpr = '';
  let orderExpr = '';
  let orderDescending = false;

  const letMatch = rest.match(/^let\s+([\s\S]+?)(?=\s+where\b|\s+order\s+by\b|$)([\s\S]*)$/i);
  if (letMatch) {
    letPart = `let ${letMatch[1].trim()}`;
    rest = (letMatch[2] || '').trim();
  }

  const whereMatch = rest.match(/^where\s+([\s\S]+?)(?=\s+order\s+by\b|$)([\s\S]*)$/i);
  if (whereMatch) {
    whereExpr = whereMatch[1].trim();
    rest = (whereMatch[2] || '').trim();
  }

  const orderMatch = rest.match(/^order\s+by\s+([\s\S]+?)(?:\s+(ascending|descending))?\s*$/i);
  if (orderMatch) {
    orderExpr = orderMatch[1].trim();
    orderDescending = (orderMatch[2] || '').toLowerCase() === 'descending';
  }

  return {
    varName: forMatch[1],
    inExpr: forMatch[2].trim(),
    letPart,
    whereExpr,
    orderExpr,
    orderDescending,
  };
}

function evaluateLetClauses(letCode, baseEnv, xmlDoc) {
  const env = { ...baseEnv };
  const code = letCode.replace(/^let\s+/i, '').trim();
  const parts = code.split(/\s+let\s+/i);
  for (const part of parts) {
    const m = part.match(/^\$(\w+)\s*:=\s*([\s\S]+)$/);
    if (!m) {
      throw createXQuerySyntaxError('Clausula let invalida. Usa: let $var := expresion', letCode, 0);
    }
    const value = evaluateXQueryExpressionRaw(m[2].trim(), env, xmlDoc);
    env[m[1]] = value;
  }
  return env;
}

function evaluateXQueryCondition(condition, env, xmlDoc) {
  const andParts = condition.split(/\s+and\s+/i);
  for (const part of andParts) {
    const atom = part.trim();
    const m = atom.match(/^([\s\S]+?)\s*(=|!=|<=|>=|<|>)\s*([\s\S]+)$/);
    if (!m) {
      if (!evaluateXQueryScalar(atom, env, xmlDoc)) {
        return false;
      }
      continue;
    }

    const left = evaluateXQueryScalar(m[1].trim(), env, xmlDoc);
    const right = evaluateXQueryScalar(m[3].trim(), env, xmlDoc);

    const nl = Number(left);
    const nr = Number(right);
    const numeric = !Number.isNaN(nl) && !Number.isNaN(nr);
    const a = numeric ? nl : String(left);
    const b = numeric ? nr : String(right);

    if (m[2] === '=' && a !== b) return false;
    if (m[2] === '!=' && a === b) return false;
    if (m[2] === '<' && !(a < b)) return false;
    if (m[2] === '>' && !(a > b)) return false;
    if (m[2] === '<=' && !(a <= b)) return false;
    if (m[2] === '>=' && !(a >= b)) return false;
  }
  return true;
}

function evaluateXQueryExprAsStrings(expr, env, xmlDoc) {
  const value = evaluateXQueryExpressionRaw(expr, env, xmlDoc);
  const arr = Array.isArray(value) ? value : [value];
  return arr.map((item) => xqueryItemToString(item)).filter(Boolean);
}

function evaluateXQueryExpressionRaw(expr, env, xmlDoc) {
  const s = expr.trim();

  const ifMatch = s.match(/^if\s*\(([\s\S]+)\)\s*then\s*([\s\S]+)\s*else\s*([\s\S]+)$/i);
  if (ifMatch) {
    return evaluateXQueryCondition(ifMatch[1].trim(), env, xmlDoc)
      ? evaluateXQueryExpressionRaw(ifMatch[2].trim(), env, xmlDoc)
      : evaluateXQueryExpressionRaw(ifMatch[3].trim(), env, xmlDoc);
  }

  const countMatch = s.match(/^count\(([^]+)\)$/i);
  if (countMatch) {
    return [String(evaluateXQuerySequence(countMatch[1].trim(), env, xmlDoc).length)];
  }

  const avgMatch = s.match(/^avg\(([^]+)\)$/i);
  if (avgMatch) {
    const nums = evaluateXQuerySequence(avgMatch[1].trim(), env, xmlDoc).map((v) => Number(xqueryItemToString(v)));
    if (!nums.length) {
      return ['0'];
    }
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return [Number(avg.toFixed(2)).toString()];
  }

  const maxMatch = s.match(/^max\(([^]+)\)$/i);
  if (maxMatch) {
    const nums = evaluateXQuerySequence(maxMatch[1].trim(), env, xmlDoc).map((v) => Number(xqueryItemToAtomic(v)));
    const validNums = nums.filter((n) => !Number.isNaN(n));
    if (!validNums.length) {
      return ['NaN'];
    }
    return [String(Math.max(...validNums))];
  }

  // Sequence expression, e.g. ($p/nombre, $p/precio)
  if (s.startsWith('(') && s.endsWith(')')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) {
      return [];
    }

    const parts = splitTopLevelByComma(inner);
    const out = [];
    for (const part of parts) {
      const value = evaluateXQueryExpressionRaw(part, env, xmlDoc);
      if (Array.isArray(value)) {
        out.push(...value);
      } else {
        out.push(value);
      }
    }
    return out;
  }

  if (/^<\w+>[\s\S]*<\/\w+>$/.test(s)) {
    return [renderXQueryElementConstructor(s, env, xmlDoc)];
  }

  // In XQuery, enclosed expressions {...} are only valid inside constructors.
  if (s.includes('{') || s.includes('}')) {
    throw new Error('invalid enclosed expression');
  }

  return evaluateXQuerySequence(s, env, xmlDoc);
}

function splitTopLevelByComma(source) {
  const parts = [];
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let quote = '';
  let start = 0;

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];

    if (quote) {
      if (ch === quote) {
        quote = '';
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }

    if (ch === '(') {
      depthParen += 1;
      continue;
    }
    if (ch === ')') {
      depthParen -= 1;
      continue;
    }
    if (ch === '{') {
      depthBrace += 1;
      continue;
    }
    if (ch === '}') {
      depthBrace -= 1;
      continue;
    }
    if (ch === '[') {
      depthBracket += 1;
      continue;
    }
    if (ch === ']') {
      depthBracket -= 1;
      continue;
    }

    if (ch === ',' && depthParen === 0 && depthBrace === 0 && depthBracket === 0) {
      const part = source.slice(start, i).trim();
      if (part) {
        parts.push(part);
      }
      start = i + 1;
    }
  }

  const last = source.slice(start).trim();
  if (last) {
    parts.push(last);
  }

  return parts;
}

function evaluateXQuerySequence(expr, env, xmlDoc) {
  const s = expr.trim();

  const distinctMatch = s.match(/^distinct-values\(([^]+)\)$/i);
  if (distinctMatch) {
    const base = evaluateXQuerySequence(distinctMatch[1].trim(), env, xmlDoc).map((item) => xqueryItemToString(item));
    return [...new Set(base)];
  }

  if (s.startsWith('"') && s.endsWith('"')) {
    return [s.slice(1, -1)];
  }

  if (s.startsWith("'") && s.endsWith("'")) {
    return [s.slice(1, -1)];
  }

  if (/^-?\d+(\.\d+)?$/.test(s)) {
    return [s];
  }

  if (/^\$\w+$/.test(s)) {
    const key = s.slice(1);
    const value = env[key];
    if (value == null) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }

  const varPath = s.match(/^\$(\w+)(\/.+)$/);
  if (varPath) {
    const base = env[varPath[1]];
    if (!base) {
      return [];
    }
    const nodes = Array.isArray(base) ? base : [base];
    const out = [];
    const pathExpr = `.${varPath[2]}`;
    for (const node of nodes) {
      if (node?.nodeType) {
        out.push(...evaluateXPathNodeSequence(pathExpr, xmlDoc, node));
      }
    }
    return out;
  }

  const docPath = s.match(/^doc\([^)]*\)([\s\S]*)$/i);
  if (docPath) {
    const suffix = (docPath[1] || '').trim();
    const xpath = suffix || '/';
    return evaluateXPathNodeSequence(xpath, xmlDoc, xmlDoc);
  }

  if (s.startsWith('/')) {
    return evaluateXPathNodeSequence(s, xmlDoc, xmlDoc);
  }

  if (s.startsWith('./') || s.startsWith('//')) {
    return evaluateXPathNodeSequence(s, xmlDoc, xmlDoc);
  }

  return [s];
}

function evaluateXPathNodeSequence(xpath, xmlDoc, contextNode) {
  const result = xmlDoc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  const out = [];
  let node = result.iterateNext();
  while (node) {
    out.push(node);
    node = result.iterateNext();
  }
  return out;
}

function xqueryItemToString(item) {
  if (item == null) {
    return '';
  }
  if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
    return String(item);
  }
  if (item.nodeType === Node.ATTRIBUTE_NODE) {
    return `${item.name}="${item.value}"`;
  }
  if (item.nodeType === Node.TEXT_NODE) {
    return item.textContent?.trim() || '';
  }
  if (item.nodeType === Node.ELEMENT_NODE) {
    return new XMLSerializer().serializeToString(item);
  }
  return String(item);
}

function renderXQueryElementConstructor(expr, env, xmlDoc) {
  const m = expr.match(/^<(\w+)>([\s\S]*)<\/\1>$/);
  if (!m) {
    throw new Error('invalid element constructor');
  }

  const tag = m[1];
  const inner = m[2];
  const pieces = [];
  let i = 0;

  while (i < inner.length) {
    const open = inner.indexOf('{', i);
    if (open < 0) {
      const literal = inner.slice(i).trim();
      if (literal) {
        pieces.push(literal);
      }
      break;
    }

    const literal = inner.slice(i, open).trim();
    if (literal) {
      pieces.push(literal);
    }

    let depth = 1;
    let j = open + 1;
    while (j < inner.length && depth > 0) {
      if (inner[j] === '{') depth += 1;
      if (inner[j] === '}') depth -= 1;
      j += 1;
    }

    const block = inner.slice(open + 1, j - 1).trim();
    const evalPieces = evaluateXQueryExprAsStrings(block, env, xmlDoc);
    pieces.push(...evalPieces);
    i = j;
  }

  return `<${tag}>${pieces.join('')}</${tag}>`;
}

function evaluateXQueryScalar(expr, env, xmlDoc) {
  const seq = evaluateXQuerySequence(expr, env, xmlDoc);
  if (!seq.length) {
    return '';
  }
  return xqueryItemToAtomic(seq[0]);
}

function xqueryItemToAtomic(item) {
  if (item == null) {
    return '';
  }

  if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
    return String(item);
  }

  if (item.nodeType === Node.ATTRIBUTE_NODE) {
    return String(item.value || '').trim();
  }

  if (item.nodeType === Node.TEXT_NODE) {
    return String(item.textContent || '').trim();
  }

  if (item.nodeType === Node.ELEMENT_NODE) {
    return String(item.textContent || '').trim();
  }

  return xqueryItemToString(item);
}

function indexOfWord(source, word) {
  const re = new RegExp(`\\b${word}\\b`, 'i');
  const m = re.exec(source);
  return m ? m.index : -1;
}

function renderXPathResult(entries, errorMessage) {
  const body = document.getElementById('xpath-result-body');
  const count = document.getElementById('xpath-result-count');
  const sectionResults = queryResultBySection[currentSection];
  if (sectionResults) {
    sectionResults[currentIdx] = {
      entries: Array.isArray(entries) ? [...entries] : [],
      errorMessage: errorMessage ? String(errorMessage) : '',
    };
  }

  if (errorMessage) {
    body.textContent = errorMessage;
    count.textContent = '0';
    return;
  }

  if (!entries.length) {
    body.textContent = 'La consulta no devolvió resultados.';
    count.textContent = '0';
    return;
  }

  body.textContent = entries.join('\n\n');
  count.textContent = String(entries.length);
}

function restoreStoredQueryResult(idx) {
  const sectionResults = queryResultBySection[currentSection];
  if (!sectionResults) {
    clearXPathResultPanel();
    return;
  }

  const saved = sectionResults[idx];
  if (!saved) {
    clearXPathResultPanel();
    return;
  }

  renderXPathResult(saved.entries || [], saved.errorMessage || '');
}

function clearXPathResultPanel() {
  const body = document.getElementById('xpath-result-body');
  const count = document.getElementById('xpath-result-count');
  if (!body || !count) {
    return;
  }
  body.textContent = 'Aquí aparecerá el resultado cuando pulses Comprobar.';
  count.textContent = '0';
}

function validateXsdLocally(code, rules) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(code, 'application/xml');
  const parseErr = doc.querySelector('parsererror');
  if (parseErr) {
    const errText = parseErr.textContent.split('\n')[0];
    return { ok: false, message: `XSD no válido (error de sintaxis XML): ${errText}` };
  }

  const root = doc.documentElement;
  const rootName = root.localName || root.tagName;
  if (rootName !== 'schema') {
    return { ok: false, message: 'La raíz del XSD debe ser <code>&lt;xsd:schema&gt;</code>.' };
  }

  const hasSchemaNs = Array.from(root.attributes).some(
    (attr) => attr.name.startsWith('xmlns') && attr.value === 'http://www.w3.org/2001/XMLSchema'
  ) || root.namespaceURI === 'http://www.w3.org/2001/XMLSchema';

  if (!hasSchemaNs) {
    return { ok: false, message: 'Falta declarar el namespace XML Schema: <code>http://www.w3.org/2001/XMLSchema</code>.' };
  }

  const allElements = Array.from(doc.getElementsByTagName('*')).filter(
    (node) => (node.localName || node.tagName) === 'element'
  );

  if (!allElements.length) {
    return { ok: false, message: 'Tu XSD debe definir al menos un <code>&lt;xsd:element&gt;</code>.' };
  }

  if (rules?.expectedRoot) {
    const hasRootDefinition = allElements.some((el) => el.getAttribute('name') === rules.expectedRoot);
    if (!hasRootDefinition) {
      return {
        ok: false,
        message: `Debe existir una definición para el elemento raíz <code>${rules.expectedRoot}</code>.`
      };
    }
  }

  if (rules?.requiredElementNames?.length) {
    const userDefinedNames = new Set(allElements.map((el) => el.getAttribute('name')).filter(Boolean));
    for (const requiredName of rules.requiredElementNames) {
      if (!userDefinedNames.has(requiredName)) {
        return {
          ok: false,
          message: `Falta definir el elemento <code>${requiredName}</code> en el XSD.`
        };
      }
    }
  }

  if (rules?.requiredAttributes?.length) {
    const allAttrs = Array.from(doc.getElementsByTagName('*')).filter(
      (node) => (node.localName || node.tagName) === 'attribute'
    );
    const attrNames = new Set(allAttrs.map((attr) => attr.getAttribute('name')).filter(Boolean));
    for (const requiredAttr of rules.requiredAttributes) {
      if (!attrNames.has(requiredAttr)) {
        return {
          ok: false,
          message: `Falta definir el atributo <code>${requiredAttr}</code> en el XSD.`
        };
      }
    }
  }

  return { ok: true };
}

// ─── LOCAL VALIDATOR ─────────────────────────────────────────────────────────
function validateLocally(code, rules) {
  // Check prolog
  if (rules.needsProlog && !code.includes('<?xml')) {
    return { ok: false, message: 'Falta el prólogo XML: <code><?xml version="1.0"?></code>' };
  }

  // Try to parse XML
  const parser = new DOMParser();
  const doc = parser.parseFromString(code, 'application/xml');
  const parseErr = doc.querySelector('parsererror');
  if (parseErr) {
    const errText = parseErr.textContent.split('\n')[0];
    return { ok: false, message: `XML no válido (error de sintaxis): ${errText}` };
  }

  // Check required elements
  if (rules.minElements) {
    for (const tag of rules.minElements) {
      if (!doc.querySelector(tag) && !doc.getElementsByTagName(tag).length) {
        return { ok: false, message: `Falta el elemento <code>&lt;${tag}&gt;</code> en tu XML.` };
      }
    }
  }

  // Check min repeat
  if (rules.minRepeat) {
    const count = doc.getElementsByTagName(rules.minRepeat.tag).length;
    if (count < rules.minRepeat.count) {
      return { ok: false, message: `Necesitas al menos <b>${rules.minRepeat.count}</b> elementos <code>&lt;${rules.minRepeat.tag}&gt;</code>, solo tienes ${count}.` };
    }
  }

  // Check attributes
  if (rules.attributes) {
    for (const { tag, attrs } of rules.attributes) {
      const els = doc.getElementsByTagName(tag);
      if (!els.length) continue;
      const el = els[0];
      for (const attr of attrs) {
        if (!el.hasAttribute(attr)) {
          return { ok: false, message: `El elemento <code>&lt;${tag}&gt;</code> debe tener el atributo <code>${attr}</code>.` };
        }
      }
    }
  }

  // Check empty element
  if (rules.emptyElement) {
    const els = doc.getElementsByTagName(rules.emptyElement);
    if (!els.length) {
      return { ok: false, message: `Falta el elemento vacío <code>&lt;${rules.emptyElement} /&gt;</code>.` };
    }
  }

  return { ok: true };
}

// ─── FEEDBACK ────────────────────────────────────────────────────────────────
function showFeedback(type, icon, title, body) {
  const panel = document.getElementById('feedback-panel');
  const header = document.getElementById('fb-header');
  const fbIcon = document.getElementById('fb-icon');
  const fbTitle = document.getElementById('fb-title');
  const fbBody = document.getElementById('fb-body');

  header.className = 'fb-header ' + type;
  fbIcon.textContent = icon;
  fbTitle.textContent = title;
  fbBody.innerHTML = body.replace(/\n/g,'<br>').replace(/`([^`]+)`/g,'<code>$1</code>');

  panel.classList.add('show');
}

function closeFeedback() {
  document.getElementById('feedback-panel').classList.remove('show');
}

function switchSection(sec) {
  if (sec !== 'xml' && sec !== 'xsd' && sec !== 'xpath' && sec !== 'xquery' && sec !== 'playground') {
    return;
  }

  if (sec === currentSection) {
    return;
  }

  currentSection = sec;

  if (sec === 'playground') {
    updateSectionUi();
    return;
  }

  currentIdx = 0;
  updateSectionUi();
  renderSidebar();
  loadExercise(0);
}

init();