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
    // --- LÓGICA DE COSTES Y BENDICIÓN (CÓDIGO DEFINITIVO) ---
    const costoEnvio = 4.99;
    const gratisAPartirDe = 50;
    const esGratis = subtotalGeneral >= gratisAPartirDe;

    // 1. ¿El usuario ha reclamado el premio en "Mis Banquetes"?
    const premioReclamado = localStorage.getItem('descuento_olimpo') === '10';
    // 2. ¿Ya le ha dado al botón rosa de "Aplicar" dentro del carrito?
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
            // Caso A: El descuento ya restó los 5€
            totalFinal = Math.max(0, totalFinal - 5);
            htmlExtra += `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding: 10px; background: rgba(255, 0, 217, 0.1); border: 1px solid var(--pink); border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: var(--pink); text-shadow: 0 0 8px var(--pink);">⚡</span>
                        <span style="font-family: 'Arial Black'; font-size: 0.8rem; color: var(--pink);">BENDICIÓN: -5.00€</span>
                    </div>
                    <button onclick="window.desactivarDescuento()" style="background: #fff; border: none; color: #000; font-family: 'Arial Black'; font-size: 0.6rem; padding: 5px 10px; border-radius: 5px; cursor: pointer;">QUITAR</button>
                </div>`;
        } 
        else if (premioReclamado) {
            // Caso B: Pulsó el botón en el historial pero aún no lo ha aplicado en el carrito
            htmlExtra += `
                <button id="btn-activar-bendicion" 
                        onclick="window.activarDescuentoEnCarrito()" 
                        style="background: #ff00d9 !important; color: white !important; display: block !important; width: 100%; padding: 12px; margin-top: 10px; font-family: 'Arial Black'; border: none; border-radius: 8px; box-shadow: 0 0 15px #ff00d9; cursor: pointer; text-transform: uppercase;">
                    APLICAR BENDICIÓN DE 5€
                </button>`;
        }
        
        htmlExtra += `
                <div class="promo-info-neon" style="text-align: center; color: var(--cyan); font-family: 'Segoe Script', cursive; font-size: 1.2rem; margin-top: 10px;">
                    ${esGratis ? "¡Envío GRATIS por los Dioses!" : `* Envío GRATIS a partir de 50€`}
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
                <span onclick="toggleUserMenu(event)" style="color: var(--cyan); font-weight: bold; cursor: pointer; font-family: 'Arial Black'; font-size: 0.9rem;">
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
    localStorage.setItem('mortal_puntos', puntos);
    
    const display = document.getElementById('puntos-display');
    const bar = document.getElementById('puntos-progreso-bar');
    const txt = document.getElementById('proximo-premio-txt');
    const btn = document.getElementById('btn-canjear-desc');

    // Consola para debug (borrar luego)
    console.log("Actualizando puntos:", puntos, "¿Botón encontrado?:", !!btn);

    if(display) display.innerText = puntos;
    if(bar) bar.style.width = ((puntos % 10) * 10) + "%";
    
    if(btn) {
        if(puntos >= 10) {
            btn.style.display = 'block'; // Lo mostramos
            if(txt) txt.innerHTML = `<span style="color: var(--pink); font-weight: bold;">¡BENDICIÓN DE 5€ LISTA!</span>`;
        } else {
            btn.style.display = 'none'; // Lo ocultamos
            const faltan = 10 - (puntos % 10);
            if(txt) txt.innerHTML = `¡Te faltan ${faltan} puntos para tu próximo descuento!`;
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
                        <button id="btn-canjear-desc" class="canjear-btn-neon" onclick="window.canjearPremio()">RECLAMAR MI RECOMPENSA DE 5€</button>
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
        const puntos = data.puntos || 0;
        localStorage.setItem('mortal_puntos', puntos);

        // Calculamos aquí si debe verse el botón
        const mostrarBoton = puntos >= 10 ? 'block' : 'none';
        const textoPremio = puntos >= 10 
            ? '<span style="color: var(--pink); font-weight: bold;">¡BENDICIÓN DE 5€ LISTA!</span>' 
            : `¡Te faltan ${10 - (puntos % 10)} puntos para tu próximo descuento!`;

        // Inyectamos TODO el modal de una vez con los datos reales
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="cerrarHistorial()">×</span>
                <div class="puntos-fidelidad-box" style="margin-bottom: 30px; border: 1px solid var(--cyan); padding: 20px; border-radius: 15px; background: rgba(0,242,255,0.05);">
                    <h3 style="color: #fff; font-size: 0.9rem; margin-bottom: 10px; font-family: 'Arial Black';">NIVEL DE GLORIA ACUMULADA</h3>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                        <span class="puntos-numero-god">${puntos}</span>
                        <div style="text-align: left;">
                            <p style="margin: 0; color: #fff; font-size: 0.8rem;">PUNTOS</p>
                            <p style="margin: 0; color: var(--cyan); font-size: 0.7rem;">Gasta 10€ para ganar 1 punto</p>
                        </div>
                    </div>
                    <div style="width: 100%; height: 8px; background: #111; border-radius: 10px; margin-top: 15px; border: 1px solid #333; overflow: hidden;">
                        <div style="width: ${(puntos % 10) * 10}%; height: 100%; background: linear-gradient(to right, var(--cyan), var(--pink)); box-shadow: 0 0 10px var(--cyan);"></div>
                    </div>
                    <div class="zona-canjeo" style="margin-top: 15px; text-align: center;">
                        <p style="font-size: 0.75rem; color: #888; margin-bottom: 10px;">${textoPremio}</p>
                        <button id="btn-canjear-desc" class="canjear-btn-neon" 
                                style="display: ${mostrarBoton}; width: 100%;" 
                                onclick="window.canjearPremio()">
                            RECLAMAR MI RECOMPENSA DE 5€
                        </button>
                    </div>
                </div>
                <h2 style="color: var(--cyan); text-shadow: 0 0 10px var(--cyan); margin-bottom: 20px; font-size: 1.5rem;">HISTORIAL DE BANQUETES</h2>
                <div id="lista-pedidos" style="max-height: 300px; overflow-y: auto;">
                    ${data.pedidos.length ? '' : "<p style='color:white; text-align:center;'>SIN OFRENDAS TODAVÍA.</p>"}
                </div>
            </div>`;

        // Renderizamos los pedidos en el contenedor que acabamos de crear
        const contenedor = document.getElementById('lista-pedidos');
        data.pedidos.forEach(p => {
            contenedor.innerHTML += `
                <div class="pedido-card" style="border: 1px solid #222; padding: 15px; margin-bottom: 10px; border-radius: 10px;">
                    <div style="display:flex; justify-content:space-between; color: var(--cyan); font-weight:bold; margin-bottom:5px;">
                        <span>📅 ${p.fecha_formateada}</span>
                        <span>${p.total}€</span>
                    </div>
                    <div style="color: #ccc; font-size:0.85rem;">⚡ ${p.productos}</div>
                </div>`;
        });

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('open'), 10);
        window.actualizarInterfaz();

    } catch (e) { 
        console.error(e);
        mostrarMensajeDivino("ERROR AL CARGAR", "rosa"); 
    }
};

// Controles de visibilidad de modales
window.abrirRegistro = () => {
    // 1. CÓDIGO AÑADIDO: Cerramos el menú móvil y el menú de Oscar para que no estorbe
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.remove('show');
    }

    // 2. Tu código original para abrir el modal de registro
    const m = document.getElementById('modal-registro');
    if(m) { 
        m.style.display='block'; 
        setTimeout(() => m.classList.add('open'), 10); 
    }
};
window.cerrarHistorial = () => {
    const m = document.getElementById('modal-historial');
    if(m) { m.classList.remove('open'); setTimeout(() => m.style.display='none', 300); }
};
window.abrirRegistro = () => {
    // 1. CÓDIGO AÑADIDO: Cerramos el menú móvil para que no estorbe
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.remove('active');
    }

    // 2.código original para abrir el modal de registro
    const m = document.getElementById('modal-registro');
    if(m) { 
        m.style.display='block'; 
        setTimeout(() => m.classList.add('open'), 10); 
    }
};
window.cerrarRegistro = () => {
    const m = document.getElementById('modal-registro');
    if(m) { m.classList.remove('open'); setTimeout(() => m.style.display='none', 300); }
};
window.abrirLogin = () => {
    // 1. Cerramos el menú móvil y el menú
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.remove('active');
    }
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.remove('show');
    }

    const m = document.getElementById('modal-login');
    if(m) { 
        m.style.display='block'; 
        setTimeout(() => m.classList.add('open'), 10); 
    }
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

    // Carga de fragmentos HTML (Registro y Login)
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

    // Slider de la Home
    const slider = document.getElementById('slider');
    if (slider) {
        document.getElementById('btnNext').onclick = () => slider.scrollBy({ left: 950, behavior: 'smooth' });
        document.getElementById('btnPrev').onclick = () => slider.scrollBy({ left: -950, behavior: 'smooth' });
    }

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

// Función para abrir/cerrar manual (la que ya tienes)

/* ==========================================================================
   GESTIÓN DE MENÚS INTELIGENTE (EVITAR CONFLICTOS)
   ========================================================================== */

// 1. Función para el Menú Móvil (Hamburguesa)
// Función para el botón hamburguesa
window.toggleMobileMenu = function() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        // Toggle añade la clase si no está, y la quita si ya está
        navLinks.classList.toggle('active');
    }
};

window.toggleUserMenu = function(event) {
    // 1. Evitamos que el clic se propague y cierre el menú móvil por error
    if (event) event.stopPropagation();

    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        // Alternamos la clase show
        userMenu.classList.toggle('show');
    }
};

// Cerrar el menú si el usuario hace clic en cualquier otro sitio de la pantalla
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('userMenu');
    const userButton = document.querySelector('.user-dropdown');
    
    if (userMenu && userMenu.classList.contains('show')) {
        // Si el clic NO es en el botón ni en el menú, lo cerramos
        if (!userButton.contains(event.target)) {
            userMenu.classList.remove('show');
        }
    }
});

window.agregarAlCarrito = function(nombre, precio) {
    window.reproducirSonido();
    
    // Buscamos si ya existe ese producto exacto (con los mismos extras)
    const prodExistente = carrito.find(item => item.nombre === nombre);
    
    if (prodExistente) {
        prodExistente.cantidad++;
    } else {
        carrito.push({ 
            nombre: nombre, 
            precio: parseFloat(precio), 
            cantidad: 1 
        });
    }
    
    localStorage.setItem('olimpo_cart', JSON.stringify(carrito));
    window.mostrarMensajeDivino(`${nombre} añadido`);
    window.actualizarInterfaz();
};

/* --- LÓGICA DE PERSONALIZACIÓN DINÁMICA --- */
let currentBurger = { nombre: '', precioBase: 0, total: 0 };

window.abrirConfigurador = (nombre, precio, ingredientesString, extrasString) => {
    // 1. Guardamos datos
    currentBurger.nombre = nombre;
    currentBurger.precioBase = parseFloat(precio);
    currentBurger.total = currentBurger.precioBase;

    // 2. Actualizamos textos del modal
    document.getElementById('p-nombre').innerText = nombre;
    document.getElementById('p-total').innerText = currentBurger.total.toFixed(2);
    
    // 3. Procesamos ingredientes (lo que el XSLT manda separado por comas)
    const ingDiv = document.getElementById('lista-ingredientes');
    if (ingredientesString && ingredientesString.trim() !== "") {
        const listaIng = ingredientesString.split(', ');
        ingDiv.innerHTML = listaIng.map(i => `
            <div style="display:flex; justify-content:space-between; align-items:center; color:white; margin-bottom:12px;">
                <span style="font-size:0.9rem;">SIN ${i.toUpperCase()}</span>
                <input type="checkbox" style="width:20px; height:20px; accent-color:var(--cyan);">
            </div>
        `).join('');
    } else {
        ingDiv.innerHTML = "<p style='color:#666; font-size:0.8rem;'>Receta única de los Dioses</p>";
    }

    // 4. Procesamos extras
    const extDiv = document.getElementById('lista-extras');
    if (extrasString && extrasString.trim() !== "") {
        const listaExt = extrasString.split(', ');
        extDiv.innerHTML = listaExt.map(e => {
            const partes = e.split(':');
            const nExt = partes[0];
            const pExt = partes[1];
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; color:white; margin-bottom:12px;">
                    <span style="font-size:0.9rem;">${nExt.toUpperCase()} (+${parseFloat(pExt).toFixed(2)}€)</span>
                    <input type="checkbox" style="width:20px; height:20px; accent-color:var(--pink);" 
                           onchange="sumarExtra(this, ${pExt})">
                </div>
            `;
        }).join('');
    } else {
        extDiv.innerHTML = "<p style='color:#666; font-size:0.8rem;'>Sin extras disponibles</p>";
    }
    
    document.getElementById('modal-personalizar').style.display = 'flex';
};

window.sumarExtra = (cb, precio) => {
    if(cb.checked) {
        currentBurger.total += parseFloat(precio);
    } else {
        currentBurger.total -= parseFloat(precio);
    }
    document.getElementById('p-total').innerText = currentBurger.total.toFixed(2);
};

window.cerrarConfigurador = () => {
    document.getElementById('modal-personalizar').style.display = 'none';
};

window.confirmarYAnadir = () => {
    try {
        let quitados = [];
        const itemsQuitar = document.querySelectorAll('#lista-ingredientes input:checked');
        itemsQuitar.forEach(el => {
            let txt = el.parentElement.querySelector('span').innerText.replace('SIN ', '').trim();
            quitados.push(txt);
        });

        let extrasNombres = [];
        const itemsExtras = document.querySelectorAll('#lista-extras input:checked');
        itemsExtras.forEach(el => {
            let txtExtra = el.parentElement.querySelector('span').innerText.split(' (+')[0].trim();
            extrasNombres.push(txtExtra);
        });

        let nombreFinal = currentBurger.nombre;
        let detalles = [];
        if (quitados.length > 0) detalles.push("Sin: " + quitados.join(', '));
        if (extrasNombres.length > 0) detalles.push("Extra: " + extrasNombres.join(', '));
        
        if (detalles.length > 0) {
            nombreFinal += " (" + detalles.join(' | ') + ")";
        }

        window.agregarAlCarrito(nombreFinal, currentBurger.total);
        cerrarConfigurador();

    } catch (error) {
        console.error("Error al confirmar burger:", error);
    }
};