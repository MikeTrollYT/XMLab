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
    desc: "Crea un XML para una <strong>biblioteca</strong>. Debe contener al menos <strong>3 libros</strong>. Cada libro tendrá: <code>titulo</code>, <code>autor</code>, <code>año</code>, <code>isbn</code> y <code>genero</code>.",
    requirements: [
      { label: "Raíz", detail: "<biblioteca>" },
      { label: "≥3 libros", detail: "<libro>" },
      { label: "5 campos por libro", detail: "titulo, autor, año, isbn, genero" },
    ],
    hint: "Estructura: <biblioteca> → <libro> → <titulo>, <autor>, <año>, <isbn>, <genero>",
    validate: {
      minElements: ["biblioteca", "libro", "titulo", "autor", "año", "isbn", "genero"],
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
    desc: "Crea el <strong>menú</strong> de un restaurante. Debe tener al menos <strong>2 secciones</strong> (ej: <em>entrantes</em>, <em>principales</em>). Cada sección tiene un atributo <code>tipo</code> y contiene al menos <strong>3 platos</strong>. Cada plato: <code>nombre</code>, <code>descripcion</code>, <code>precio</code>, y el atributo <code>vegetariano</code> con valor <code>si</code> o <code>no</code>.",
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
  {
    id: 9,
    solutionPath: 'XML/Ejercicio9/solucion.xml',
    title: "Colección de películas",
    tag: "anidamiento + atributos",
    desc: "Crea un XML para una <strong>videoteca</strong> con al menos <strong>4 películas</strong>. El elemento <code>&lt;pelicula&gt;</code> debe tener el atributo <code>id</code>. Cada película tendrá: <code>titulo</code>, <code>director</code>, <code>año</code>, <code>duracion</code> (en minutos) y <code>genero</code>.",
    requirements: [
      { label: "Prólogo", detail: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" },
      { label: "Raíz", detail: "<videoteca>" },
      { label: "≥4 películas", detail: "<pelicula id=\"...\">" },
      { label: "5 campos por película", detail: "titulo, director, año, duracion, genero" },
    ],
    hint: "Recuerda: los atributos van dentro de la etiqueta de apertura y el valor siempre entre comillas: <pelicula id=\"1\">",
    validate: {
      minElements: ["videoteca", "pelicula", "titulo", "director", "año", "duracion", "genero"],
      minRepeat: { tag: "pelicula", count: 4 },
      needsProlog: true,
      attributes: [{ tag: "pelicula", attrs: ["id"] }],
    }
  },
  {
    id: 10,
    solutionPath: 'XML/Ejercicio10/solucion.xml',
    title: "Agenda de contactos con elementos vacíos",
    tag: "elementos vacíos",
    desc: "Crea una <strong>agenda</strong> con al menos <strong>4 contactos</strong>. Cada contacto tiene: <code>nombre</code>, <code>telefono</code>, <code>email</code> y los elementos vacíos <code>&lt;movil /&gt;</code> y <code>&lt;fax /&gt;</code> para indicar disponibilidad de esos medios.",
    requirements: [
      { label: "Prólogo con encoding", detail: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" },
      { label: "Raíz", detail: "<agenda>" },
      { label: "≥4 contactos", detail: "<contacto>" },
      { label: "Elementos vacíos", detail: "<movil /> y <fax />" },
    ],
    hint: "Un elemento vacío se escribe <movil /> o <movil></movil>. Ambas formas son equivalentes según el estándar XML.",
    validate: {
      minElements: ["agenda", "contacto", "nombre", "telefono", "email"],
      minRepeat: { tag: "contacto", count: 4 },
      needsProlog: true,
      emptyElement: "movil",
    }
  },
  {
    id: 11,
    solutionPath: 'XML/Ejercicio11/solucion.xml',
    title: "Tienda de música",
    tag: "jerarquía + atributos",
    desc: "Crea un XML para una <strong>tienda de música</strong>. Debe tener al menos <strong>3 artistas</strong>, cada uno con atributo <code>id</code> y <code>genero</code>. Dentro de cada artista tiene un atributo <code>nombre</code> y al menos <strong>2 álbumes</strong> con: <code>titulo</code>, <code>año</code> y <code>precio</code>.",
    requirements: [
      { label: "Raíz", detail: "<tienda_musica>" },
      { label: "≥3 artistas", detail: "<artista id=\"...\" genero=\"...\">" },
      { label: "≥2 álbumes por artista", detail: "<album>" },
      { label: "3 campos por álbum", detail: "titulo, año, precio" },
    ],
    hint: "Un elemento puede tener varios atributos: <artista id=\"1\" genero=\"rock\">. El orden de los atributos no importa.",
    validate: {
      minElements: ["tienda_musica", "artista", "album", "titulo", "año", "precio"],
      minRepeat: { tag: "artista", count: 3 },
      needsProlog: true,
      attributes: [{ tag: "artista", attrs: ["id", "genero"] }],
    }
  },
  {
    id: 12,
    solutionPath: 'XML/Ejercicio12/solucion.xml',
    title: "Horario escolar",
    tag: "jerarquía",
    desc: "Crea un XML con el <strong>horario semanal</strong> de una clase. Debe tener al menos <strong>3 días</strong>. Cada día tiene un atributo <code>nombre</code> (ej: lunes) y contiene al menos <strong>3 clases</strong>. Cada clase tiene: <code>hora</code>, <code>asignatura</code> y <code>aula</code>.",
    requirements: [
      { label: "Raíz", detail: "<horario>" },
      { label: "≥3 días", detail: "<dia nombre=\"...\">" },
      { label: "≥3 clases por día", detail: "<clase>" },
      { label: "3 campos por clase", detail: "hora, asignatura, aula" },
    ],
    hint: "El atributo va en la etiqueta del día: <dia nombre=\"lunes\">. Luego anida las clases dentro.",
    validate: {
      minElements: ["horario", "dia", "clase", "hora", "asignatura", "aula"],
      minRepeat: { tag: "dia", count: 3 },
      needsProlog: true,
      attributes: [{ tag: "dia", attrs: ["nombre"] }],
    }
  },
  {
    id: 13,
    solutionPath: 'XML/Ejercicio13/solucion.xml',
    title: "Torneos deportivos",
    tag: "complejo",
    desc: "Crea un XML de <strong>torneos deportivos</strong> con al menos <strong>2 torneos</strong>. Cada torneo tiene atributo <code>id</code> y <code>deporte</code>, y los campos <code>nombre</code> y <code>sede</code>. Dentro de cada torneo, al menos <strong>3 equipos</strong>, cada equipo con: <code>nombre_equipo</code>, <code>ciudad</code> y un elemento vacío <code>&lt;clasificado /&gt;</code>.",
    requirements: [
      { label: "Raíz", detail: "<torneos>" },
      { label: "≥2 torneos", detail: "<torneo id=\"...\" deporte=\"...\">" },
      { label: "Datos del torneo", detail: "nombre, sede" },
      { label: "≥3 equipos por torneo", detail: "<equipo>" },
      { label: "Elemento vacío", detail: "<clasificado />" },
    ],
    hint: "Estructura: torneos → torneo(id, deporte) → nombre, sede, equipos → equipo → nombre_equipo, ciudad, clasificado",
    validate: {
      minElements: ["torneos", "torneo", "nombre", "sede", "equipos", "equipo", "nombre_equipo", "ciudad"],
      minRepeat: { tag: "torneo", count: 2 },
      needsProlog: true,
      attributes: [{ tag: "torneo", attrs: ["id", "deporte"] }],
      emptyElement: "clasificado",
    }
  },
  {
    id: 14,
    solutionPath: 'XML/Ejercicio14/solucion.xml',
    title: "Red de sucursales bancarias",
    tag: "muy complejo",
    desc: "Crea un XML de un <strong>banco</strong> con al menos <strong>3 sucursales</strong>. Cada sucursal tiene atributo <code>id</code> y <code>ciudad</code>. Dentro de cada sucursal: <code>direccion</code>, <code>telefono</code> y una lista de <code>empleados</code> con al menos <strong>2 empleados</strong>. Cada empleado tiene atributo <code>id</code> y los campos: <code>nombre</code>, <code>cargo</code>, <code>salario</code> y el elemento vacío <code>&lt;turno_noche /&gt;</code>.",
    requirements: [
      { label: "Raíz", detail: "<banco>" },
      { label: "≥3 sucursales", detail: "<sucursal id=\"...\" ciudad=\"...\">" },
      { label: "Datos de sucursal", detail: "direccion, telefono" },
      { label: "≥2 empleados por sucursal", detail: "<empleado id=\"...\">" },
      { label: "Datos de empleado", detail: "nombre, cargo, salario" },
      { label: "Elemento vacío", detail: "<turno_noche />" },
    ],
    hint: "¡El más complejo! Ve nivel a nivel: banco → sucursal → empleados → empleado. Cuida que cada etiqueta de apertura tenga su cierre correcto.",
    validate: {
      minElements: ["banco", "sucursal", "direccion", "telefono", "empleados", "empleado", "nombre", "cargo", "salario"],
      minRepeat: { tag: "sucursal", count: 3 },
      needsProlog: true,
      attributes: [
        { tag: "sucursal", attrs: ["id", "ciudad"] },
        { tag: "empleado", attrs: ["id"] },
      ],
      emptyElement: "turno_noche",
    }
  },
];
