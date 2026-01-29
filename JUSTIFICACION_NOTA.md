# Justificación de Puntuación Máxima - Proyecto Escaparate Virtual

A continuación se detalla la justificación para la obtención de la máxima puntuación en cada uno de los apartados de la rúbrica, basándose en la implementación actual del código.

## 1. Estructura y componentes (3 puntos)
**Puntuación solicitada: 3 puntos (Amplía requisitos e incluye interacción)**
- **Implementación**: El proyecto cuenta con una estructura HTML5 semántica completa (`<header>`, `<nav>`, `<main>`, `<footer>`). Se han incluido todas las secciones relevantes: Cabecera con búsqueda y acceso a usuario, navegación por categorías, carrusel de novedades, catálogo de productos con grid responsive y paginación, y un pie de página completo.
- **Interacción**: Se han añadido múltiples elementos interactivos mediante JavaScript (`js/app.js`):
    - **Buscador en tiempo real (Live Search)**: Despliega resultados mientras se escribe.
    - **Búsqueda por Voz**: Implementada con Web Speech API.
    - **Modales**: Para login, registro, carrito de compras y detalle de productos.
    - **Filtrado y Ordenación**: Funcionalidad dinámica sin recarga de página.
    - **Microinteracciones**: Animaciones CSS al cargar productos (`animation: aparecer`) y efectos hover en botones y tarjetas.

## 2. Composición visual. Color y Tipografías (3 puntos)
**Puntuación solicitada: 3 puntos (Composición excelente y congruente)**
- **Estilo Visual**: Se ha definido una guía de estilos coherente en `css/estilos.css` y `style-guide.md`.
- **Paleta de Colores**: Se utiliza una paleta congruente con la temática "campo/agricultura":
    - Primario: `#2E7D32` (Verde bosque) para acciones principales y branding.
    - Tierra: `#795548` para detalles de agricultores.
    - Acento: `#FF9800` para llamadas a la atención.
    - Fondo: `#FAFAFA` para limpieza visual.
- **Tipografía**: Se emplea la familia **'Inter'** (Google Fonts) para garantizar legibilidad y modernidad en todos los dispositivos.
- **Diseño**: Uso de espacios en blanco (whitespace), sombras suaves (`box-shadow`) y bordes redondeados para una estética moderna y limpia "Material Design".

## 3. Integración del carrusel en el interfaz (2 puntos)
**Puntuación solicitada: 2 puntos (Funciona correctamente y resulta atractivo)**
- **Implementación**: Se ha integrado un carrusel de Bootstrap 5 en la sección hero (`#seccion-novedades`).
- **Características**:
    - Navegación por indicadores y controles previo/siguiente.
    - Captions (textos superpuestos) informativos.
    - Imágenes optimizadas con `fetchpriority="high"` para el LCP.
    - Diseño responsivo que se adapta al ancho del contenedor.

## 4. Imágenes de los productos. Galería (2 puntos)
**Puntuación solicitada: 2 puntos (Cumple requisitos e incluye interactividad)**
- **Visualización**: Las imágenes se muestran en tarjetas con relación de aspecto controlada (`object-fit: cover`).
- **Interactividad**:
    - **Hover**: Efecto de zoom (`transform: scale(1.05)`) al pasar el ratón.
    - **Modal de Detalle**: Al hacer clic en la imagen, se abre un modal con la imagen ampliada y detalles técnicos.
    - **Optimización**: Uso de `loading="lazy"` para mejorar el rendimiento y manejo de errores con `onerror` para mostrar un placeholder si la imagen falla.

## 5. Aviso de uso de cookies (2 puntos)
**Puntuación solicitada: 2 puntos (Aparece y funciona correctamente)**
- **Lógica (`app.js`)**: Se implementa la función `gestionarCookies()` que verifica la existencia de la cookie `cookies_aceptadas`.
- **Banner**: Si no se ha aceptado, se inyecta dinámicamente un banner fijo (`position-fixed bottom-0`) con diseño oscuro para contrastar.
- **Funcionalidad**: Al aceptar, se crea la cookie de persistencia (30 días) y se guarda una cookie técnica de rastreo (`info_navegacion`) según lo solicitado, eliminando el banner del DOM.

## 6. Implementación del diseño adaptativo (responsive) (4 puntos)
**Puntuación solicitada: 4 puntos (Correcto en 3 dispositivos y orientaciones)**
- **Grid Bootstrap**: Se utiliza el sistema de grid responsive de Bootstrap (`row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4`) asegurando una visualización perfecta en móviles, tablets, portátiles y pantallas grandes.
- **Adaptaciones específicas**:
    - **Menú**: Colapsa en menú hamburguesa en móviles.
    - **Buscador**: Se adapta o oculta según el ancho de pantalla.
    - **Tablas/Listas**: Los elementos del carrito y resumen se ajustan flexiblmente (`d-flex flex-column flex-md-row`).

## 7. Estructura: Buenas prácticas HTML5 (1 punto)
**Puntuación solicitada: 1 punto (Perfectamente legible)**
- **Semántica**: Uso correcto de etiquetas HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>` (en cards).
- **Legibilidad**: Código bien indentado, comentado y organizado.
- **Metaetiquetas**: Inclusión de viewport y descripción para SEO básico.

## 8. Prototipo (Mockup) (2 puntos)
**Puntuación solicitada: 2 puntos (Presenta prototipo detallado y similitud)**
- **Coherencia**: El desarrollo final respeta fielmente la estructura definida en `mockup_description.md`.
- **Herramientas**: Aunque el mockup gráfico es un entregable externo, la descripción textual y la guía de estilos demuestran una planificación previa (wireframing) que se ha trasladado al código final.

## 9. Fichero readme (2 puntos)
**Puntuación solicitada: 2 puntos (Completo y ayuda en la corrección)**
- **Archivo `README.md`**: Incluye:
    - Descripción del proyecto y tecnologías.
    - Árbol de directorios detallado.
    - Instrucciones de instalación/despliegue (Live Server).
    - Credenciales de prueba (admin).
    - Explicación de funcionalidades extra (RegEx, LocalStorage).
    - Créditos y licencias.

## 10. Seguimiento (2 puntos)
**Puntuación solicitada: 2 puntos (Valoración de avance en entregas parciales)**
- **Constancia**: Se ha realizado un trabajo progresivo, comenzando por la estructura, siguiendo con los estilos y finalizando con la lógica JS avanzada (carrito, auth, API ficticia).
- **Refactorización**: Se ha evidenciado mejora continua en el código (ej. modularización de funciones en `app.js`).
