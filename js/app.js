/**
 * Proyecto: Escaparate Virtual "Del Campo a Casa"
 * Descripción: Lógica principal de la aplicación.
 */

document.addEventListener('DOMContentLoaded', () => {
    iniciarAplicacion();
});

// Variables Globales
let todosLosProductos = [];
let todosLosClientes = []; // Clientes cargados del JSON
let carrito = []; // Array de objetos { producto, cantidad }
let usuarioLogueado = null; // Objeto usuario o null

/**
 * Inicializa todas las funciones de la página
 */
function iniciarAplicacion() {
    console.log("Iniciando aplicación...");

    // 0. Gestión de Cookies y Sesión
    gestionarCookies();
    cargarSesionUsuario();
    cargarCarritoDeStorage();
    checkCompraExitosa();

    // 1. Cargar Datos Globales
    cargarProductos();
    cargarClientes(); // Nueva función

    // 2. Configurar Eventos de Interfaz
    configurarEventosBusqueda();
    configurarEventosAuth();
    configurarGeolocalizacion();
    configurarFiltrosCategoria();
    configurarOrdenamiento();

    actualizarInterfazUsuario();
}

function checkCompraExitosa() {
    if (sessionStorage.getItem('compra_exitosa') === 'true') {
        sessionStorage.removeItem('compra_exitosa');
        // Esperemos un poco a que cargue el DOM y bootstrap
        setTimeout(() => {
            let modal = new bootstrap.Modal(document.getElementById('modalCompraExito'));
            modal.show();
        }, 500);
    }
}

// ---------------------------------------------------------
// GESTIÓN DE PRODUCTOS Y CLIENTES
// ---------------------------------------------------------

/**
 * Carga los productos desde el fichero JSON
 */
async function cargarProductos() {
    let contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return; // Si no existe el contenedor (ej. en resumen.html), salimos.

    try {
        let respuesta = await fetch('data/productos.json');
        if (!respuesta.ok) throw new Error('Error al cargar productos');

        todosLosProductos = await respuesta.json();
        renderizarProductos(todosLosProductos);

    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los productos. Inténtelo más tarde.</div>`;
    }
}

/**
 * Carga los clientes desde el fichero JSON
 */
async function cargarClientes() {
    try {
        let respuesta = await fetch('data/clientes.json');
        if (!respuesta.ok) throw new Error('Error al cargar clientes');

        let clientesJson = await respuesta.json();

        // Combinar con los guardados en localStorage (si los hay)
        // Esto permite persistir nuevos registros en la sesión del navegador
        let clientesLocales = JSON.parse(localStorage.getItem('clientes_registrados')) || [];

        // Usamos un Map por email para evitar duplicados si el JSON y LocalStorage coinciden
        let mapaClientes = new Map();

        clientesJson.forEach(c => mapaClientes.set(c.email, c));
        clientesLocales.forEach(c => mapaClientes.set(c.email, c));

        todosLosClientes = Array.from(mapaClientes.values());
        console.log("Clientes cargados:", todosLosClientes.length);

    } catch (error) {
        console.error("Error cargando clientes:", error);
        // Si falla, inicializamos vacio o solo con locals
        todosLosClientes = JSON.parse(localStorage.getItem('clientes_registrados')) || [];
    }
}

/**
 * Renderiza la lista de productos en el DOM
 * @param {Array} productos - Lista de productos a mostrar
 */
// Variables de Paginación
let ITEMS_POR_PAGINA = 12; // let en vez de const
let paginaActual = 1;
let productosFiltradosActuales = []; // Para mantener el estado de filtros entre cambios de página

/**
 * Renderiza la lista de productos en el DOM con paginación
 * @param {Array} productos - Lista COMPLETA de productos a paginar (opcional, por defecto usa el último filtro)
 * @param {Boolean} resetearPagina - Si es true, vuelve a la página 1 (útil para nuevas búsquedas/filtros)
 */
function renderizarProductos(productos = null, resetearPagina = false) {
    if (productos) {
        productosFiltradosActuales = productos;
    }

    if (resetearPagina) {
        paginaActual = 1;
    }

    let contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return; // Safeguard

    let lista = productosFiltradosActuales;

    // Si no hay productos, mostramos mensaje y salimos.
    if (lista.length === 0) {
        contenedor.innerHTML = '<div class="col-12 text-center text-muted">No se encontraron productos.</div>';
        actualizarPaginacion(0);
        return;
    }

    // Calcular índices para slice
    let indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    let indiceFin = indiceInicio + ITEMS_POR_PAGINA;
    let productosPagina = lista.slice(indiceInicio, indiceFin);

    // Optimización: Crear todo el HTML en una sola variable para evitar repintados múltiples (reflows)
    let cardsHtml = productosPagina.map((prod, index) => `
            <div class="col" style="animation: aparecer 0.5s ease-out both; animation-delay: ${index * 0.1}s;">
                <div class="card card-producto h-100">
                    <div class="position-relative overflow-hidden">
                        ${prod.oferta ? '<span class="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded fw-bold small z-3">OFERTA</span>' : ''}
                        <!-- Añadido loading="lazy" para mejorar rendimiento de carga de imágenes -->
                        <img src="${prod.imagen}" class="card-img-top img-detalle-producto" alt="${prod.nombre}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'" style="cursor: pointer;" data-id="${prod.id}">
                        ${usuarioLogueado ? `
                        <button class="btn btn-primario position-absolute bottom-0 end-0 m-2 btn-anadir-carrito" data-id="${prod.id}">
                            <i class="bi bi-cart-plus"></i> Añadir
                        </button>
                        ` : ''}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title fw-bold text-dark">${prod.nombre}</h5>
                        <p class="agricultor-producto mb-1"><i class="bi bi-person-badge"></i> ${prod.agricultor}</p>
                        <p class="card-text small text-muted">${prod.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="precio-producto ${prod.oferta ? 'text-danger fw-bold' : ''}">${prod.precio.toFixed(2)}€ / ${prod.unidad}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    // Inserción única en el DOM
    contenedor.innerHTML = cardsHtml;

    // Generar controles de paginación
    actualizarPaginacion(lista.length);

    // Reasignar eventos a los nuevos botones
    document.querySelectorAll('.btn-anadir-carrito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let id = parseInt(e.currentTarget.dataset.id);
            agregarAlCarrito(id);
        });
    });

    // Eventos para abrir modal detalle
    document.querySelectorAll('.img-detalle-producto').forEach(img => {
        img.addEventListener('click', (e) => {
            let id = parseInt(e.currentTarget.dataset.id);
            mostrarDetalleProducto(id);
        });
    });
}

function mostrarDetalleProducto(id) {
    let producto = todosLosProductos.find(p => p.id === id);
    if (!producto) return;

    // Rellenar datos en el modal
    document.getElementById('detalle-titulo').textContent = producto.nombre;
    document.getElementById('detalle-imagen').src = producto.imagen;
    document.getElementById('detalle-agricultor').textContent = producto.agricultor;
    document.getElementById('detalle-precio').textContent = `${producto.precio.toFixed(2)}€ / ${producto.unidad}`;
    document.getElementById('detalle-descripcion').textContent = producto.descripcion; // En una app real, esto sería una descripción más larga

    // Configurar botón de añadir
    let btnAnadir = document.getElementById('btn-modal-anadir');

    // Clonamos el botón para eliminar event listeners previos y evitar duplicados
    let nuevoBtn = btnAnadir.cloneNode(true);
    btnAnadir.parentNode.replaceChild(nuevoBtn, btnAnadir);

    // Si no está logueado, podríamos deshabilitar o redirigir (aquí avisaremos como en el listado)
    nuevoBtn.addEventListener('click', () => {
        agregarAlCarrito(producto.id);
        // Opcional: Cerrar modal tras añadir
        // bootstrap.Modal.getInstance(document.getElementById('modalDetalleProducto')).hide();
    });

    // Mostrar modal
    let modal = getModalInstance('modalDetalleProducto');
    modal.show();
}

function actualizarPaginacion(totalItems) {
    let contenedorPaginacion = document.getElementById('paginacion-productos');
    let totalPaginas = Math.ceil(totalItems / ITEMS_POR_PAGINA);

    if (totalPaginas <= 1) {
        contenedorPaginacion.innerHTML = ''; // No mostrar paginación si solo hay 1 página
        return;
    }

    let html = '';

    // Botón Anterior
    html += `
        <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="cambiarPagina(${paginaActual - 1})" aria-label="Anterior">
                <span aria-hidden="true">&laquo;</span>
            </button>
        </li>
    `;

    // Números de Página
    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <li class="page-item ${paginaActual === i ? 'active' : ''}">
                <button class="page-link" onclick="cambiarPagina(${i})">${i}</button>
            </li>
        `;
    }

    // Botón Siguiente
    html += `
        <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
            <button class="page-link" onclick="cambiarPagina(${paginaActual + 1})" aria-label="Siguiente">
                <span aria-hidden="true">&raquo;</span>
            </button>
        </li>
    `;

    contenedorPaginacion.innerHTML = html;
}

// Función global para ser llamada desde el HTML onclick
window.cambiarPagina = function (nuevaPagina) {
    paginaActual = nuevaPagina; // Actualizamos estado
    renderizarProductos();      // Renderizamos sin pasar productos nuevos (usa los filtrados actuales)
    // Scroll suave hacia arriba
    document.getElementById('contenedor-productos').scrollIntoView({ behavior: 'smooth' });
};

// ---------------------------------------------------------
// CARRITO DE COMPRA
// ---------------------------------------------------------

function agregarAlCarrito(idProducto) {
    if (!usuarioLogueado) {
        alert("Debes iniciar sesión para comprar.");
        return;
    }

    let producto = todosLosProductos.find(p => p.id === idProducto);
    if (!producto) return;

    // Buscar si ya está en el carrito
    let itemExistente = carrito.find(item => item.producto.id === idProducto);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ producto: producto, cantidad: 1 });
    }

    guardarCarritoStorage();
    actualizarContadorCarrito();
    renderizarCarritoEnModal();
}

function eliminarDelCarrito(idProducto) {
    let indice = carrito.findIndex(item => item.producto.id === idProducto);
    if (indice !== -1) {
        carrito.splice(indice, 1);
        guardarCarritoStorage();
        actualizarContadorCarrito();
        renderizarCarritoEnModal(); // Actualizar vista del modal
    }
}

function eliminarProductoCarrito(idProducto) {
    let producto = carrito.find(item => item.producto.id === idProducto);
    producto.cantidad--;
    if (producto.cantidad === 0) {
        eliminarDelCarrito(idProducto);
    }
    guardarCarritoStorage();
    actualizarContadorCarrito();
    renderizarCarritoEnModal();
}

function renderizarCarritoEnModal() {
    let contenedor = document.getElementById('lista-carrito');
    let totalSpan = document.getElementById('total-carrito');

    if (carrito.length === 0) {
        contenedor.innerHTML = '<div class="text-center py-4 text-muted">Tu carrito está vacío.</div>';
        totalSpan.innerText = '0.00€';
        return;
    }

    let html = '<ul class="list-group list-group-flush">';
    let total = 0;

    carrito.forEach(item => {
        let subtotal = item.producto.precio * item.cantidad;
        total += subtotal;

        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div class="d-flex align-items-center">
                    <img src="${item.producto.imagen}" alt="${item.producto.nombre}" 
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;" class="me-3">
                    <div>
                        <h6 class="mb-0 fw-bold">${item.producto.nombre}</h6>
                        <small class="text-muted">
                            ${item.cantidad} x ${item.producto.precio.toFixed(2)}€ / ${item.producto.unidad}
                        </small>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <span class="fw-bold me-3 text-success">${subtotal.toFixed(2)}€</span>
                    <button class="btn btn-outline-primary btn-sm" onclick="agregarAlCarrito(${item.producto.id})" title="Añadir">
                        <i class="bi bi-plus-lg"></i>
                    </button>
                    <button class="btn btn-outline-primary btn-sm" onclick="eliminarProductoCarrito(${item.producto.id})" title="Quitar">
                        <i class="bi bi-dash-lg"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="eliminarDelCarrito(${item.producto.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>
        `;
    });

    html += '</ul>';
    contenedor.innerHTML = html;
    totalSpan.innerText = total.toFixed(2) + '€';
}

function guardarCarritoStorage() {
    localStorage.setItem('carrito_escaparate', JSON.stringify(carrito));
}

function cargarCarritoDeStorage() {
    let carritoGuardado = localStorage.getItem('carrito_escaparate');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

function actualizarContadorCarrito() {
    let contador = document.getElementById('contador-carrito');
    if (contador) {
        let totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.innerText = totalItems;
    }
}

// Evento para abrir el modal del carrito
let btnCarrito = document.getElementById('btn-carrito');
if (btnCarrito) {
    btnCarrito.addEventListener('click', () => {
        if (!usuarioLogueado) return;

        renderizarCarritoEnModal();
        let modal = getModalInstance('modalCarrito');
        modal.show();
    });
}

// Evento para finalizar compra
// Evento para finalizar compra (Redirige a resumen.html)
// Evento para finalizar compra (Redirige a resumen.html)
let btnFinalizar = document.getElementById('btn-finalizar-compra');
if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }
        // Redirección
        window.location.href = 'resumen.html';
    });
}

// Lógica Específica para la página de Resumen
if (window.location.pathname.includes('resumen.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        cargarCarritoDeStorage();
        renderizarResumenCompra();
    });

    document.getElementById('btn-confirmar-final-pagina').addEventListener('click', () => {
        // Finalizar Compra
        carrito = [];
        guardarCarritoStorage();

        // Marcar flag de éxito y volver
        sessionStorage.setItem('compra_exitosa', 'true');
        window.location.href = 'index.html';
    });
}

function renderizarResumenCompra() {
    let contenedor = document.getElementById('lista-resumen');
    let totalSpan = document.getElementById('total-resumen');

    if (!contenedor || carrito.length === 0) {
        if (contenedor) contenedor.innerHTML = '<div class="alert alert-warning">Tu carrito está vacío.</div>';
        return;
    }

    let html = '<ul class="list-group">';
    let total = 0;

    carrito.forEach(item => {
        let subtotal = item.producto.precio * item.cantidad;
        total += subtotal;
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="${item.producto.imagen}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded me-3">
                    <div>
                        <h6 class="mb-0">${item.producto.nombre}</h6>
                        <small class="text-muted">${item.cantidad} x ${item.producto.precio.toFixed(2)}€</small>
                    </div>
                </div>
                <span class="fw-bold">${subtotal.toFixed(2)}€</span>
            </li>
        `;
    });

    html += '</ul>';
    contenedor.innerHTML = html;
    totalSpan.innerText = total.toFixed(2) + '€';
}

// Evento CONFIRMAR compra (Abre Éxito)
let btnConfirmarFinal = document.getElementById('btn-confirmar-final');
if (btnConfirmarFinal) {
    btnConfirmarFinal.addEventListener('click', () => {
        // Transición segura: Resumen -> Éxito
        let modalResumen = getModalInstance('modalResumenCompra');
        let modalExito = getModalInstance('modalCompraExito');
        let modalResumenEl = document.getElementById('modalResumenCompra');

        if (modalResumenEl) {
            modalResumenEl.addEventListener('hidden.bs.modal', function () {
                // Lógica de compra
                carrito = [];
                guardarCarritoStorage();
                actualizarContadorCarrito();

                if (modalExito) modalExito.show();
            }, { once: true });
        }

        if (modalResumen) modalResumen.hide();
    });
}

// Helper para gestionar instancias de Modales Bootstrap (Singleton pattern)
function getModalInstance(id) {
    let el = document.getElementById(id);
    if (!el) return null;

    let instance = bootstrap.Modal.getInstance(el);
    if (!instance) {
        instance = new bootstrap.Modal(el);
    }
    return instance;
}

// ---------------------------------------------------------
// AUTENTICACIÓN (LOGIN / REGISTRO)
// ---------------------------------------------------------

function configurarEventosAuth() {
    // Formulario de Registro
    let formReg = document.getElementById('form-registro');
    if (formReg) {
        formReg.addEventListener('submit', (e) => {
            e.preventDefault();
            let datos = new FormData(formReg);
            let nuevoCliente = {};
            datos.forEach((value, key) => { nuevoCliente[key] = value });

            if (!validarRegistro(nuevoCliente)) return;

            if (todosLosClientes.some(c => c.email === nuevoCliente.email)) {
                alert('El email ya está registrado.');
                return;
            }

            nuevoCliente.id = Date.now();
            nuevoCliente.rol = 'cliente';
            todosLosClientes.push(nuevoCliente);

            let clientesLocales = JSON.parse(localStorage.getItem('clientes_registrados')) || [];
            clientesLocales.push(nuevoCliente);
            localStorage.setItem('clientes_registrados', JSON.stringify(clientesLocales));

            iniciarSesionUsuario(nuevoCliente);

            let modalEl = document.getElementById('modalRegistro');
            let modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            alert('Registro completado con éxito. Bienvenido/a.');
            formReg.reset();
        });
    }

    // Formulario Login
    let formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            let datos = new FormData(formLogin);
            let email = datos.get('email');
            let pass = datos.get('password');

            let usuarioEncontrado = todosLosClientes.find(c => c.email === email && c.password === pass);

            if (usuarioEncontrado) {
                iniciarSesionUsuario(usuarioEncontrado);
                let modalEl = document.getElementById('modalLogin');
                let modalInstance = bootstrap.Modal.getInstance(modalEl);
                modalInstance.hide();
                formLogin.reset();
            } else {
                alert('Credenciales incorrectas.');
            }
        });
    }

    // Logout
    let btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            cerrarSesion();
        });
    }
}

function validarRegistro(datos) {
    let email = datos.email;
    let pass = datos.password;
    let pass2 = datos.password2;

    // Regex Email
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        alert("El email no es válido.");
        return false;
    }

    // Coincidencia contraseñas
    if (pass !== pass2) {
        alert("Las contraseñas no coinciden.");
        return false;
    }

    // Regex Password
    let regexPass = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regexPass.test(pass)) {
        alert("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
        return false;
    }

    return true;
}

function iniciarSesionUsuario(usuario) {
    usuarioLogueado = usuario;
    localStorage.setItem('sesion_actual', JSON.stringify(usuario));
    actualizarInterfazUsuario();
    // Recargar productos para mostrar botones de compra
    renderizarProductos();
}

function cargarSesionUsuario() {
    let sesion = localStorage.getItem('sesion_actual');
    if (sesion) {
        usuarioLogueado = JSON.parse(sesion);
    }
}

function cerrarSesion() {
    usuarioLogueado = null;
    localStorage.removeItem('sesion_actual');
    actualizarInterfazUsuario();
    renderizarProductos();
}

function actualizarInterfazUsuario() {
    let panelNoLogueado = document.getElementById('panel-no-logueado');
    let panelLogueado = document.getElementById('panel-logueado');
    let nombreDisplay = document.getElementById('nombre-usuario-display');

    if (!panelNoLogueado || !panelLogueado || !nombreDisplay) return;

    if (usuarioLogueado) {
        panelNoLogueado.classList.remove('d-flex');
        panelNoLogueado.classList.add('d-none');

        panelLogueado.classList.remove('d-none');
        panelLogueado.classList.add('d-flex');

        nombreDisplay.innerText = `Hola, ${usuarioLogueado.nombre}`;
    } else {
        panelNoLogueado.classList.remove('d-none');
        panelNoLogueado.classList.add('d-flex');

        panelLogueado.classList.remove('d-flex');
        panelLogueado.classList.add('d-none');
    }
}

// ---------------------------------------------------------
// BÚSQUEDA Y FILTROS
// ---------------------------------------------------------

function configurarEventosBusqueda() {
    let buscador = document.getElementById('buscador-global');
    let btnBuscar = document.getElementById('btn-buscar');
    let btnVoz = document.getElementById('btn-voz');
    let listaResultados = document.getElementById('lista-resultados-busqueda');

    if (!buscador || !btnBuscar || !btnVoz) return;

    // Búsqueda por texto (Botón o Enter)
    let realizarBusqueda = () => {
        let termino = buscador.value.toLowerCase();
        let filtrados = todosLosProductos.filter(p =>
            p.nombre.toLowerCase().includes(termino) ||
            p.categoria.toLowerCase().includes(termino)
        );
        // Reseteamos a pagina 1 al buscar
        renderizarProductos(filtrados, true);
        if (listaResultados) listaResultados.classList.add('d-none'); // Ocultar dropdown si se busca
    };

    btnBuscar.addEventListener('click', realizarBusqueda);
    buscador.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') realizarBusqueda();
    });

    // --- LIVE SEARCH (Búsqueda en tiempo real) ---
    if (listaResultados) {
        buscador.addEventListener('input', function () {
            let termino = this.value.toLowerCase().trim();
            listaResultados.innerHTML = ''; // Limpiar

            if (termino.length === 0) {
                listaResultados.classList.add('d-none');
                return;
            }

            // Filtrar productos
            let filtrados = todosLosProductos.filter(p =>
                p.nombre.toLowerCase().includes(termino) ||
                p.categoria.toLowerCase().includes(termino)
            );

            // Renderizar resultados en dropdown
            if (filtrados.length === 0) {
                listaResultados.innerHTML = '<li class="list-group-item text-muted">No se encontraron productos</li>';
            } else {
                // Limitamos a 5 resultados para no saturar
                filtrados.slice(0, 5).forEach(p => {
                    let li = document.createElement('li');
                    li.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'align-items-center', 'p-2');
                    li.style.cursor = 'pointer';
                    li.innerHTML = `
                        <img src="${p.imagen}" alt="${p.nombre}" class="rounded me-2" style="width: 40px; height: 40px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <div class="fw-bold small">${p.nombre}</div>
                            <div class="text-muted small">${p.precio.toFixed(2)}€ / ${p.unidad}</div>
                        </div>
                    `;

                    // Al hacer click, ir al detalle del producto
                    li.addEventListener('click', () => {
                        mostrarDetalleProducto(p.id);
                        listaResultados.classList.add('d-none');
                        buscador.value = ''; // Opcional: limpiar input
                        // Opcional: si queremos que filtre la lista principal también:
                        // renderizarProductos([p], true); 
                    });
                    listaResultados.appendChild(li);
                });
            }
            listaResultados.classList.remove('d-none');
        });

        // Cerrar al hacer click fuera del input o la lista
        document.addEventListener('click', (e) => {
            if (!buscador.contains(e.target) && !listaResultados.contains(e.target)) {
                listaResultados.classList.add('d-none');
            }
        });
    }

    // Configurar Reconocimiento de Voz separado
    configurarReconocimientoVoz(buscador, btnVoz, realizarBusqueda);
}

function configurarReconocimientoVoz(buscador, btnVoz, callbackBusqueda) {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // Implementación del Micrófono (Speech Recognition)
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'es-ES';
        recognition.continuous = false;

        // Métodos y Eventos Clave
        recognition.onstart = function () {
            console.log("El sistema empieza a escuchar");
            btnVoz.classList.add('btn-danger'); // Feedback visual
        };

        recognition.onspeechend = function () {
            console.log("El usuario deja de hablar");
            btnVoz.classList.remove('btn-danger');
        };

        // Ejemplo de Extracción de Datos
        recognition.onresult = function (e) {
            // La transcripción del audio
            var transcript = e.results[0][0].transcript;

            // El porcentaje de fiabilidad/calidad del reconocimiento
            var confidence = e.results[0][0].confidence;

            console.log(`Has dicho: ${transcript}. Fiabilidad: ${parseInt(confidence * 100)}%`);

            if (confidence < 0.8) {
                buscador.value = "No te he entendido bien, repite";
            } else {
                buscador.value = transcript;
                callbackBusqueda();
            }
        };

        recognition.onerror = function (event) {
            console.error("Error reconocimiento voz:", event.error);
            btnVoz.classList.remove('btn-danger');

            if (event.error === 'no-speech') {
                buscador.value = "No hemos detectado sonido, prueba otra vez";
            }
        };

        btnVoz.addEventListener('click', () => {
            recognition.start(); // Inicia el proceso de escucha
        });

    } else {
        btnVoz.disabled = true;
        btnVoz.title = "Tu navegador no soporta reconocimiento de voz (Firefox no soportado).";
        console.warn("Speech Recognition API not supported in this browser.");
    }
}


function configurarFiltrosCategoria() {
    let linksCategoria = document.querySelectorAll('.nav-link[data-categoria]');
    linksCategoria.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remover clase active de todos
            document.querySelectorAll('.navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            let cat = e.target.dataset.categoria;
            let filtrados = todosLosProductos.filter(p => p.categoria === cat);
            // Reseteamos a pagina 1 al filtrar
            renderizarProductos(filtrados, true);
        });
    });


    // Filtro Ofertas
    let linkOfertas = document.getElementById('nav-ofertas');
    if (linkOfertas) {
        linkOfertas.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            let filtrados = todosLosProductos.filter(p => p.oferta === true);
            renderizarProductos(filtrados, true);
        });
    }
}

function configurarOrdenamiento() {
    let itemsOrden = document.querySelectorAll('.dropdown-item[data-orden]');
    itemsOrden.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            let orden = e.target.dataset.orden;
            let productosOrdenados = [...productosFiltradosActuales]; // Copia para no mutar original descontroladamente

            switch (orden) {
                case 'precio-asc':
                    productosOrdenados.sort((a, b) => a.precio - b.precio);
                    break;
                case 'precio-desc':
                    productosOrdenados.sort((a, b) => b.precio - a.precio);
                    break;
                case 'reciente':
                    // Asumimos que id más alto es más reciente
                    productosOrdenados.sort((a, b) => b.id - a.id);
                    break;
            }

            // Actualizar texto del botón dropdown (opcional, para feedback visual)
            let dropdownBtn = e.target.closest('.dropdown').querySelector('.dropdown-toggle');
            if (dropdownBtn) dropdownBtn.innerText = `Ordenar por: ${e.target.innerText}`;

            renderizarProductos(productosOrdenados, true);
        });
    });
}

// ---------------------------------------------------------
// GEOLOCALIZACIÓN Y COOKIES
// ---------------------------------------------------------

function configurarGeolocalizacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.warn("La Geolocalización no es soportada por este navegador.");
    }
}

function showPosition(position) {
    // Latitud y longitud en grados decimales
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    console.log(`Ubicación detectada: Latitud: ${lat}, Longitud: ${lon}`);

    // Otras propiedades disponibles en el objeto position.coords:
    // accuracy: Precisión horizontal en metros
    // altitude: Altitud en metros
    // speed: Velocidad si el usuario se mueve
    // timestamp: Fecha y hora de la detección
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.warn("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.warn("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.warn("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.warn("An unknown error occurred.");
            break;
    }
}

function gestionarCookies() {
    // Comprobar si ya aceptó cookies
    if (!getCookie('cookies_aceptadas')) {
        mostrarAvisoCookies();
    } else {
        // Crear cookie de rastreo (hostname y url)
        setCookie('info_navegacion', `${window.location.hostname}|${window.location.href}`, 7);
    }
}

function mostrarAvisoCookies() {
    // Inyectar banner
    let bannerHtml = `
        <div id="banner-cookies" class="position-fixed bottom-0 start-0 w-100 bg-dark text-white p-3 text-center" style="z-index: 2000;">
            <p class="d-inline me-3">Utilizamos cookies para mejorar tu experiencia.</p>
            <button id="btn-aceptar-cookies" class="btn btn-primario btn-sm">Aceptar</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', bannerHtml);

    document.getElementById('btn-aceptar-cookies').addEventListener('click', () => {
        setCookie('cookies_aceptadas', 'true', 30);
        setCookie('info_navegacion', `${window.location.hostname}|${window.location.href}`, 7)
        document.getElementById('banner-cookies').remove();
    });
}

// Helpers Cookies
function setCookie(nombre, valor, dias) {
    let d = new Date();
    d.setTime(d.getTime() + (dias * 24 * 60 * 60 * 1000));
    let expiracion = "expires=" + d.toUTCString();
    document.cookie = nombre + "=" + valor + ";" + expiracion + ";path=/";
}

function getCookie(nombre) {
    let nombreEQ = nombre + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nombreEQ) == 0) return c.substring(nombreEQ.length, c.length);
    }
    return "";
}
