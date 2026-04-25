# 🧪 XMLab / studio

> **Plataforma interactiva de aprendizaje y práctica de XML, XSD, XPath y XQuery.** > 🎓 *Creado por y para alumnos de 1º DAW (Desarrollo de Aplicaciones Web).*

XMLab es un entorno de pruebas en el navegador diseñado para dominar las bases del marcado de datos y consultas. Permite a los estudiantes resolver ejercicios prácticos con validación en tiempo real, ideal para la asignatura de *Lenguajes de Marcas y Sistemas de Gestión de Información*.

---

## 🚀 Características Principales

* **💻 Editor Integrado:** Escribe código directamente en el navegador con soporte para tabulación, auto-scroll y numeración de líneas.
* **✅ Validación en Dos Fases:**
    * *Validación Local:* Comprobación rápida de sintaxis y estructura usando el `DOMParser` nativo del navegador y evaluadores personalizados.
    * *Validación Estricta:* Comparación profunda contra archivos de solución y resultados esperados usando la API `fetch`.
* **💾 Persistencia de Progreso:** Tus ejercicios resueltos se guardan automáticamente en el `localStorage` del navegador. ¡No perderás tu progreso si cierras la pestaña!
* **💡 Sistema de Pistas:** Si te atascas, cada ejercicio cuenta con un botón de ayuda contextual.
* **📊 Interfaz Dinámica:** Cambia entre módulos sin recargar la página, visualizando el XML de referencia cuando es necesario (para XPath y XQuery).

---

## 📚 Módulos de Práctica (44 Ejercicios)

El laboratorio está dividido en 4 pilares fundamentales, con 8 ejercicios incrementales cada uno:

1.  **XML (Estructura y marcado):** Elementos básicos, anidamiento, jerarquía, atributos y elementos vacíos.
2.  **XSD (Esquemas y validación):** Definición de tipos, secuencias, ocurrencias (`minOccurs`/`maxOccurs`) y restricciones.
3.  **XPath (Consultas de nodos):** Rutas absolutas/relativas, predicados, atributos, funciones de posición (`last()`, `position()`) y ejes.
4.  **XQuery (Consultas avanzadas):** Expresiones FLWOR (`for`, `let`, `where`, `order by`, `return`), condiciones `if/then/else` y funciones agregadas (`count()`, `avg()`).

---

## 🗂️ Estructura del Proyecto

El código está escrito de forma modular utilizando **HTML5, CSS3 y Vanilla JavaScript** (sin frameworks pesados), lo que lo hace perfecto para estudiar su funcionamiento en 1º DAW.

* `index.html`: Estructura principal de la aplicación, paneles y modales.
* `styles.css`: Hoja de estilos (UI, layout, tipografías *JetBrains Mono* y *Syne*).
* `script.js`: Lógica principal (manejo del estado, renderizado, validadores locales, evaluación de resultados y peticiones `fetch`).
* `xml.js` / `xsd.js` / `xpath.js` / `xquery.js`: Bases de datos locales (arrays de objetos) que contienen los enunciados, requisitos, pistas y datos de configuración de cada ejercicio.
* `XML/`, `XSD/`, `XPath/`, `XQuery/` *(carpetas)*: Directorios que contienen las soluciones esperadas (`solucion.xml`, `resultado.txt`) contra las que se evalúa el código del usuario.

---

## 👨‍💻 Autoría

Desarrollado con ☕ por [MikeTroll](https://miketroll.me).  
*Hecho para sobrevivir a Lenguajes de Marcas en 1º DAW.*
