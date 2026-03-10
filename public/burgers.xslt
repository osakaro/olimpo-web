<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
    <html>
        <head>
            <title>LAS BURGERS | Olimpo Burguer</title>
            <link rel="stylesheet" href="estilos.css"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body class="body-bebidas">
            <nav class="navbar">
                <div class="logo-box">
                    <a href="hamburgueseria.xml" style="text-decoration: none;">
                        <span class="l-rosa">O</span>
                        <span class="l-azul">B</span>
                    </a>
                </div>
                <h1 class="nav-title">
                    <span class="t-rosa">LAS</span> <span class="t-azul">BURGERS</span>
                </h1>
                 <div class="menu-toggle" onclick="toggleMobileMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="nav-links">
                    <div class="nav-wrapper" style="display: flex; align-items: center; gap: 15px;">
                        <div class="dropdown">
                            <button class="dropbtn">NUESTRA CARTA ▼</button>
                            <div class="dropdown-content">
                                <a href="hamburgueseria.xml"><span>🏠</span>  INICIO</a>
                                <a href="burgers.xml"><span>🍔</span> LAS BURGERS</a>
                                <a href="entrantes.xml"><span>🍟</span>  OFRENDAS</a>
                                <a href="bebidas.xml"><span>🍸</span>  ELIXIRES</a>
                                <a href="postres.xml"><span>🍰</span>  AMBROSÍA</a>
                            </div>
                        </div>

                        <button id="cart-icon" onclick="toggleCart()">
                            🛒<span id="cart-count">0</span>
                        </button>

                        <div class="user-access" onclick="window.abrirLogin()" style="border-color: var(--cyan); cursor: pointer;">
                            <span style="color: var(--cyan);">ENTRAR</span>
                        </div>

                        <div class="user-access" onclick="abrirRegistro()">
                            <img src="zeus-login.png" alt="Login Zeus" class="zeus-nav-icon" />
                            <span>ÚNETE</span>
                        </div>
                    </div>
                </div>
            </nav>

            <header class="hero">
                <div class="parallax-bg">
                    <div class="linea l1"><span>LAS BURGERS 🍔 LAS BURGERS 🍔 LAS BURGERS 🍔 LAS BURGERS</span></div>
                    <div class="linea l2"><span>🍔 LAS BURGERS 🍔 LAS BURGERS 🍔 LAS BURGERS 🍔 LAS BURGERS</span></div>
                    <div class="linea l3"><span>LAS BURGERS 🍔 LAS BURGERS 🍔 LAS BURGERS 🍔 LAS BURGERS</span></div>
                    <div class="linea l4"><span>🍔 LAS BURGERS 🍔 LAS BURGERS 🍔 LAS BURGERS 🍔 LAS BURGERS</span></div>
                </div>
                <div class="hero-content">
                    <h2 class="slogan-god">
                        <span class="t-azul">EL BANQUETE DE </span> 
                        <span class="t-rosa">LOS DIOSES</span>
                    </h2>
                </div>
            </header>

            <main class="bebidas-grid">
                <xsl:for-each select="hamburgueseria/hamburguesa">
                    <div class="bebida-card">
                        <div class="bebida-img">
                            <img src="{imagen}" alt="{nombre}"/>
                        </div>
                        <div class="bebida-info">
                            <span class="card-cat"><xsl:value-of select="@categoria"/></span>
                            <h3><xsl:value-of select="nombre"/></h3>
                            <p class="bebida-desc"><xsl:value-of select="description"/></p>
                            <div class="bebida-footer">
                                <span class="card-price"><xsl:value-of select="precio"/>€</span>
                                <button class="card-btn" onclick="abrirConfigurador('{nombre}', '{precio}')">PEDIR</button>
                            </div>
                        </div>
                    </div>
                </xsl:for-each>
            </main>

            <div id="modal-personalizar" class="modal-neon" style="display:none; position: fixed; z-index: 100010; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); align-items: center; justify-content: center;">
                <div class="modal-content" style="background: #000; border: 2px solid var(--cyan); padding: 25px; width: 90%; max-width: 400px; border-radius: 15px; box-shadow: 0 0 20px var(--cyan);">
                    <h2 id="p-nombre" class="t-rosa" style="text-align: center; margin-bottom: 20px;">NOMBRE BURGER</h2>
                    
                    <div class="seccion-mod">
                        <h3 style="color: var(--cyan); font-size: 0.9rem; border-bottom: 1px solid #333; padding-bottom: 5px;">¿QUITAR ALGO? (Gratis)</h3>
                        <div id="lista-ingredientes" style="margin: 15px 0;"></div>
                    </div>

                    <div class="seccion-mod">
                        <h3 style="color: var(--pink); font-size: 0.9rem; border-bottom: 1px solid #333; padding-bottom: 5px;">AÑADIR GLORIA (Extra)</h3>
                        <div id="lista-extras" style="margin: 15px 0;"></div>
                    </div>

                    <div style="border-top: 2px solid #333; padding-top: 15px; text-align: center;">
                        <h3 style="color: white;">TOTAL: <span id="p-total" class="t-azul">0.00</span>€</h3>
                        <button onclick="confirmarYAnadir()" class="checkout-btn" style="width: 100%; margin-top: 10px;">AÑADIR AL BANQUETE</button>
                        <button onclick="cerrarConfigurador()" style="background: none; border: none; color: #666; margin-top: 10px; cursor: pointer;">CANCELAR</button>
                    </div>
                </div>
            </div>

            <div id="cart-panel">
                <div class="cart-header">
                    <h2>TU PEDIDO</h2>
                    <button onclick="toggleCart()" class="close-cart">X</button>
                </div>
                <div id="cart-items"></div>
                <div class="cart-footer-panel">
                    <div class="total-row">
                        <span>TOTAL:</span>
                        <span id="cart-total">0.00</span>€
                    </div>
                    <button class="checkout-btn" onclick="iniciarPago()">PAGAR AHORA</button>
                    <button class="clear-btn" onclick="vaciarCarrito()">VACIAR</button>
                </div>
            </div>

            <div id="contenedor-login"></div>
            <div id="contenedor-registro"></div>
            <div id="modal-historial" class="modal-neon"></div>
            <div id="notification-container"></div>

            <audio id="sonido-clic" src="sonido clic.mp3" preload="auto"></audio>

            <script src="interaccion.js"></script>
            
            <script>
                window.onload = function() {
                    console.log("🏛️ Sección cargada, activando lógica...");
                    if(window.inicializarSeccionOlimpo) {
                        window.inicializarSeccionOlimpo();
                    }
                };
            </script>

            <footer class="footer-bottom">
                <p>© 2026 OLIMPO BURGUER - Diseñado por Oscar Casanova 1ºDAW</p>
                <p style="font-size: 0.7rem; color: #666;">
                    Imágenes cortesía de <a href="https://www.pexels.com" style="color: var(--cyan); text-decoration: none;">Pexels</a> y 
                    <a href="https://www.unsplash.com" style="color: var(--pink); text-decoration: none;">Unsplash</a>.
                </p>
            </footer>
        </body>
    </html>
</xsl:template>
</xsl:stylesheet>