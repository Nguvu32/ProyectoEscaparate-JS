# Guion Simplificado para Vídeo Explicativo

> **Objetivo:** Mostrar que el proyecto cumple con todos los puntos de la rúbrica para obtener la máxima nota.
> **Duración estimada:** 3-5 minutos.
> **Herramienta:** Graba tu pantalla recorriendo estos pasos.

---

## 🚀 1. Introducción y Estructura (1 min)
*   **Acción:** Abre el proyecto en el navegador (Vista Escritorio) y al lado muestra VS Code con el `README.md` abierto.
*   **Narración:** "Este es el proyecto 'Del Campo a Casa', un escaparate virtual de productos frescos. Como veis en el `README.md`, la estructura de carpetas está organizada siguiendo buenas prácticas, con separación de `assets`, `css`, `js`, y una carpeta `docs` para la documentación técnica."
*   **Rúbrica que cubres:** Estructura HTML5, Fichero Readme.

---

## 🎨 2. Diseño y Estilos (1 min)
*   **Acción:**: Ve a la página principal y haz scroll suave. Abre la **guía de estilos (`docs/style-guide.md`)**.
*   **Narración:** "Hemos definido una guía de estilos visuales completa. Usamos una paleta de colores tierra y verde para evocar naturaleza, y tipografías 'Inter' para legibilidad. Los botones, tarjetas y formularios siguen un diseño consistente y predecible para el usuario."
*   **Acción:** Haz hover sobre una tarjeta de producto (zoom) y sobre los botones (cambio de color).
*   **Narración:** "Incluimos microinteracciones como feedback visual en botones y tarjetas, mejorando la experiencia de usuario (UX)."
*   **Rúbrica que cubres:** Composición visual, Componentes UI, Guía de Estilos.

---

## 📱 3. Responsividad y Adaptabilidad (1 min)
*   **Acción:** Abre las Herramientas de Desarrollador (F12) y activa la vista de dispositivos.
*   **Muestra:**
    1.  **Móvil (iPhone SE):** Muestra el botón de menú hamburguesa (si lo hay) y cómo las tarjetas se ponen en 1 columna.
    2.  **Tablet (iPad):** Las tarjetas en 2 columnas.
    3.  **Escritorio:** Vuelve a pantalla completa (3/4 columnas).
*   **Narración:** "El diseño es totalmente 'responsive', adaptándose correctamente a móvil, tablet y escritorio gracias al sistema de grid de Bootstrap."
*   **Rúbrica que cubres:** Implementación del diseño adaptativo.

---

## 🛒 4. Funcionalidades Clave (2 min)

### Carrusel e Imágenes
*   **Acción:** Muestra el carrusel de arriba pasando fotos.
*   **Narración:** "Integramos un carrusel funcional y atractivo. Todas las imágenes son de uso libre (generadas por IA) y están optimizadas."
*   **Rúbrica que cubres:** Integración del carrusel, Imágenes, Licencias.

### Búsqueda Inteligente (Voz y Filtros) 🎤
*   **Acción:**
    1.  Haz click en el **micrófono**.
    2.  Di algo (o simula que no te oye para que salga el mensaje de error "No te he entendido").
    3.  Di "frutas" para que filtre.
    4.  Muestra también el filtrado escribiendo en la barra.
*   **Narración:** "Implementamos búsqueda por voz con la Web Speech API, incluyendo gestión de errores y umbral de fiabilidad. También funciona la búsqueda en tiempo real por teclado."
*   **Rúbrica que cubres:** Voz, Se ha verificado usabilidad mediante distintos periféricos.

### Flujo de Usuario: Cookies y Compra
*   **Acción:**
    1.  Muestra el banner de cookies abajo y dale a "Aceptar". ("Cumplimos con el aviso de cookies funcional").
    2.  Intenta añadir algo al carrito **SIN** estar logueado (Alert: "Debes iniciar sesión").
    3.  **Login:** Entra con `admin@campo.es` / `1234`.
    4.  **Compra:** Añade productos, abre el modal del carrito, dale a finalizar y "comprar".
*   **Narración:** "El flujo de compra verifica la sesión del usuario. La navegación es fluida y permite completar una compra de principio a fin, verificando la usabilidad del sistema."
*   **Rúbrica que cubres:** Aviso de cookies, Facilidad de navegación, Casos de uso.

---

## 🛠️ 5. Conclusión Técnica (30 seg)
*   **Acción:** Muestra brevemente la pestaña de "Lighthouse" en las devtools (si tienes buena puntuación) o simplemente el código limpio de `app.js`.
*   **Narración:** "El código JavaScript está modularizado y documentado. Hemos refactorizado la lógica de geolocalización para seguir estándares académicos. La accesibilidad se ha tenido en cuenta mediante el uso de etiquetas semánticas y contrastes adecuados."
*   **Rúbrica que cubres:** Accesibilidad, Estándares web, Documentación.

---

> **Consejo Final:** Habla despacio y claro. No hace falta que leas el código, solo muestra que **funciona** y que **existe**. ¡Suerte!
