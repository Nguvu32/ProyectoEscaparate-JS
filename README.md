# Proyecto Escaparate Virtual - "Del Campo a Casa"

## Descripción
Prototipo de un escaparate virtual para la venta directa de productos agrícolas del productor al consumidor. Desarrollado con HTML5, CSS3, JavaScript (Vanilla) y Bootstrap 5.

## Estructura de Directorios

```
/ProyectoEscaparate
├── index.html              # Página principal y única (SPA feeling)
├── aviso-legal.html        # Página de Aviso Legal
├── politica-cookies.html   # Página de Política de Cookies
├── condiciones-uso.html    # Página de Condiciones de Uso
├── licencias.html          # Página de Licencias y Créditos
├── css/
│   └── estilos.css         # Hoja de estilos personalizada
├── js/
│   └── app.js              # Lógica principal (Productos, Carrito, Auth)
├── data/
│   └── productos.json      # Base de datos de productos (JSON)
├── assets/                 # Imágenes (deben añadirse aquí)
├── style-guide.md          # Guía de Estilos
├── mockup_description.md   # Descripción del Wireframe
└── README.md               # Esta documentación
```

## Requisitos de Inicio
1. **Servidor Web:** Para que el fichero `productos.json` se cargue correctamente mediante AJAX/Fetch, el proyecto debe ejecutarse en un entorno de servidor (Localhost).
   - VS Code: Usar extensión "Live Server".
   - Python: `python -m http.server`
   - Node: `npx http-server`
2. **Navegador:** Recomendado Chrome o Firefox actualizado.

## Usuarios de Prueba (Login)
El sistema simula un backend utilizando `localStorage`.

- **Administrador (Por defecto):**
  - Email: `admin@campo.es`
  - Contraseña: `1234`
- **Registro:**
  - Puede registrar nuevos usuarios desde el botón "Registrarse".
  - Los datos se guardan en el navegador (`localStorage`).

## Expresiones Regulares (Validación)
Se han implementado las siguientes validaciones en el registro:

1. **Email:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - Valida formato estándar de correo (texto @ dominio . extensión).
2. **Contraseña:** `/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/`
   - Mínimo 8 caracteres.
   - Al menos una letra mayúscula.
   - Al menos un dígito.

## Almacenamiento Local (WebStorage y Cookies)
- **Cookies:**
  - `cookies_aceptadas`: Booleano para no mostrar el banner de nuevo.
  - `info_navegacion`: Almacena `hostname|url` por 7 días (Requisito del proyecto).
- **LocalStorage:**
  - `carrito_escaparate`: Array JSON con los productos añadidos al carrito.
  - `sesion_actual`: Datos del usuario logueado actualmente.
  - `usuario_registrado`: Simulación de la base de datos de usuarios.

## Funcionalidades Extra Implementadas
- **Sistema de Ofertas:** Filtrado de productos en oferta y visualización destacada con etiquetas "OFERTA" y precios en rojo.
- **Reconocimiento de Voz:** Icono de micrófono en la barra de búsqueda (Web Speech API).
- **Geolocalización:** Solicitud de ubicación al iniciar para ofertas locales (Consola).
- **Microinteracciones:** Hover en tarjetas (zoom y elevación), animaciones de botones y feedback visual.
- **Páginas Legales:** Estructura completa de páginas legales (Aviso Legal, Cookies, etc.) con footer persistente (`sticky footer`).

## Licencias y Créditos
- **Bootstrap 5:** MIT License.
- **Iconos:** Bootstrap Icons (MIT).
- **Imágenes:** Todas las imágenes del proyecto (productos y carrusel) han sido generadas por **Inteligencia Artificial (Google Gemini)**.

---
**Desarrollado para el Módulo DIW/DWEC - 2026**
