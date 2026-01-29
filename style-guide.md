# Guía de Estilos - Escaparate Virtual "Del Campo a Casa"

## 1. Introducción
Esta guía define los estándares visuales y de diseño para el prototipo de escaparate virtual. El objetivo es transmitir frescura, cercanía y calidad natural.

## 2. Paleta de Colores
Utilizamos colores tierra y verdes para evocar naturaleza, con acentos vibrantes para llamadas a la acción.

- **Primario (Verde Campo):** `#2E7D32` (Vegetación, frescura)
- **Secundario (Tierra):** `#795548` (Tierra, raíces, estabilidad)
- **Fondo (Crema Suave):** `#FAFAFA` (Limpieza, claridad)
- **Texto Principal:** `#212121` (Legibilidad)
- **Acento (Naranja Cítrico):** `#FF9800` (Ofertas, botones de compra)
- **Alerta (Rojo Tomate):** `#D32F2F` (Errores, avisos importantes)

## 3. Tipografía
Se prioriza la legibilidad en pantallas.

- **Fuente Principal:** 'Inter' o 'Roboto', sans-serif.
- **Títulos (H1, H2):** Peso 700 (Bold). Color `#2E7D32`.
- **Cuerpo:** Peso 400 (Regular). Color `#212121`.
- **Botones:** Peso 600 (Semi-bold). Transformación `uppercase` opcional.

## 4. Iconografía
Uso de iconos vectoriales (SVG) o librerías como FontAwesome/Bootstrap Icons.
- **Carrito:** Icono de cesta de mimbre o carro estándar.
- **Usuario:** Silueta simple.
- **Búsqueda:** Lupa.

## 5. Componentes UI

### Botones
- **Primario:** Fondo `#2E7D32`, Texto `#FFFFFF`, Bordes redondeados (Border-radius: 8px). Hover: Oscurecer 10%.
- **Secundario:** Fondo Transparente, Borde `#2E7D32`, Texto `#2E7D32`.

### Tarjetas de Producto (Cards)
- **Contenedor:** Fondo blanco, sombra suave (`box-shadow: 0 4px 6px rgba(0,0,0,0.1)`).
- **Imagen:** Relación de aspecto 4:3, `object-fit: cover`.
- **Interacción:** Al pasar el ratón (Hover), la tarjeta se eleva (`transform: translateY(-5px)`) y la sombra aumenta.
- **Overlay:** Botón "Añadir al carrito" aparece o se destaca.

### Navegación
- **Barra Superior:** Sticky top. Fondo `#ffffff` con sombra inferior.
- **Enlaces:** Color `#212121`. Hover: Color `#2E7D32` y subrayado animado.

## 6. Imágenes
- Fotografías de alta calidad, bien iluminadas, mostrando el producto fresco.
- Estilo "Macro" o "Bodegón" para resaltar texturas.

## 7. Accesibilidad
- Contraste suficiente entre texto y fondo (AA/AAA).
- Etiquetas `aria-label` en botones sin texto (ej. búsqueda por voz).
- Focus states claramente visibles para navegación por teclado.
