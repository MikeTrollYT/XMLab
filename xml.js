// ─── XML EXERCISES ──────────────────────────────────────────────────────────
const exercises = [
  {
    id: 1,
    solutionPath: 'XML/Ejercicio1/solucion.xml',
    title: "Directorio de personas",
    tag: "elementos básicos",
    desc: "Crea un documento XML que represente un directorio con al menos <strong>3 personas</strong>. Cada persona debe tener: <code>nombre</code>, <code>apellidos</code>, <code>email</code> y <code>telefono</code>. No olvides el prólogo XML.",
    requirements: [
      { label: "Prólogo", detail: "<?xml version=\"1.0\"?>" },
      { label: "Raíz única", detail: "<directorio>" },
      { label: "≥3 personas", detail: "<persona>" },
      { label: "4 campos por persona", detail: "nombre, apellidos, email, telefono" },
    ],
    hint: "Recuerda: todo XML debe tener UN solo elemento raíz. Dentro de <directorio> anida múltiples <persona>.",
    validate: {
      minElements: ["directorio", "persona", "nombre", "apellidos", "email", "telefono"],
      minRepeat: { tag: "persona", count: 3 },
      needsProlog: true,
    }
  },
  {
    id: 2,
    solutionPath: 'XML/Ejercicio2/solucion.xml',
    title: "Biblioteca de libros",
    tag: "anidamiento",
    desc: "Crea un XML para una <strong>biblioteca</strong>. Debe contener al menos <strong>3 libros</strong>. Cada libro tendrá: <code>titulo</code>, <code>autor</code>, <code>anio</code>, <code>isbn</code> y <code>genero</code>.",
    requirements: [
      { label: "Raíz", detail: "<biblioteca>" },
      { label: "≥3 libros", detail: "<libro>" },
      { label: "5 campos por libro", detail: "titulo, autor, anio, isbn, genero" },
    ],
    hint: "Estructura: <biblioteca> → <libro> → <titulo>, <autor>, <anio>, <isbn>, <genero>",
    validate: {
      minElements: ["biblioteca", "libro", "titulo", "autor", "anio", "isbn", "genero"],
      minRepeat: { tag: "libro", count: 3 },
      needsProlog: true,
    }
  },
  {
    id: 3,
    solutionPath: 'XML/Ejercicio3/solucion.xml',
    title: "Alumnos y notas",
    tag: "jerarquía",
    desc: "Crea un XML para un <strong>centro educativo</strong>. Debe haber al menos <strong>3 alumnos</strong>, y cada alumno tendrá: <code>nombre</code>, <code>apellidos</code>, <code>curso</code> y una lista de <code>asignaturas</code> (al menos 2 asignaturas por alumno, cada una con <code>nombre</code> y <code>nota</code>).",
    requirements: [
      { label: "Raíz", detail: "<centro_educativo>" },
      { label: "≥3 alumnos", detail: "<alumno>" },
      { label: "Asignaturas anidadas", detail: "<asignaturas><asignatura>" },
      { label: "nota en asignatura", detail: "<nota>" },
    ],
    hint: "Asignaturas va DENTRO de cada alumno: <alumno><nombre/><asignaturas><asignatura>...</asignatura></asignaturas></alumno>",
    validate: {
      minElements: ["centro_educativo", "alumno", "asignaturas", "asignatura", "nota"],
      minRepeat: { tag: "alumno", count: 3 },
      needsProlog: true,
    }
  },
  {
    id: 4,
    solutionPath: 'XML/Ejercicio4/solucion.xml',
    title: "Atributos: Catálogo de productos",
    tag: "atributos",
    desc: "Crea un <strong>catálogo</strong> de al menos <strong>4 productos</strong>. Cada producto debe usar <strong>atributos</strong>: el elemento <code>&lt;producto&gt;</code> debe tener los atributos <code>id</code> y <code>categoria</code>. Dentro de cada producto: <code>nombre</code>, <code>precio</code> y <code>stock</code>.",
    requirements: [
      { label: "Raíz", detail: "<catalogo>" },
      { label: "≥4 productos", detail: "<producto>" },
      { label: "Atributo id", detail: "id=\"...\"" },
      { label: "Atributo categoria", detail: "categoria=\"...\"" },
      { label: "3 campos", detail: "nombre, precio, stock" },
    ],
    hint: "Los atributos van DENTRO de la etiqueta de apertura: <producto id=\"1\" categoria=\"electronica\">",
    validate: {
      minElements: ["catalogo", "producto", "nombre", "precio", "stock"],
      minRepeat: { tag: "producto", count: 4 },
      needsProlog: true,
      attributes: [{ tag: "producto", attrs: ["id", "categoria"] }],
    }
  },
  {
    id: 5,
    solutionPath: 'XML/Ejercicio5/solucion.xml',
    title: "Elementos vacíos: Inventario",
    tag: "elementos vacíos",
    desc: "Crea un XML de <strong>inventario</strong> con al menos <strong>3 artículos</strong>. Cada artículo tiene: <code>nombre</code>, <code>cantidad</code> y un elemento vacío <code>&lt;agotado /&gt;</code> para marcar si está agotado (si tiene stock, también puede ser vacío).",
    requirements: [
      { label: "Raíz", detail: "<inventario>" },
      { label: "≥3 artículos", detail: "<articulo>" },
      { label: "Elemento vacío", detail: "<agotado />" },
    ],
    hint: "Un elemento vacío se escribe como <agotado/> o <agotado></agotado>. ¡Son equivalentes!",
    validate: {
      minElements: ["inventario", "articulo", "nombre", "cantidad"],
      minRepeat: { tag: "articulo", count: 3 },
      emptyElement: "agotado",
      needsProlog: true,
    }
  },
  {
    id: 6,
    solutionPath: 'XML/Ejercicio6/solucion.xml',
    title: "Empleados de empresa",
    tag: "mixto",
    desc: "Crea el XML de una <strong>empresa</strong> con al menos <strong>3 departamentos</strong>. Cada departamento tiene un atributo <code>id</code> y contiene al menos <strong>2 empleados</strong>. Cada empleado: <code>nombre</code>, <code>cargo</code>, <code>salario</code>.",
    requirements: [
      { label: "Raíz", detail: "<empresa>" },
      { label: "≥3 departamentos", detail: "<departamento id=\"...\">" },
      { label: "≥2 empleados por depto.", detail: "<empleado>" },
      { label: "3 campos por empleado", detail: "nombre, cargo, salario" },
    ],
    hint: "Estructura: empresa → departamento(id) → empleado → nombre, cargo, salario",
    validate: {
      minElements: ["empresa", "departamento", "empleado", "nombre", "cargo", "salario"],
      minRepeat: { tag: "departamento", count: 3 },
      attributes: [{ tag: "departamento", attrs: ["id"] }],
      needsProlog: true,
    }
  },
  {
    id: 7,
    solutionPath: 'XML/Ejercicio7/solucion.xml',
    title: "Menú de restaurante",
    tag: "jerarquía + atributos",
    desc: "Crea el menú de un <strong>restaurante</strong>. Debe tener al menos <strong>2 secciones</strong> (ej: <em>entrantes</em>, <em>principales</em>). Cada sección tiene un atributo <code>tipo</code> y contiene al menos <strong>3 platos</strong>. Cada plato: <code>nombre</code>, <code>descripcion</code>, <code>precio</code>, y el atributo <code>vegetariano</code> con valor <code>si</code> o <code>no</code>.",
    requirements: [
      { label: "Raíz", detail: "<menu>" },
      { label: "≥2 secciones", detail: "<seccion tipo=\"...\">" },
      { label: "≥3 platos por sección", detail: "<plato vegetariano=\"...\">" },
      { label: "3 campos por plato", detail: "nombre, descripcion, precio" },
    ],
    hint: "Los atributos pueden tener valores concretos: <plato vegetariano=\"si\"> o <plato vegetariano=\"no\">",
    validate: {
      minElements: ["menu", "seccion", "plato", "nombre", "precio"],
      minRepeat: { tag: "seccion", count: 2 },
      attributes: [
        { tag: "seccion", attrs: ["tipo"] },
        { tag: "plato", attrs: ["vegetariano"] },
      ],
      needsProlog: true,
    }
  },
  {
    id: 8,
    solutionPath: 'XML/Ejercicio8/solucion.xml',
    title: "Expediente médico",
    tag: "complejo",
    desc: "Crea un XML de <strong>expedientes médicos</strong> con al menos <strong>3 pacientes</strong>. Cada paciente tiene atributo <code>id</code> y los campos: <code>nombre</code>, <code>edad</code>, <code>grupo_sanguineo</code>. Además, cada paciente tiene una lista de <code>visitas</code> con al menos 2 <code>visita</code>, cada una con: <code>fecha</code>, <code>motivo</code> y <code>medico</code>.",
    requirements: [
      { label: "Raíz", detail: "<expedientes_medicos>" },
      { label: "≥3 pacientes", detail: "<paciente id=\"...\">" },
      { label: "Datos básicos", detail: "nombre, edad, grupo_sanguineo" },
      { label: "Historial de visitas", detail: "<visitas><visita>" },
      { label: "Datos de visita", detail: "fecha, motivo, medico" },
    ],
    hint: "¡Ejercicio complejo! Empieza por la estructura raíz y ve añadiendo niveles de anidamiento poco a poco.",
    validate: {
      minElements: ["expedientes_medicos", "paciente", "nombre", "edad", "visitas", "visita", "fecha"],
      minRepeat: { tag: "paciente", count: 3 },
      attributes: [{ tag: "paciente", attrs: ["id"] }],
      needsProlog: true,
    }
  },
];
