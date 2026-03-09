/* ==========================================================================
   1. CONFIGURACIÓN, ESTADO GLOBAL Y UTILIDADES
   ========================================================================== */
const API_URL = 'https://olimpo-web.onrender.com';
let carrito = JSON.parse(localStorage.getItem('olimpo_cart')) || [];
let salirPorIzquierda = true; 

const frasesOlimpo = [
    "Carne forjada por Hefesto", 
    "Un bocado digno de un Dios", 
    "¡Por las barbas de Poseidon!", 
    "El Olimpo te espera mortal", 
    "Prueba la Zeus Burguer", 
    "No aceptamos sacrificios"
];

/* ==========================================================================
   2. SISTEMA DE NOTIFICACIONES Y SONIDO
   ========================================================================== */
window.mostrarMensajeDivino = function(texto, tipo = 'cian') {
    const aviso = document.createElement('div');
    aviso.classList.add('notification');
    if(tipo === 'rosa') aviso.classList.add('rosa');
    aviso.innerHTML = `<span>⚡</span> ${texto}`;
    document.body.appendChild(aviso);
    setTimeout(() => aviso.classList.add('show'), 100);
    setTimeout(() => {
        aviso.classList.remove('show');
        setTimeout(() => aviso.remove(), 500);
    }, 3000);
};

window.reproducirSonido = function() {
    const audio = document.getElementById('sonido-clic');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio en espera de interacción"));
    }
};

/* ==========================================================================
   3. GESTIÓN DEL CARRITO (LÓGICA E INTERFAZ)
   ========================================================================== */
window.toggleCart = function() {
    const panel = document.getElementById('cart-panel');
    if (panel) panel.classList.toggle('open');
};

window.actualizarInterfaz = function() {
    const lista = document.getElementById('cart-items');
    const count = document.getElementById('cart-count');
    const totalElem = document.getElementById('cart-total');
    if(!lista) return; 

    lista.innerHTML = "";
    let subtotalGeneral = 0;
    let unidadesTotales = 0;

    // Renderizado de productos
    carrito.forEach(item => {
        const subtotalItem = item.precio * item.cantidad;
        subtotalGeneral += subtotalItem;
        unidadesTotales += item.cantidad;

        lista.innerHTML += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #222; padding-bottom: 10px;">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: bold; color: #fff;">${item.nombre}</span>
                    <span style="color: var(--cyan); font-size: 0.9rem;">${subtotalItem.toFixed(2)}€</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button class="btn-qty" onclick="cambiarCantidad('${item.nombre}', -1)" style="background: transparent; border: 1px solid var(--pink); color: var(--pink); width: 25px; cursor: pointer;">-</button>
                    <span style="color: #fff; font-weight: bold; min-width: 15px; text-align: center;">${item.cantidad}</span>
                    <button class="btn-qty" onclick="cambiarCantidad('${item.nombre}', 1)" style="background: transparent; border: 1px solid var(--cyan); color: var(--cyan); width: 25px; cursor: pointer;">+</button>
                </div>
            </div>`;
    });

    // Lógica de costes y beneficios
    const costoEnvio = 4.99;
    const gratisAPartirDe = 50;
    const esGratis = subtotalGeneral >= gratisAPartirDe;
    const tienePremioDisponible = localStorage.getItem('descuento_olimpo') === '10';
    const descuentoYaActivado = localStorage.getItem('descuento_activado_en_carrito') === 'si';

    let totalFinal = (esGratis || subtotalGeneral === 0) ? subtotalGeneral : subtotalGeneral + costoEnvio;

    if (carrito.length > 0) {
        let htmlExtra = `
            <div style="margin-top: 10px; padding: 8px 0; border-top: 1px dashed #333;">
                <div style="display: flex; align-items: center; justify-content: start; gap: 8px; margin-bottom: 8px;">
                    <img src="entrega.png" style="width: 30px; filter: drop-shadow(0 0 5px var(--cyan));">
                    <div style="font-family: 'Arial Black'; font-size: 0.85rem; color: #fff;">
                        GASTOS DE ENVÍO: <span style="color: ${esGratis ? 'var(--pink)' : '#fff'}; text-decoration: ${esGratis ? 'line-through' : 'none'}; font-weight: bold;">${costoEnvio.toFixed(2)}€</span>
                    </div>
                </div>`;

        if (descuentoYaActivado) {
            totalFinal = Math.max(0, totalFinal - 5);
            htmlExtra += `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding: 10px; background: rgba(255, 0, 217, 0.1); border: 1px solid var(--pink); border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: var(--pink); text-shadow: 0 0 8px var(--pink);">⚡</span>
                        <span style="font-family: 'Arial Black'; font-size: 0.8rem; color: var(--pink);">BENDICIÓN: -5.00€</span>
                    </div>
                    <button onclick="window.desactivarDescuento()" style="background: #fff; border: none; color: #000; font-family: 'Arial Black'; font-size: 0.6rem; padding: 5px 10px; border-radius: 5px; cursor: pointer; text-transform: uppercase;">QUITAR</button>
                </div>`;
        } else if (tienePremioDisponible) {
            htmlExtra += `
                <button onclick="window.activarDescuentoEnCarrito()" style="width:100%; background:transparent; border:1px solid var(--pink); color:var(--pink); padding:10px; cursor:pointer; font-family:'Arial Black'; font-size: 0.75rem; margin-top:10px; box-shadow: 0 0 10px var(--pink); text-transform: uppercase;">
                    APLICAR BENDICIÓN DE 5€
                </button>`;
        }
        
        htmlExtra += `
                <div class="promo-info-neon" style="text-align: center; color: var(--cyan); font-family: 'Segoe Script', cursive; font-size: 1.2rem; text-shadow: 0 0 10px var(--cyan); line-height: 1.3; margin-top: 10px;">
                    ${esGratis ? "¡Envío GRATIS por los Dioses!" : `* Envío GRATIS a partir de 50€<br>(Te faltan ${(gratisAPartirDe - subtotalGeneral).toFixed(2)}€)`}
                </div>
            </div>`;
        lista.innerHTML += htmlExtra;
    }

    if (count) count.innerText = unidadesTotales;
    if (totalElem) totalElem.innerText = totalFinal.toFixed(2);
};

window.cambiarCantidad = function(nombre, delta) {
    window.reproducirSonido(); 
    const producto = carrito.find(item => item.nombre === nombre);
    if (producto) {
        producto.cantidad += delta;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(item => item.nombre !== nombre);
        }
        localStorage.setItem('olimpo_cart', JSON.stringify(carrito));
        actualizarInterfaz();
    }
};

window.vaciarCarrito = function() {
    carrito = [];
    localStorage.removeItem('olimpo_cart');
    actualizarInterfaz();
    mostrarMensajeDivino("CARRITO PURIFICADO", "rosa");
};

/* ==========================================================================
   4. SISTEMA DE USUARIO Y AUTENTICACIÓN
   ========================================================================== */
window.toggleMobileMenu = function() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
};

// NUEVO: Cerrar el menú automáticamente al hacer clic en cualquier enlace
document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    // Si el menú está abierto y pulsamos un enlace de dentro...
    if (navLinks && navLinks.classList.contains('active') && e.target.closest('.nav-links a')) {
        navLinks.classList.remove('active');
    }
});

function verificarSesion() {
    const nombreUsuario = localStorage.getItem('mortal_nombre');
    const contenedores = document.querySelectorAll('.nav-wrapper');
    
    if (nombreUsuario && contenedores.length > 0) {
        contenedores.forEach(contenedor => {
            if (contenedor.querySelector('.user-dropdown')) return;
            contenedor.querySelectorAll('.user-access').forEach(btn => btn.style.display = 'none');
            
            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            dropdown.innerHTML = `
                <span onclick="toggleUserMenu()" style="color: var(--cyan); font-weight: bold; cursor: pointer; font-family: 'Arial Black'; font-size: 0.9rem;">
                    ⚡ ${nombreUsuario.toUpperCase()} ▼
                </span>
                <div id="userMenu" class="dropdown-user-content">
                    <a href="javascript:void(0)" onclick="abrirHistorial()">MIS BANQUETES</a>
                    <a href="javascript:void(0)" onclick="cerrarSesion()" style="color: var(--pink);">CERRAR SESIÓN</a>
                </div>`;
            contenedor.appendChild(dropdown);
        });
    }
}

function configurarEnvioRegistro() {
    const form = document.getElementById('form-registro');
    if (!form || form.dataset.hooked) return;
    form.dataset.hooked = "true";
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = {
            nombre: document.getElementById('reg-nombre').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-pass').value,
            direccion: document.getElementById('reg-direccion').value
        };
        try {
            const res = await fetch(`${API_URL}/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const resultado = await res.json();
            if (res.ok) {
                mostrarMensajeDivino(resultado.mensaje, 'cian'); 
                setTimeout(() => { form.reset(); window.cerrarRegistro(); }, 2000); 
            } else { mostrarMensajeDivino(resultado.mensaje, 'rosa'); }
        } catch (error) { mostrarMensajeDivino("SERVIDOR OFFLINE", "rosa"); }
    });
}

function configurarEnvioLogin() {
    const form = document.getElementById('form-login');
    if (!form || form.dataset.hooked) return;
    form.dataset.hooked = "true";
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const datos = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-pass').value
        };
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const resultado = await res.json();
            if (res.ok) {
                localStorage.setItem('mortal_nombre', resultado.nombre);
                localStorage.setItem('mortal_email', datos.email);
                mostrarMensajeDivino("BIENVENIDO AL OLIMPO", 'cian'); 
                setTimeout(() => location.reload(), 1000); 
            } else { mostrarMensajeDivino(resultado.mensaje, 'rosa'); }
        } catch (error) { mostrarMensajeDivino("ERROR DE CONEXIÓN", "rosa"); }
    });
}

window.toggleUserMenu = () => document.getElementById('userMenu')?.classList.toggle('show');
window.cerrarSesion = () => { localStorage.clear(); location.reload(); };

/* ==========================================================================
   5. FIDELIDAD Y PAGOS
   ========================================================================== */
function actualizarPuntosFidelidad(puntosReales) {
    const puntos = puntosReales || 0;
    const progreso = (puntos % 10) * 10; 
    const display = document.getElementById('puntos-display');
    const bar = document.getElementById('puntos-progreso-bar');
    const txt = document.getElementById('proximo-premio-txt');
    const btn = document.getElementById('btn-canjear-desc');

    if(display) display.innerText = puntos;
    if(bar) bar.style.width = progreso + "%";
    
    if(txt) {
        if(puntos >= 10) {
            txt.innerHTML = `<span style="color: var(--pink); font-weight: bold;">¡BENDICIÓN DE 5€ LISTA!</span>`;
            if(btn) btn.style.display = 'block'; 
        } else {
            const faltan = 10 - (puntos % 10);
            txt.innerHTML = `¡Te faltan ${faltan} puntos para tu próximo descuento!`;
            if(btn) btn.style.display = 'none';
        }
    }
}

window.canjearPremio = function() {
    localStorage.setItem('descuento_olimpo', '10');
    mostrarMensajeDivino("BENDICIÓN LISTA", "cian");
    cerrarHistorial();
    actualizarInterfaz();
    window.toggleCart();
};

window.activarDescuentoEnCarrito = function() {
    localStorage.setItem('descuento_activado_en_carrito', 'si');
    mostrarMensajeDivino("BENDICIÓN ACTIVADA", "cian");
    actualizarInterfaz();
};

window.desactivarDescuento = function() {
    localStorage.removeItem('descuento_activado_en_carrito');
    mostrarMensajeDivino("DESCUENTO GUARDADO", "rosa");
    actualizarInterfaz();
};

window.iniciarPago = async function() {
    window.reproducirSonido(); 
    const total = parseFloat(document.getElementById('cart-total').innerText);
    const email = localStorage.getItem('mortal_email');
    const descuentoUsado = localStorage.getItem('descuento_activado_en_carrito') === 'si';

    if (total <= 0) return mostrarMensajeDivino("CARRITO VACÍO", "rosa");
    if (!email) { mostrarMensajeDivino("INICIA SESIÓN", "rosa"); return window.abrirLogin(); }

    const resumen = carrito.map(item => `${item.cantidad}x ${item.nombre}`).join(', ');

    try {
        const res = await fetch(`${API_URL}/guardar-pedido`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email, productos: resumen, total: total, 
                consumirPuntos: descuentoUsado, puntosAConsumir: 10 
            })
        });

        if (res.ok) {
            mostrarMensajeDivino("¡PEDIDO ENVIADO!", "cian");
            if(descuentoUsado) {
                localStorage.removeItem('descuento_olimpo');
                localStorage.removeItem('descuento_activado_en_carrito');
            }
            carrito = []; 
            localStorage.removeItem('olimpo_cart');
            actualizarInterfaz(); 
            window.toggleCart();
        }
    } catch (e) { mostrarMensajeDivino("ERROR DE CONEXIÓN", "rosa"); }
};

/* ==========================================================================
   6. CARGA DINÁMICA Y MODALES
   ========================================================================== */
window.abrirHistorial = async function() {
    const email = localStorage.getItem('mortal_email');
    const modal = document.getElementById('modal-historial');
    if (!email || !modal) return;

    if (modal.innerHTML.trim() === "") {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="cerrarHistorial()">×</span>
                <div class="puntos-fidelidad-box" style="margin-bottom: 30px; border: 1px solid var(--cyan); padding: 20px; border-radius: 15px; background: rgba(0,242,255,0.05);">
                    <h3 style="color: #fff; font-size: 0.9rem; margin-bottom: 10px; font-family: 'Arial Black';">NIVEL DE GLORIA ACUMULADA</h3>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                        <span id="puntos-display" class="puntos-numero-god">0</span>
                        <div style="text-align: left;">
                            <p style="margin: 0; color: #fff; font-size: 0.8rem;">PUNTOS</p>
                            <p id="descuento-status" style="margin: 0; color: var(--cyan); font-size: 0.7rem;">Gasta 10€ para ganar 1 punto</p>
                        </div>
                    </div>
                    <div style="width: 100%; height: 8px; background: #111; border-radius: 10px; margin-top: 15px; border: 1px solid #333; overflow: hidden;">
                        <div id="puntos-progreso-bar" style="width: 0%; height: 100%; background: linear-gradient(to right, var(--cyan), var(--pink)); box-shadow: 0 0 10px var(--cyan); transition: 1s ease-in-out;"></div>
                    </div>
                    <div class="zona-canjeo" style="margin-top: 15px;">
                        <p id="proximo-premio-txt" style="font-size: 0.7rem; color: #888; margin-bottom: 10px;">¡Cada 10 puntos consigues 5€ de descuento!</p>
                        <button id="btn-canjear-desc" class="canjear-btn-neon" style="display: none;" onclick="window.canjearPremio()">RECLAMAR MI RECOMPENSA DE 5€</button>
                    </div>
                </div>
                <h2 style="color: var(--cyan); text-shadow: 0 0 10px var(--cyan); margin-bottom: 20px; font-size: 1.5rem;">HISTORIAL DE BANQUETES</h2>
                <div id="lista-pedidos" style="max-height: 300px; overflow-y: auto;"></div>
            </div>`;
    }

    const contenedor = document.getElementById('lista-pedidos');
    try {
        const res = await fetch(`${API_URL}/historial/${email}`);
        const data = await res.json(); 
        actualizarPuntosFidelidad(data.puntos || 0);
        contenedor.innerHTML = data.pedidos.length ? "" : "<p style='color:white; text-align:center;'>SIN OFRENDAS TODAVÍA.</p>";
        data.pedidos.forEach(p => {
            contenedor.innerHTML += `
                <div class="pedido-card" style="border: 1px solid #222; padding: 15px; margin-bottom: 10px; border-radius: 10px;">
                    <div class="pedido-header" style="display:flex; justify-content:space-between; color: var(--cyan); font-weight:bold; margin-bottom:5px;">
                        <span>📅 ${p.fecha_formateada}</span>
                        <span>${p.total}€</span>
                    </div>
                    <div style="color: #ccc; font-size:0.85rem;">⚡ ${p.productos}</div>
                </div>`;
        });
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('open'), 10);
    } catch (e) { mostrarMensajeDivino("ERROR AL CARGAR HISTORIAL", "rosa"); }
};

// Controles de visibilidad de modales
window.cerrarHistorial = () => {
    const m = document.getElementById('modal-historial');
    if(m) { m.classList.remove('open'); setTimeout(() => m.style.display='none', 300); }
};
window.abrirRegistro = () => {
    const m = document.getElementById('modal-registro');
    if(m) { m.style.display='block'; setTimeout(() => m.classList.add('open'), 10); }
};
window.cerrarRegistro = () => {
    const m = document.getElementById('modal-registro');
    if(m) { m.classList.remove('open'); setTimeout(() => m.style.display='none', 300); }
};
window.abrirLogin = () => {
    const m = document.getElementById('modal-login');
    if(m) { m.style.display='block'; setTimeout(() => m.classList.add('open'), 10); }
};
window.cerrarLogin = () => {
    const m = document.getElementById('modal-login');
    if(m) { m.classList.remove('open'); setTimeout(() => m.style.display='none', 300); }
};

/* ==========================================================================
   7. EFECTOS VISUALES Y EVENTOS INICIALES
   ========================================================================== */
function lanzarGraffiti() {
    const contenedor = document.querySelector('.location-section .divine-graffiti-container');
    if (!contenedor) return;
    const el = document.createElement('div');
    el.className = 'graffiti-phrase';
    if (Math.random() > 0.5) el.classList.add('rosa');
    el.innerText = frasesOlimpo[Math.floor(Math.random() * frasesOlimpo.length)];
    el.style.top = (Math.random() * 60 + 40) + "px";
    if (salirPorIzquierda) { el.style.left = "3vw"; el.style.textAlign = "left"; } 
    else { el.style.right = "3vw"; el.style.textAlign = "right"; }
    salirPorIzquierda = !salirPorIzquierda;
    contenedor.appendChild(el);
    setTimeout(() => el.remove(), 4500);
}

document.addEventListener('DOMContentLoaded', () => {
    verificarSesion(); 
    actualizarInterfaz();
    setInterval(lanzarGraffiti, 2500);

    // Carga de fragmentos HTML
    const cargarModal = (id, archivo, callback) => {
        const contenedor = document.getElementById(id);
        if (contenedor) {
            fetch(archivo)
                .then(r => r.text())
                .then(html => { contenedor.innerHTML = html; if(callback) callback(); })
                .catch(e => console.error("Error cargando " + archivo, e));
        }
    };
    cargarModal('contenedor-registro', 'registro.html', configurarEnvioRegistro);
    cargarModal('contenedor-login', 'login.html', configurarEnvioLogin);

    // Slider
    const slider = document.getElementById('slider');
    if (slider) {
        document.getElementById('btnNext').onclick = () => slider.scrollBy({ left: 950, behavior: 'smooth' });
        document.getElementById('btnPrev').onclick = () => slider.scrollBy({ left: -950, behavior: 'smooth' });
    }

    // Evento Delegado para compra
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('card-btn')) {
            window.reproducirSonido();
            const card = e.target.closest('.god-card, .bebida-card, .postre-card');
            if (card) {
                const nombre = (card.querySelector('h2') || card.querySelector('h3')).innerText;
                const precioStr = card.querySelector('.card-price').innerText;
                const precio = parseFloat(precioStr.replace(/[^\d.]/g, ''));
                const prod = carrito.find(item => item.nombre === nombre);
                prod ? prod.cantidad++ : carrito.push({ nombre, precio, cantidad: 1 });
                localStorage.setItem('olimpo_cart', JSON.stringify(carrito));
                mostrarMensajeDivino(`${nombre} añadido`);
                actualizarInterfaz();
            }
        }
    });
});

window.inicializarSeccionOlimpo = function() {
    verificarSesion();
    configurarEnvioLogin();
    configurarEnvioRegistro();
};

window.onload = () => {
    verificarSesion();
    configurarEnvioLogin();
    configurarEnvioRegistro();
};

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}