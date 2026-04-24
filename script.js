// ─── STATE ───────────────────────────────────────────────────────────────────
let currentSection = 'xml';
let currentIdx = 0;

const solvedBySection = {
  xml: new Set(JSON.parse(localStorage.getItem('xml_solved') || '[]')),
  xsd: new Set(JSON.parse(localStorage.getItem('xsd_solved') || '[]')),
};

const userCodeBySection = {
  xml: {},
  xsd: {},
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
  return currentSection === 'xsd' ? xsdExercises : exercises;
}

function getActiveSolvedSet() {
  return solvedBySection[currentSection];
}

function persistSolved(section) {
  localStorage.setItem(`${section}_solved`, JSON.stringify([...solvedBySection[section]]));
}

function getEditorExtension() {
  return currentSection === 'xsd' ? 'xsd' : 'xml';
}

function updateSectionUi() {
  const navXml = document.getElementById('nav-xml');
  const navXsd = document.getElementById('nav-xsd');
  const sidebarTitle = document.getElementById('sidebar-title');
  const sidebarSub = document.getElementById('sidebar-sub');
  const sourcePanel = document.getElementById('source-panel');
  const editor = document.getElementById('editor');

  navXml.classList.toggle('active', currentSection === 'xml');
  navXsd.classList.toggle('active', currentSection === 'xsd');

  if (currentSection === 'xsd') {
    sidebarTitle.textContent = 'XSD — Ejercicios';
    sidebarSub.textContent = 'Esquemas y validación';
    sourcePanel.hidden = false;
    editor.placeholder = '<!-- Escribe tu XSD aquí -->';
  } else {
    sidebarTitle.textContent = 'XML — Ejercicios';
    sidebarSub.textContent = 'Estructura y marcado';
    sourcePanel.hidden = true;
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
  if (currentSection === 'xsd') {
    sourceTitle.textContent = `XML del ejercicio ${String(ex.id).padStart(2, '0')}`;
    sourceXml.textContent = ex.sourceXml || 'Sin XML de referencia para este ejercicio.';
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
    showFeedback('err', '⚠️', 'Editor vacío', 'Escribe tu XML antes de comprobar.');
    return;
  }

  // Fast local validation first
  const localResult = currentSection === 'xsd'
    ? validateXsdLocally(code, ex.validate)
    : validateLocally(code, ex.validate);
  if (!localResult.ok) {
    showFeedback('err', '✗', 'Estructura incorrecta', localResult.message);
    return;
  }

  // Strict structural validation against exercise reference XML.
  setLoading(true);
  try {
    const referenceResult = currentSection === 'xsd'
      ? await validateAgainstReferenceXsd(code, ex.solutionPath)
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
        : 'Tu XML coincide con la estructura esperada del ejercicio (etiquetas, orden y atributos).'
    );
  } catch (e) {
    showFeedback(
      'warn',
      '⚠',
      'No se pudo validar contra archivo',
      currentSection === 'xsd'
        ? 'No se pudo cargar el XSD de referencia del ejercicio. Revisa la ruta configurada y que estés ejecutando el proyecto con un servidor local.'
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
  if (sec !== 'xml' && sec !== 'xsd') {
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