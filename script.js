// ─── STATE ───────────────────────────────────────────────────────────────────
let currentSection = 'xml';
let currentIdx = 0;

const solvedBySection = {
  xml: new Set(JSON.parse(localStorage.getItem('xml_solved') || '[]')),
  xsd: new Set(JSON.parse(localStorage.getItem('xsd_solved') || '[]')),
  xpath: new Set(JSON.parse(localStorage.getItem('xpath_solved') || '[]')),
};

const userCodeBySection = {
  xml: {},
  xsd: {},
  xpath: {},
};

// ─── INIT ────────────────────────────────────────────────────────────────────
function init() {
  updateSectionUi();
  renderSidebar();
  loadExercise(0);
  document.getElementById('editor').addEventListener('input', onEditorInput);
  document.getElementById('editor').addEventListener('keydown', handleTab);
}

function getActiveExercises() {
  if (currentSection === 'xsd') {
    return xsdExercises;
  }
  if (currentSection === 'xpath') {
    return xpathExercises;
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
  return 'xml';
}

function updateSectionUi() {
  const navXml = document.getElementById('nav-xml');
  const navXsd = document.getElementById('nav-xsd');
  const navXpath = document.getElementById('nav-xpath');
  const sidebarTitle = document.getElementById('sidebar-title');
  const sidebarSub = document.getElementById('sidebar-sub');
  const sourcePanel = document.getElementById('source-panel');
  const xpathResultPanel = document.getElementById('xpath-result-panel');
  const editor = document.getElementById('editor');

  navXml.classList.toggle('active', currentSection === 'xml');
  navXsd.classList.toggle('active', currentSection === 'xsd');
  navXpath.classList.toggle('active', currentSection === 'xpath');

  if (currentSection === 'xsd') {
    sidebarTitle.textContent = 'XSD — Ejercicios';
    sidebarSub.textContent = 'Esquemas y validación';
    sourcePanel.hidden = false;
    xpathResultPanel.hidden = true;
    editor.placeholder = '<!-- Escribe tu XSD aquí -->';
  } else if (currentSection === 'xpath') {
    sidebarTitle.textContent = 'XPath — Ejercicios';
    sidebarSub.textContent = 'Consultas y selección de nodos';
    sourcePanel.hidden = false;
    xpathResultPanel.hidden = false;
    editor.placeholder = '/biblioteca/...';
  } else {
    sidebarTitle.textContent = 'XML — Ejercicios';
    sidebarSub.textContent = 'Estructura y marcado';
    sourcePanel.hidden = true;
    xpathResultPanel.hidden = true;
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

  // source preview (only for xsd)
  const sourceTitle = document.getElementById('source-title');
  const sourceXml = document.getElementById('source-xml');
  if (currentSection === 'xsd' || currentSection === 'xpath') {
    const label = currentSection === 'xsd' ? 'XML del ejercicio' : 'XML base para consultas';
    sourceTitle.textContent = `XML del ejercicio ${String(ex.id).padStart(2, '0')}`;
    if (currentSection === 'xpath') {
      sourceTitle.textContent = label;
    }
    sourceXml.textContent = ex.sourceXml || 'Sin XML de referencia para este ejercicio.';
  }

  if (currentSection !== 'xpath') {
    clearXPathResultPanel();
  }

  // requirements
  const reqs = document.getElementById('ex-reqs');
  reqs.innerHTML = ex.requirements.map(r =>
    `<span class="req-tag">${r.label}: <b>${r.detail}</b></span>`
  ).join('');

  // editor
  const editor = document.getElementById('editor');
  editor.value = userCodeBySection[currentSection][idx] ?? '';
  updateLineNums();

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
}

function updateLineNums() {
  const lines = (document.getElementById('editor').value.match(/\n/g) || []).length + 1;
  document.getElementById('line-nums').innerHTML =
    Array.from({length: lines}, (_, i) => i+1).join('<br>');
}

function handleTab(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const ta = e.target;
    const s = ta.selectionStart, end = ta.selectionEnd;
    ta.value = ta.value.substring(0,s) + '  ' + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = s + 2;
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
        : 'Escribe tu XML antes de comprobar.';
    showFeedback('err', '⚠️', 'Editor vacío', msg);
    return;
  }

  // Fast local validation first
  const localResult = currentSection === 'xsd'
    ? validateXsdLocally(code, ex.validate)
    : currentSection === 'xpath'
      ? validateXPathLocally(code, ex.sourceXml)
      : validateLocally(code, ex.validate);

  if (currentSection === 'xpath') {
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
        ? await validateAgainstReferenceXPath(code, ex.solutionPath, ex.sourceXml)
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
        : 'Tu XML coincide con la estructura esperada del ejercicio (etiquetas, orden y atributos).'
    );
  } catch (e) {
    showFeedback(
      'warn',
      '⚠',
      'No se pudo validar contra archivo',
      currentSection === 'xsd'
        ? 'No se pudo cargar el XSD de referencia del ejercicio. Revisa la ruta configurada y que estés ejecutando el proyecto con un servidor local.'
        : currentSection === 'xpath'
          ? 'No se pudo cargar la solución XPath del ejercicio. Revisa la ruta configurada y que estés ejecutando el proyecto con un servidor local.'
        : 'No se pudo cargar el XML de referencia del ejercicio. Revisa que exista el archivo en la ruta configurada y que estés ejecutando el proyecto con un servidor local.'
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

  const expectedXPath = (await response.text()).trim();
  if (!expectedXPath) {
    return { ok: false, message: `La solución XPath está vacía en <code>${referencePath}</code>.` };
  }

  const userEval = evaluateXPathExpression(userXPath, sourceXml);
  if (!userEval.ok) {
    return { ok: false, message: userEval.message };
  }

  const expectedEval = evaluateXPathExpression(expectedXPath, sourceXml);
  if (!expectedEval.ok) {
    return { ok: false, message: `La solución XPath en <code>${referencePath}</code> no es válida.` };
  }

  const userSerialized = serializeXPathEntries(userEval.entries);
  const expectedSerialized = serializeXPathEntries(expectedEval.entries);

  if (userSerialized.length !== expectedSerialized.length) {
    return {
      ok: false,
      message: `La consulta devuelve <b>${userSerialized.length}</b> resultados y se esperaban <b>${expectedSerialized.length}</b>.`
    };
  }

  for (let i = 0; i < expectedSerialized.length; i++) {
    if (userSerialized[i] !== expectedSerialized[i]) {
      return {
        ok: false,
        message: 'El resultado de tu consulta no coincide con el resultado esperado.'
      };
    }
  }

  return { ok: true };
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

function renderXPathResult(entries, errorMessage) {
  const body = document.getElementById('xpath-result-body');
  const count = document.getElementById('xpath-result-count');

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
    return { ok: false, message: 'La raíz del XSD debe ser <code>&lt;xs:schema&gt;</code>.' };
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
    return { ok: false, message: 'Tu XSD debe definir al menos un <code>&lt;xs:element&gt;</code>.' };
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
  if (sec !== 'xml' && sec !== 'xsd' && sec !== 'xpath') {
    return;
  }

  if (sec === currentSection) {
    return;
  }

  currentSection = sec;
  currentIdx = 0;
  updateSectionUi();
  renderSidebar();
  loadExercise(0);
}

init();