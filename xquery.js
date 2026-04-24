// ─── XQUERY EXERCISES ───────────────────────────────────────────────────────
const xqueryBaseXml = `<?xml version="1.0" encoding="utf-8"?>
<tienda>
  <producto id="P001" categoria="electronica">
    <nombre>Auriculares BT</nombre>
    <precio>49.99</precio>
    <stock>30</stock>
    <valoracion>4.2</valoracion>
  </producto>
  <producto id="P002" categoria="electronica">
    <nombre>Teclado mecánico</nombre>
    <precio>89.95</precio>
    <stock>15</stock>
    <valoracion>4.7</valoracion>
  </producto>
  <producto id="P003" categoria="hogar">
    <nombre>Lámpara LED</nombre>
    <precio>22.50</precio>
    <stock>50</stock>
    <valoracion>3.8</valoracion>
  </producto>
  <producto id="P004" categoria="hogar">
    <nombre>Cafetera express</nombre>
    <precio>119.00</precio>
    <stock>8</stock>
    <valoracion>4.5</valoracion>
  </producto>
  <producto id="P005" categoria="deporte">
    <nombre>Esterilla yoga</nombre>
    <precio>18.00</precio>
    <stock>60</stock>
    <valoracion>4.0</valoracion>
  </producto>
  <producto id="P006" categoria="deporte">
    <nombre>Mancuernas 10kg</nombre>
    <precio>35.00</precio>
    <stock>20</stock>
    <valoracion>4.3</valoracion>
  </producto>
</tienda>`;

const xqueryExercises = [
  {
    id: 1,
    expectedResultPath: 'XQuery/Ejercicio1/resultado.txt',
    title: 'Nombres con FOR',
    tag: 'for básico',
    desc: 'Obtén el nombre de todos los productos de la tienda usando una expresión FOR básica.',
    requirements: [
      { label: 'Estructura', detail: 'for ... return ...' },
      { label: 'Origen', detail: 'productos de tienda.xml' },
      { label: 'Salida', detail: 'nodos nombre' },
    ],
    hint: 'Recorre doc("tienda.xml")//producto y devuelve $p/nombre.',
    sourceXml: xqueryBaseXml,
  },
  {
    id: 2,
    expectedResultPath: 'XQuery/Ejercicio2/resultado.txt',
    title: 'Electrónica: nombre y precio',
    tag: 'for + where',
    desc: 'Devuelve el nombre y el precio de todos los productos cuya categoría sea electronica.',
    requirements: [
      { label: 'Filtro', detail: '@categoria = "electronica"' },
      { label: 'Salida', detail: 'elementos item con nombre y precio' },
      { label: 'FLWOR', detail: 'for where return' },
    ],
    hint: 'Filtra por atributo categoria y construye <item>{...}</item>.',
    sourceXml: xqueryBaseXml,
  },
  {
    id: 3,
    expectedResultPath: 'XQuery/Ejercicio3/resultado.txt',
    title: 'Contar productos',
    tag: 'let + count',
    desc: 'Usa LET para guardar todos los productos en una variable y devuelve cuántos hay en total con count().',
    requirements: [
      { label: 'LET', detail: 'guardar secuencia en variable' },
      { label: 'Función', detail: 'count()' },
      { label: 'Salida', detail: 'valor numérico total' },
    ],
    hint: 'Guarda doc("tienda.xml")//producto en una variable y aplica count().',
    sourceXml: xqueryBaseXml,
  },
  {
    id: 4,
    expectedResultPath: 'XQuery/Ejercicio4/resultado.txt',
    title: 'Orden por precio',
    tag: 'order by',
    desc: 'Devuelve el nombre y el precio de todos los productos ordenados de mayor a menor precio.',
    requirements: [
      { label: 'Orden', detail: 'order by ... descending' },
      { label: 'Salida', detail: 'elementos producto con nombre y precio' },
      { label: 'Cobertura', detail: 'todos los productos' },
    ],
    hint: 'Ordena por $p/precio descending antes del return.',
    sourceXml: xqueryBaseXml,
  },
  {
    id: 5,
    expectedResultPath: 'XQuery/Ejercicio5/resultado.txt',
    title: 'Estado por stock',
    tag: 'if then else',
    desc: 'Recorre todos los productos y devuelve su nombre junto con una etiqueta estado que diga Bajo stock si stock<20 o Disponible en caso contrario.',
    requirements: [
      { label: 'Condición', detail: 'if ($p/stock < 20)' },
      { label: 'Salida', detail: 'producto con nombre y estado' },
      { label: 'Ramas', detail: 'then/else' },
    ],
    hint: 'Dentro del return usa if ... then <estado>...</estado> else ...',
    sourceXml: xqueryBaseXml,
  },
  {
    id: 6,
    expectedResultPath: 'XQuery/Ejercicio6/resultado.txt',
    title: 'Precio medio',
    tag: 'let + avg',
    desc: 'Calcula el precio medio de todos los productos de la tienda usando LET y la función avg().',
    requirements: [
      { label: 'LET', detail: 'guardar precios en variable' },
      { label: 'Función', detail: 'avg()' },
      { label: 'Salida', detail: 'elemento precioMedio' },
    ],
    hint: 'Guarda //producto/precio y luego devuelve <precioMedio>{avg(...)}</precioMedio>.',
    sourceXml: xqueryBaseXml,
  },
  {
    id: 7,
    expectedResultPath: 'XQuery/Ejercicio7/resultado.txt',
    title: 'Valoración > 4.0',
    tag: 'for + let + where + order',
    desc: 'Obtén el nombre y la valoración de los productos con valoración mayor a 4.0, ordenados de mayor a menor valoración. Usa LET auxiliar.',
    requirements: [
      { label: 'LET auxiliar', detail: 'guardar valoracion' },
      { label: 'Filtro', detail: 'valoracion > 4.0' },
      { label: 'Orden', detail: 'descending por valoración' },
    ],
    hint: 'Puedes hacer let $val := $p/valoracion y luego where/order by con $val.',
    sourceXml: xqueryBaseXml,
  },
  {
    id: 8,
    expectedResultPath: 'XQuery/Ejercicio8/resultado.txt',
    title: 'Categorías únicas',
    tag: 'distinct-values',
    desc: 'Devuelve la lista de categorías distintas que existen en la tienda, sin repeticiones, usando distinct-values().',
    requirements: [
      { label: 'Función', detail: 'distinct-values()' },
      { label: 'Origen', detail: '@categoria de producto' },
      { label: 'Salida', detail: 'elementos categoria' },
    ],
    hint: 'Itera el resultado de distinct-values(...) y construye <categoria>{$cat}</categoria>.',
    sourceXml: xqueryBaseXml,
  },
];
