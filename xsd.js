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
  {
    id: 9,
    solutionPath: 'XSD/Ejercicio9/solucion.xsd',
    title: 'Esquema para película con atributo',
    tag: 'atributos',
    desc: 'Crea un XSD para el XML de una película. El elemento raíz <code>&lt;pelicula&gt;</code> tiene el atributo <code>id</code>. Dentro: <code>titulo</code>, <code>director</code>, <code>año</code> y <code>duracion</code>.',
    requirements: [
      { label: 'Raíz XML', detail: '<pelicula id="...">' },
      { label: 'Campos', detail: 'titulo, director, año, duracion' },
      { label: 'Atributo', detail: 'id en pelicula (required)' },
      { label: 'Esquema', detail: '<xs:schema> válido' },
    ],
    hint: 'Recuerda: tener atributo convierte al elemento en complexType. Declara el atributo id con use="required" después de la secuencia.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<pelicula id="P01">\n  <titulo>El laberinto del fauno</titulo>\n  <director>Guillermo del Toro</director>\n  <año>2006</año>\n  <duracion>118</duracion>\n</pelicula>`,
    validate: {
      expectedRoot: 'pelicula',
      requiredElementNames: ['titulo', 'director', 'año', 'duracion'],
      requiredAttributes: ['id'],
    }
  },
  {
    id: 10,
    solutionPath: 'XSD/Ejercicio10/solucion.xsd',
    title: 'Esquema para nota con restricción numérica',
    tag: 'restricciones',
    desc: 'Crea un XSD para una nota escolar. El campo <code>calificacion</code> debe ser un entero entre 0 y 10 usando <code>simpleType</code> con restricción. Los demás campos: <code>alumno</code>, <code>asignatura</code> y <code>fecha</code>.',
    requirements: [
      { label: 'Raíz XML', detail: '<nota>' },
      { label: 'Campos', detail: 'alumno, asignatura, calificacion, fecha' },
      { label: 'Restricción', detail: 'calificacion: entero entre 0 y 10' },
      { label: 'Facetas', detail: 'minInclusive y maxInclusive' },
    ],
    hint: 'Define un <xs:simpleType> con <xs:restriction base="xs:integer"> y usa minInclusive value="0" y maxInclusive value="10".',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<nota>\n  <alumno>Laura Pérez</alumno>\n  <asignatura>Historia</asignatura>\n  <calificacion>8</calificacion>\n  <fecha>2024-05-20</fecha>\n</nota>`,
    validate: {
      expectedRoot: 'nota',
      requiredElementNames: ['alumno', 'asignatura', 'calificacion', 'fecha'],
    }
  },
  {
    id: 11,
    solutionPath: 'XSD/Ejercicio11/solucion.xsd',
    title: 'Esquema para vehículo con enumeración',
    tag: 'restricciones + enumeración',
    desc: 'Crea un XSD para un vehículo. El campo <code>tipo</code> solo puede tomar los valores: <em>gasolina</em>, <em>diesel</em> o <em>electrico</em>. Los demás: <code>marca</code>, <code>modelo</code> y <code>año</code>.',
    requirements: [
      { label: 'Raíz XML', detail: '<vehiculo>' },
      { label: 'Campos', detail: 'marca, modelo, tipo, año' },
      { label: 'Enumeración', detail: 'tipo: gasolina | diesel | electrico' },
      { label: 'Faceta', detail: 'xs:enumeration' },
    ],
    hint: 'Define un <xs:simpleType> para tipo con <xs:restriction base="xs:string"> y tres <xs:enumeration value="..."/>.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<vehiculo>\n  <marca>Toyota</marca>\n  <modelo>Yaris</modelo>\n  <tipo>electrico</tipo>\n  <año>2023</año>\n</vehiculo>`,
    validate: {
      expectedRoot: 'vehiculo',
      requiredElementNames: ['marca', 'modelo', 'tipo', 'año'],
    }
  },
  {
    id: 12,
    solutionPath: 'XSD/Ejercicio12/solucion.xsd',
    title: 'Esquema para tienda con artículos repetidos',
    tag: 'ocurrencias',
    desc: 'Crea un XSD para una tienda. El elemento raíz <code>&lt;tienda&gt;</code> tiene el atributo <code>nombre</code>. Dentro: <code>direccion</code>, uno o más <code>&lt;producto&gt;</code> (con <code>maxOccurs="unbounded"</code>), y <code>total_productos</code>. Cada producto tiene: <code>nombre</code> y <code>precio</code>.',
    requirements: [
      { label: 'Raíz XML', detail: '<tienda nombre="...">' },
      { label: 'Atributo', detail: 'nombre en tienda (required)' },
      { label: 'Repetición', detail: '<producto> con maxOccurs="unbounded"' },
      { label: 'Campos producto', detail: 'nombre, precio' },
      { label: 'Campo extra', detail: 'direccion, total_productos' },
    ],
    hint: 'producto es un complexType anidado con su propia sequence. Declara maxOccurs="unbounded" en el elemento producto.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<tienda nombre="Electro Sur">\n  <direccion>Calle Mayor 5, Almería</direccion>\n  <producto>\n    <nombre>Televisor</nombre>\n    <precio>399.99</precio>\n  </producto>\n  <producto>\n    <nombre>Tablet</nombre>\n    <precio>249.50</precio>\n  </producto>\n  <total_productos>2</total_productos>\n</tienda>`,
    validate: {
      expectedRoot: 'tienda',
      requiredElementNames: ['direccion', 'producto', 'nombre', 'precio', 'total_productos'],
      requiredAttributes: ['nombre'],
    }
  },
  {
    id: 13,
    solutionPath: 'XSD/Ejercicio13/solucion.xsd',
    title: 'Esquema para empleado con restricción de salario',
    tag: 'restricciones numéricas',
    desc: 'Crea un XSD para un empleado. Los campos son: <code>dni</code>, <code>nombre</code>, <code>departamento</code>, <code>salario</code> y <code>activo</code>. El campo <code>salario</code> debe ser decimal con valor mínimo de 1000 y máximo de 9999 usando restricción.',
    requirements: [
      { label: 'Raíz XML', detail: '<empleado>' },
      { label: 'Campos', detail: 'dni, nombre, departamento, salario, activo' },
      { label: 'Restricción', detail: 'salario: decimal entre 1000 y 9999' },
      { label: 'Facetas', detail: 'minInclusive y maxInclusive' },
      { label: 'Booleano', detail: 'activo: xs:boolean' },
    ],
    hint: 'Define un simpleType para salario con restriction base="xs:decimal". Para activo usa directamente type="xs:boolean".',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<empleado>\n  <dni>87654321B</dni>\n  <nombre>Marta Ruiz</nombre>\n  <departamento>Ventas</departamento>\n  <salario>2200.00</salario>\n  <activo>true</activo>\n</empleado>`,
    validate: {
      expectedRoot: 'empleado',
      requiredElementNames: ['dni', 'nombre', 'departamento', 'salario', 'activo'],
    }
  },
  {
    id: 14,
    solutionPath: 'XSD/Ejercicio14/solucion.xsd',
    title: 'Esquema para biblioteca con libros y atributos',
    tag: 'anidamiento + atributos + ocurrencias',
    desc: 'Crea un XSD para una biblioteca. El elemento raíz <code>&lt;biblioteca&gt;</code> tiene el atributo <code>ciudad</code>. Contiene uno o más <code>&lt;libro&gt;</code>, cada libro con atributo <code>isbn</code> y los campos: <code>titulo</code>, <code>autor</code> (puede repetirse, <code>minOccurs="0" maxOccurs="unbounded"</code>) y <code>paginas</code>.',
    requirements: [
      { label: 'Raíz XML', detail: '<biblioteca ciudad="...">' },
      { label: 'Atributo raíz', detail: 'ciudad (required)' },
      { label: 'Repetición', detail: '<libro> con maxOccurs="unbounded"' },
      { label: 'Atributo libro', detail: 'isbn (required)' },
      { label: 'Campos libro', detail: 'titulo, autor (0..n), paginas' },
    ],
    hint: '¡El más complejo! Dos niveles con atributos. Cada libro es un complexType con su sequence y su propio xs:attribute isbn.',
    sourceXml: `<?xml version="1.0" encoding="UTF-8"?>\n<biblioteca ciudad="Almería">\n  <libro isbn="978-1111">\n    <titulo>Clean Code</titulo>\n    <autor>Robert Martin</autor>\n    <paginas>431</paginas>\n  </libro>\n  <libro isbn="978-2222">\n    <titulo>El Quijote</titulo>\n    <autor>Cervantes</autor>\n    <autor>Anónimo</autor>\n    <paginas>1345</paginas>\n  </libro>\n</biblioteca>`,
    validate: {
      expectedRoot: 'biblioteca',
      requiredElementNames: ['libro', 'titulo', 'autor', 'paginas'],
      requiredAttributes: ['ciudad', 'isbn'],
    }
  },
];
