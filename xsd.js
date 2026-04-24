// ─── XSD EXERCISES ──────────────────────────────────────────────────────────
const xsdExercises = [
  {
    id: 1,
    solutionPath: 'XSD/Ejercicio1/solucion.xsd',
    title: 'Esquema para libro',
    tag: 'elementos simples',
    desc: 'Define un XSD para validar el siguiente XML de un libro. Debes definir la estructura del elemento raíz y sus campos en orden.',
    requirements: [
      { label: 'Raíz XML', detail: '<libro>' },
      { label: 'Campos', detail: 'titulo, autor, paginas' },
      { label: 'Orden', detail: 'mantener secuencia del XML' },
      { label: 'Esquema', detail: '<xs:schema> válido' },
    ],
    hint: 'Empieza por <xs:element name="libro"> y dentro usa <xs:sequence> para titulo, autor y paginas.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<libro>\n  <titulo>Don Quijote</titulo>\n  <autor>Miguel de Cervantes</autor>\n  <paginas>1345</paginas>\n</libro>`,
    validate: {
      expectedRoot: 'libro',
      requiredElementNames: ['titulo', 'autor', 'paginas'],
    }
  },
  {
    id: 2,
    solutionPath: 'XSD/Ejercicio2/solucion.xsd',
    title: 'Esquema para persona',
    tag: 'tipos básicos',
    desc: 'Crea el XSD para una persona con datos básicos y valor booleano de estado.',
    requirements: [
      { label: 'Raíz XML', detail: '<persona>' },
      { label: 'Campos', detail: 'nombre, edad, email, activo' },
      { label: 'Tipo booleano', detail: 'activo' },
      { label: 'Esquema', detail: '<xs:schema> válido' },
    ],
    hint: 'Puedes usar xs:string, xs:int, xs:string y xs:boolean para los elementos del ejemplo.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<persona>\n  <nombre>Ana García</nombre>\n  <edad>28</edad>\n  <email>ana@correo.com</email>\n  <activo>true</activo>\n</persona>`,
    validate: {
      expectedRoot: 'persona',
      requiredElementNames: ['nombre', 'edad', 'email', 'activo'],
    }
  },
  {
    id: 3,
    solutionPath: 'XSD/Ejercicio3/solucion.xsd',
    title: 'Esquema para producto con atributo',
    tag: 'atributos',
    desc: 'Crea un XSD para el XML de producto, incluyendo el atributo id del elemento raíz.',
    requirements: [
      { label: 'Raíz XML', detail: '<producto id="...">' },
      { label: 'Campos', detail: 'nombre, precio, stock' },
      { label: 'Atributo', detail: 'id en producto' },
      { label: 'Esquema', detail: '<xs:schema> válido' },
    ],
    hint: 'Recuerda definir <xs:attribute name="id"> dentro del tipo complejo de producto.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<producto id="P001">\n  <nombre>Teclado mecánico</nombre>\n  <precio>89.99</precio>\n  <stock>150</stock>\n</producto>`,
    validate: {
      expectedRoot: 'producto',
      requiredElementNames: ['nombre', 'precio', 'stock'],
      requiredAttributes: ['id'],
    }
  },
  {
    id: 4,
    solutionPath: 'XSD/Ejercicio4/solucion.xsd',
    title: 'Esquema para nota académica',
    tag: 'secuencia',
    desc: 'Crea el XSD para una nota con alumno, asignatura, calificación y fecha.',
    requirements: [
      { label: 'Raíz XML', detail: '<nota>' },
      { label: 'Campos', detail: 'alumno, asignatura, calificacion, fecha' },
      { label: 'Fecha', detail: 'tipo fecha adecuado' },
      { label: 'Esquema', detail: '<xs:schema> válido' },
    ],
    hint: 'Para fecha puedes usar xs:date y mantener el orden exacto de la secuencia.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<nota>\n  <alumno>Carlos López</alumno>\n  <asignatura>Matemáticas</asignatura>\n  <calificacion>8</calificacion>\n  <fecha>2024-06-15</fecha>\n</nota>`,
    validate: {
      expectedRoot: 'nota',
      requiredElementNames: ['alumno', 'asignatura', 'calificacion', 'fecha'],
    }
  },
  {
    id: 5,
    solutionPath: 'XSD/Ejercicio5/solucion.xsd',
    title: 'Esquema para vehículo',
    tag: 'restricciones simples',
    desc: 'Crea un XSD para un vehículo con marca, modelo, tipo y año.',
    requirements: [
      { label: 'Raíz XML', detail: '<vehiculo>' },
      { label: 'Campos', detail: 'marca, modelo, tipo, año' },
      { label: 'Orden', detail: 'mantener secuencia del XML' },
      { label: 'Esquema', detail: '<xs:schema> válido' },
    ],
    hint: 'Puedes declarar año como entero y tipo como texto o restricción enumerada.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<vehiculo>\n  <marca>Toyota</marca>\n  <modelo>Corolla</modelo>\n  <tipo>gasolina</tipo>\n  <año>2022</año>\n</vehiculo>`,
    validate: {
      expectedRoot: 'vehiculo',
      requiredElementNames: ['marca', 'modelo', 'tipo', 'año'],
    }
  },
  {
    id: 6,
    solutionPath: 'XSD/Ejercicio6/solucion.xsd',
    title: 'Esquema para pedido con repetición',
    tag: 'ocurrencias',
    desc: 'Crea el XSD para un pedido con atributo numero y múltiples artículos.',
    requirements: [
      { label: 'Raíz XML', detail: '<pedido numero="...">' },
      { label: 'Campos', detail: 'cliente, articulo+, total' },
      { label: 'Atributo', detail: 'numero en pedido' },
      { label: 'Esquema', detail: '<xs:schema> válido' },
    ],
    hint: 'Define articulo con maxOccurs="unbounded" o un valor mayor que 1.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<pedido numero="2024001">\n  <cliente>María Torres</cliente>\n  <articulo>Monitor 27"</articulo>\n  <articulo>Ratón inalámbrico</articulo>\n  <articulo>Alfombrilla</articulo>\n  <total>345.50</total>\n</pedido>`,
    validate: {
      expectedRoot: 'pedido',
      requiredElementNames: ['cliente', 'articulo', 'total'],
      requiredAttributes: ['numero'],
    }
  },
  {
    id: 7,
    solutionPath: 'XSD/Ejercicio7/solucion.xsd',
    title: 'Esquema para empleado',
    tag: 'datos personales',
    desc: 'Define el XSD para empleado con dni, nombre, departamento, salario y teléfono.',
    requirements: [
      { label: 'Raíz XML', detail: '<empleado>' },
      { label: 'Campos', detail: 'dni, nombre, departamento, salario, telefono' },
      { label: 'Orden', detail: 'mantener secuencia del XML' },
      { label: 'Esquema', detail: '<xs:schema> válido' },
    ],
    hint: 'Si quieres afinar, puedes restringir patrones para dni y telefono.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<empleado>\n  <dni>12345678A</dni>\n  <nombre>Luis Martín</nombre>\n  <departamento>Informática</departamento>\n  <salario>2500.00</salario>\n  <telefono>612345678</telefono>\n</empleado>`,
    validate: {
      expectedRoot: 'empleado',
      requiredElementNames: ['dni', 'nombre', 'departamento', 'salario', 'telefono'],
    }
  },
  {
    id: 8,
    solutionPath: 'XSD/Ejercicio8/solucion.xsd',
    title: 'Esquema para biblioteca avanzada',
    tag: 'anidamiento + atributos',
    desc: 'Crea un XSD para biblioteca con atributo nombre y múltiples libros con isbn.',
    requirements: [
      { label: 'Raíz XML', detail: '<biblioteca nombre="...">' },
      { label: 'Repetición', detail: '<libro> repetido' },
      { label: 'Atributos', detail: 'nombre en biblioteca, isbn en libro' },
      { label: 'Campos libro', detail: 'titulo, autor, genero' },
    ],
    hint: 'Define libro con maxOccurs y su atributo isbn dentro de su tipo complejo.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<biblioteca nombre="Biblioteca Central">\n  <libro isbn="978-1234">\n    <titulo>Clean Code</titulo>\n    <autor>Robert Martin</autor>\n    <genero>técnico</genero>\n  </libro>\n  <libro isbn="978-5678">\n    <titulo>El Hobbit</titulo>\n    <autor>J.R.R. Tolkien</autor>\n    <genero>fantasía</genero>\n  </libro>\n</biblioteca>`,
    validate: {
      expectedRoot: 'biblioteca',
      requiredElementNames: ['libro', 'titulo', 'autor', 'genero'],
      requiredAttributes: ['nombre', 'isbn'],
    }
  },
];
