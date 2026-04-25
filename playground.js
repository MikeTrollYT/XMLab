(function () {
  const DEFAULT_XML = '<?xml version="1.0" encoding="utf-8"?>\n<root>\n  <item>Ejemplo</item>\n</root>';

  const storageKeys = {
    xml: 'playground_xml',
    query: 'playground_query',
    mode: 'playground_mode',
  };

  const state = {
    xml: localStorage.getItem(storageKeys.xml) || DEFAULT_XML,
    query: localStorage.getItem(storageKeys.query) || '',
    mode: localStorage.getItem(storageKeys.mode) || 'xpath',
  };

  function getElements() {
    return {
      panel: document.getElementById('playground-panel'),
      xmlInput: document.getElementById('play-xml'),
      queryInput: document.getElementById('play-query'),
      modeSelect: document.getElementById('play-mode'),
      runBtn: document.getElementById('play-run'),
      clearBtn: document.getElementById('play-clear'),
      status: document.getElementById('play-status'),
      result: document.getElementById('play-result'),
      resultCount: document.getElementById('play-result-count'),
      resultTitle: document.getElementById('play-result-title'),
    };
  }

  function setStatus(type, message) {
    const { status } = getElements();
    if (!status) {
      return;
    }
    status.hidden = true;
    status.className = 'play-status ' + type;
    status.textContent = message;
  }

  function setResult(entries, errorMessage) {
    const { result, resultCount } = getElements();
    if (!result || !resultCount) {
      return;
    }

    if (errorMessage) {
      result.textContent = errorMessage;
      resultCount.textContent = '0';
      return;
    }

    if (!entries.length) {
      result.textContent = 'La consulta no devolvio resultados.';
      resultCount.textContent = '0';
      return;
    }

    result.textContent = entries.join('\n\n');
    resultCount.textContent = String(entries.length);
  }

  function persistState() {
    localStorage.setItem(storageKeys.xml, state.xml);
    localStorage.setItem(storageKeys.query, state.query);
    localStorage.setItem(storageKeys.mode, state.mode);
  }

  function updateQueryPlaceholder() {
    const { queryInput } = getElements();
    if (!queryInput) {
      return;
    }

    queryInput.placeholder = state.mode === 'xquery'
      ? 'for $a in doc("example.xml")/...'
      : '/root/...';
  }

  function insertSoftTab(event) {
    if (event.key !== 'Tab') {
      return;
    }

    event.preventDefault();
    const ta = event.target;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    ta.value = ta.value.substring(0, start) + '  ' + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + 2;

    if (ta.id === 'play-xml') {
      state.xml = ta.value;
    }
    if (ta.id === 'play-query') {
      state.query = ta.value;
    }

    persistState();
    validateSyntax();
  }

  function validateSyntax() {
    const xmlCode = (state.xml || '').trim();
    const queryCode = (state.query || '').trim();

    if (!xmlCode) {
      setStatus('warn', 'Pulsa Ejecutar para validar la consulta.');
      return { ok: false, message: 'Falta el XML de entrada.' };
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlCode, 'application/xml');
    if (xmlDoc.querySelector('parsererror')) {
      setStatus('warn', 'Pulsa Ejecutar para validar la consulta.');
      return { ok: false, message: 'El XML no es valido. Revisa la sintaxis.' };
    }

    if (!queryCode) {
      setStatus('warn', 'Pulsa Ejecutar para validar la consulta.');
      return { ok: false, message: 'Escribe una consulta XPath o XQuery.' };
    }

    const isXPath = state.mode === 'xpath';
    const evaluator = isXPath ? window.evaluateXPathExpression : window.evaluateXQueryExpression;
    if (typeof evaluator !== 'function') {
      setStatus('warn', 'Pulsa Ejecutar para validar la consulta.');
      return { ok: false, message: 'No se encontro el evaluador para esta consulta.' };
    }

    const evaluation = evaluator(queryCode, xmlCode);
    if (!evaluation.ok) {
      setStatus('warn', 'Pulsa Ejecutar para validar la consulta.');
      return { ok: false, message: evaluation.message };
    }

    setStatus('ok', `Sintaxis correcta (${state.mode.toUpperCase()}).`);
    return { ok: true, entries: evaluation.entries };
  }

  function runQuery() {
    const check = validateSyntax();
    if (!check.ok) {
      if (typeof window.showFeedback === 'function') {
        window.showFeedback('err', '✗', 'Estructura incorrecta', check.message || 'No se pudo ejecutar la consulta.');
      }
      return;
    }

    if (typeof window.closeFeedback === 'function') {
      window.closeFeedback();
    }
    setResult(check.entries);
  }

  function clearPlayground() {
    state.xml = DEFAULT_XML;
    state.query = '';
    state.mode = 'xpath';
    persistState();

    const { xmlInput, queryInput, modeSelect, result, resultCount } = getElements();
    if (xmlInput) {
      xmlInput.value = state.xml;
    }
    if (queryInput) {
      queryInput.value = state.query;
    }
    if (modeSelect) {
      modeSelect.value = state.mode;
    }
    updateQueryPlaceholder();
    if (result) {
      result.textContent = 'Aqui aparecera el resultado de la consulta.';
    }
    if (resultCount) {
      resultCount.textContent = '0';
    }

    validateSyntax();
  }

  function applyStateToInputs() {
    const { xmlInput, queryInput, modeSelect, resultTitle } = getElements();
    if (xmlInput) {
      xmlInput.value = state.xml;
    }
    if (queryInput) {
      queryInput.value = state.query;
    }
    if (modeSelect) {
      modeSelect.value = state.mode;
    }
    updateQueryPlaceholder();
    if (resultTitle) {
      resultTitle.textContent = 'Resultado';
    }
  }

  function onSectionEnter() {
    const { status } = getElements();
    if (status) {
      status.hidden = true;
    }
    applyStateToInputs();
    validateSyntax();
  }

  function init() {
    const { panel, xmlInput, queryInput, modeSelect, runBtn, clearBtn, status } = getElements();
    if (!panel || !xmlInput || !queryInput || !modeSelect || !runBtn || !clearBtn) {
      return;
    }

    if (status) {
      status.hidden = true;
    }

    applyStateToInputs();

    xmlInput.addEventListener('input', () => {
      state.xml = xmlInput.value;
      persistState();
      validateSyntax();
    });

    queryInput.addEventListener('input', () => {
      state.query = queryInput.value;
      persistState();
      validateSyntax();
    });

    modeSelect.addEventListener('change', () => {
      state.mode = modeSelect.value;
      persistState();
      updateQueryPlaceholder();
      validateSyntax();
    });

    xmlInput.addEventListener('keydown', insertSoftTab);
    queryInput.addEventListener('keydown', insertSoftTab);

    runBtn.addEventListener('click', runQuery);
    clearBtn.addEventListener('click', clearPlayground);

    validateSyntax();
  }

  window.playgroundController = {
    onSectionEnter,
  };

  init();
})();
