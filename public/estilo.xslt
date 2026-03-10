<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
    <html>
        <head>
            <title>OLIMPO BURGUER | El Sabor de los Dioses</title>
            <link rel="stylesheet" href="estilos.css"/>
            <link rel="icon" type="image/svg+xml" href="favicon.svg?v=1" />
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <script src="interaccion.js" defer="defer"></script>
        </head>
        <body class="body-principal">
            <nav class="navbar">
                <div class="logo-box">
                    <a href="hamburgueseria.xml" style="text-decoration: none;">
                        <span class="l-rosa">O</span>
                        <span class="l-azul">B</span>
                    </a>
                </div>
                
                <h1 class="nav-title">
                    <span class="t-rosa">OLIMPO</span> <span class="t-azul">BURGUER</span>
                </h1>

                <div class="menu-toggle" onclick="toggleMobileMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div class="nav-links" id="mobile-nav">
                    <div style="display: flex; align-items: center; gap: 20px;" class="nav-wrapper">
                        <div class="dropdown">
                            <button class="dropbtn">NUESTRA CARTA ▼</button>
                            <div class="dropdown-content">
                                <a href="burgers.xml"><span>🍔</span> LAS BURGERS</a>
                                <a href="entrantes.xml"><span>🍟</span> OFRENDAS</a>
                                <a href="bebidas.xml"><span>🍸</span> ELIXIRES</a>
                                <a href="postres.xml"><span>🍰</span> AMBROSÍA</a>
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
                    <div class="linea l1"><span>OLIMPO BURGUER 🍔 OLIMPO BURGUER 🍔 OLIMPO BURGUER 🍔 OLIMPO BURGUER</span></div>
                    <div class="linea l2"><span>🍔 OLIMPO BURGUER 🍔 OLIMPO BURGUER 🍔 OLIMPO BURGUER 🍔 OLIMPO BURGUER</span></div>
                    <div class="linea l3"><span>OLIMPO BURGUER 🍔 OLIMPO BURGUER 🍔 OLIMPO BURGUER 🍔 OLIMPO BURGUER</span></div>
                    <div class="linea l4"><span>🍔 OLIMPO BURGUER 🍔 OLIMPO BURGUER 🍔 OLIMPO BURGUER 🍔 OLIMPO BURGUER</span></div>
                </div>
                <p class="slogan-god">
                    <span class="t-azul">NO ES UNA HAMBURGUESA, </span> 
                    <span class="t-rosa">ES UNA HISTORIA</span>
                </p>
            </header>

            <main class="menu-god" id="carta" style="flex-direction: column;">
                <h2 class="titulo-neon" style="width:100%; text-align:center; margin-bottom:40px;">
                    SUGERENCIAS <span class="palabra-rosa">DEL DÍA</span>
                </h2>

                <div style="display: flex; align-items: center; width: 100%;">
                    <button class="arrow" id="btnPrev">◀</button>
                    
                    <div class="slider-container" id="slider">
                        <xsl:for-each select="hamburgueseria/*[@sugerencia='si']">
                            <div class="god-card">
                                <div class="card-img-side">
                                    <img src="{imagen}" alt="{nombre}"/>
                                </div>
                                <div class="card-info-side">
                                    <span class="card-cat"><xsl:value-of select="@categoria"/></span>
                                    <h3><xsl:value-of select="nombre"/></h3>
                                    <p><xsl:value-of select="descripcion"/></p>
                                    <div class="card-footer-side">
                                        <span class="card-price"><xsl:value-of select="precio"/>€</span>
                                        <button class="card-btn">PEDIR</button>
                                    </div>
                                </div>
                            </div>
                        </xsl:for-each>
                    </div>
                    
                    <button class="arrow" id="btnNext">▶</button>
                </div>
            </main>

            <section class="location-section">
                <div class="divine-graffiti-container"></div>
                <h2 class="titulo-neon">NUESTRA <span class="palabra-rosa">FORJA</span></h2>
                <div class="location-container">
                    <div class="location-info">
                        <div class="info-card">
                            <h3 class="t-rosa small-title">UBICACIÓN</h3>
                            <p class="info-text"><xsl:value-of select="hamburgueseria/contacto/direccion"/></p>
                        </div>
                        <div class="info-card">
                            <h3 class="t-azul small-title">HORARIO</h3>
                            <p class="info-text"><xsl:value-of select="hamburgueseria/contacto/horario"/></p>
                        </div>
                        <div class="info-card">
                            <h3 class="t-rosa small-title">CONTACTO</h3>
                            <p class="info-text"><xsl:value-of select="hamburgueseria/contacto/telefono"/></p>
                        </div>
                    </div>
                    
                    <div class="map-box">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1754.3049912063568!2d-16.32297172135168!3d28.431023095717663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc41cd37ee2977a7%3A0x18d3a1c0b06be2a8!2sC.%20Chineguas%2C%20185%2C%2038107%20Santa%20Cruz%20de%20Tenerife!5e0!3m2!1ses!2ses!4v1772750135826!5m2!1ses!2ses" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </section>

            <div id="cart-panel">
                <div class="cart-header">
                    <h2>TU PEDIDO</h2>
                    <button onclick="toggleCart()" class="close-cart">X</button>
                </div>
                
                <div id="cart-items"></div>

                <div class="cart-footer-panel">
                    <div class="total-row">
                        <span>TOTAL:</span>
                        <div>
                            <span id="cart-total">0.00</span>€
                        </div>
                    </div>
                    <button class="checkout-btn" onclick="iniciarPago()">PAGAR AHORA</button>
                    <button class="clear-btn" onclick="vaciarCarrito()">VACIAR</button>
                </div>
            </div>

            <div id="notification-container" class="notification"></div>
            
            <audio id="sonido-clic" src="sonido clic.mp3" preload="auto"></audio>
            <div id="contenedor-registro"></div>
            <div id="contenedor-login"></div>

            <div id="modal-historial" class="modal-neon">
                <div class="modal-content">
                    <span class="close-modal" onclick="cerrarHistorial()">×</span>
                    
                    <div class="puntos-fidelidad-box" style="margin-bottom: 30px; border: 1px solid var(--cyan); padding: 20px; border-radius: 15px; background: rgba(0,242,255,0.05);">
                        <h3 style="color: #fff; font-size: 0.9rem; margin-bottom: 10px; font-family: 'Arial Black';">NIVEL DE GLORIA ACUMULADA</h3>
                        
                        <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                            <span id="puntos-display" class="puntos-numero-god">6</span>
                            
                            <div style="text-align: left;">
                                <p style="margin: 0; color: #fff; font-size: 0.8rem;">PUNTOS</p>
                                <p id="descuento-status" style="margin: 0; color: var(--cyan); font-size: 0.7rem;">Gasta 10€ para ganar 1 punto</p>
                            </div>
                        </div>
                        
                        <div style="width: 100%; height: 8px; background: #111; border-radius: 10px; margin-top: 15px; border: 1px solid #333; overflow: hidden;">
                            <div id="puntos-progreso-bar" style="width: 0%; height: 100%; background: linear-gradient(to right, var(--cyan), var(--pink)); box-shadow: 0 0 10px var(--cyan); transition: 1s ease-in-out;"></div>
                        </div>
                        
                        <div class="zona-canjeo" style="margin-top: 15px;">
                            <p id="proximo-premio-txt" style="font-size: 0.7rem; color: #888; margin-bottom: 10px;">¡Cada 5 puntos consigues 5€ de descuento!</p>
                            
                            <button id="btn-canjear-desc" class="canjear-btn-neon" style="display: none;" onclick="window.canjearPremio()">RECLAMAR MI RECOMPENSA DE 5€</button>
                        </div>
                    </div>

                    <h2 style="color: var(--cyan); text-shadow: 0 0 10px var(--cyan); margin-bottom: 20px; font-size: 1.5rem;">HISTORIAL DE BANQUETES</h2>
                    <div id="lista-pedidos" style="max-height: 300px; overflow-y: auto;">
                        </div>
                </div>
            </div>

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