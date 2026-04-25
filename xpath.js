// ─── XPATH EXERCISES ────────────────────────────────────────────────────────
const xpathBaseXml = `<?xml version="1.0" encoding="utf-8"?>
<biblioteca>
  <libro id="L001" disponible="si">
    <titulo>Don Quijote</titulo>
    <autor>Cervantes</autor>
    <genero>Novela</genero>
    <año>1605</año>
    <paginas>863</paginas>
  </libro>
  <libro id="L002" disponible="no">
    <titulo>Cien años de soledad</titulo>
    <autor>García Márquez</autor>
    <genero>Novela</genero>
    <año>1967</año>
    <paginas>471</paginas>
  </libro>
  <libro id="L003" disponible="si">
    <titulo>1984</titulo>
    <autor>Orwell</autor>
    <genero>Distopía</genero>
    <año>1949</año>
    <paginas>328</paginas>
  </libro>
  <libro id="L004" disponible="no">
    <titulo>El principito</titulo>
    <autor>Saint-Exupéry</autor>
    <genero>Fábula</genero>
    <año>1943</año>
    <paginas>96</paginas>
  </libro>
  <libro id="L005" disponible="si">
    <titulo>Fahrenheit 451</titulo>
    <autor>Bradbury</autor>
    <genero>Distopía</genero>
    <año>1953</año>
    <paginas>256</paginas>
  </libro>
  <responsable>Ana López</responsable>
  <fecha>2024-04-01</fecha>
</biblioteca>`;

const xpathExercises = [
  {
    id: 1,
    expectedResultPath: 'XPath/Ejercicio1/resultado.txt',
    title: 'Títulos con ruta absoluta',
    tag: 'rutas absolutas',
    desc: 'Obtén el título de todos los libros del catálogo usando una ruta absoluta desde la raíz del documento.',
    requirements: [
      { label: 'Contexto', detail: 'XML de biblioteca fijo' },
      { label: 'Consulta', detail: 'ruta absoluta desde /' },
      { label: 'Objetivo', detail: 'todos los titulo' },
    ],
    hint: 'Empieza por /biblioteca y sigue bajando por libro hasta titulo.',
    sourceXml: xpathBaseXml,
  },
  {
    id: 2,
    expectedResultPath: 'XPath/Ejercicio2/resultado.txt',
    title: 'Atributos id de libros',
    tag: 'atributos',
    desc: 'Obtén los valores del atributo id de todos los libros.',
    requirements: [
      { label: 'Nodo objetivo', detail: 'atributo id' },
      { label: 'Ámbito', detail: 'todos los libro' },
      { label: 'Salida', detail: 'lista de atributos' },
    ],
    hint: 'Recuerda usar @ para atributos en XPath.',
    sourceXml: xpathBaseXml,
  },
  {
    id: 3,
    expectedResultPath: 'XPath/Ejercicio3/resultado.txt',
    title: 'Libro por id',
    tag: 'predicados',
    desc: 'Selecciona el nodo completo del libro con id igual a L003.',
    requirements: [
      { label: 'Filtro', detail: 'predicado por atributo' },
      { label: 'Resultado', detail: 'nodo libro completo' },
      { label: 'ID', detail: 'L003' },
    ],
    hint: 'Usa corchetes con una condición sobre @id.',
    sourceXml: xpathBaseXml,
  },
  {
    id: 4,
    expectedResultPath: 'XPath/Ejercicio4/resultado.txt',
    title: 'Libros de Distopía',
    tag: 'filtros por elemento',
    desc: 'Obtén todos los libros cuyo género sea Distopía.',
    requirements: [
      { label: 'Filtro', detail: 'genero="Distopía"' },
      { label: 'Resultado', detail: 'nodos libro' },
      { label: 'Coincidencias', detail: 'múltiples resultados' },
    ],
    hint: 'El predicado puede comparar el valor de un hijo directo.',
    sourceXml: xpathBaseXml,
  },
  {
    id: 5,
    expectedResultPath: 'XPath/Ejercicio5/resultado.txt',
    title: 'Novela disponible',
    tag: 'condiciones compuestas',
    desc: 'Selecciona los libros de género Novela y que además estén disponibles.',
    requirements: [
      { label: 'Condición 1', detail: 'genero="Novela"' },
      { label: 'Condición 2', detail: '@disponible="si"' },
      { label: 'Operador', detail: 'and' },
    ],
    hint: 'Combina ambas condiciones en el mismo predicado con and.',
    sourceXml: xpathBaseXml,
  },
  {
    id: 6,
    expectedResultPath: 'XPath/Ejercicio6/resultado.txt',
    title: 'Segundo libro',
    tag: 'posición',
    desc: 'Obtén el título del segundo libro del catálogo usando la función de posición.',
    requirements: [
      { label: 'Función', detail: '[posicion]' },
      { label: 'Índice', detail: '2' },
      { label: 'Salida', detail: 'titulo' },
    ],
    hint: 'Filtra libro por [2] y luego baja a titulo.',
    sourceXml: xpathBaseXml,
  },
  {
    id: 7,
    expectedResultPath: 'XPath/Ejercicio7/resultado.txt',
    title: 'Autor del último libro',
    tag: 'last()',
    desc: 'Obtén el autor del último libro que aparece en la biblioteca.',
    requirements: [
      { label: 'Función', detail: 'last()' },
      { label: 'Nodo final', detail: 'último libro' },
      { label: 'Salida', detail: 'autor' },
    ],
    hint: 'Aplica last() sobre libro y después selecciona autor.',
    sourceXml: xpathBaseXml,
  },
  {
    id: 8,
    expectedResultPath: 'XPath/Ejercicio8/resultado.txt',
    title: 'Todas las páginas',
    tag: 'búsqueda global',
    desc: 'Selecciona todos los elementos paginas que existan en cualquier nivel del documento.',
    requirements: [
      { label: 'Ruta', detail: '//paginas' },
      { label: 'Ámbito', detail: 'cualquier nivel' },
      { label: 'Salida', detail: 'todos los nodos paginas' },
    ],
    hint: 'Usa el eje de descendencia global con doble slash.',
    sourceXml: xpathBaseXml,
  },
  {
    id: 9,
    expectedResultPath: 'XPath/Ejercicio9/resultado.txt',
    title: 'Libros posteriores a 1950',
    tag: 'comparaciones numéricas',
    desc: 'Obtén todos los libros cuyo año sea mayor que 1950.',
    requirements: [
      { label: 'Filtro', detail: 'año > 1950' },
      { label: 'Ruta', detail: 'usa un predicado sobre libro' },
      { label: 'Resultado', detail: 'nodos libro completos' },
    ],
    hint: 'Usa un predicado con comparación numérica sobre el hijo año.',
    sourceXml: xpathBaseXml,
  },
];
