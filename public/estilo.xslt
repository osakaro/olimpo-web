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
                                        
                                        <button class="card-btn">
                                            <xsl:attribute name="onclick">
                                                <xsl:choose>
                                                    <xsl:when test="name()='hamburguesa' or name()='plato'">
                                                        <xsl:text>abrirConfigurador('</xsl:text>
                                                        <xsl:value-of select="nombre"/>
                                                        <xsl:text>', '</xsl:text>
                                                        <xsl:value-of select="precio"/>
                                                        <xsl:text>', '</xsl:text>
                                                        <xsl:for-each select="ingredientes/item[@modificable='si']">
                                                            <xsl:value-of select="."/>
                                                            <xsl:if test="position() != last()">, </xsl:if>
                                                        </xsl:for-each>
                                                        <xsl:text>', '</xsl:text>
                                                        <xsl:for-each select="extras/suplemento">
                                                            <xsl:value-of select="."/>:<xsl:value-of select="@precio"/>
                                                            <xsl:if test="position() != last()">, </xsl:if>
                                                        </xsl:for-each>
                                                        <xsl:text>')</xsl:text>
                                                    </xsl:when>
                                                    <xsl:otherwise>
                                                        <xsl:text>agregarAlCarrito('</xsl:text>
                                                        <xsl:value-of select="nombre"/>
                                                        <xsl:text>', '</xsl:text>
                                                        <xsl:value-of select="precio"/>
                                                        <xsl:text>')</xsl:text>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                            </xsl:attribute>
                                            PEDIR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </xsl:for-each>
                    </div>
                    
                    <button class="arrow" id="btnNext">▶</button>
                </div>
            </main>

            <div id="modal-personalizar" class="modal-neon" style="display:none; position: fixed; z-index: 100010; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); align-items: center; justify-content: center;">
                <div class="modal-content" style="background: #000; border: 2px solid var(--cyan); padding: 25px; width: 90%; max-width: 400px; border-radius: 15px; box-shadow: 0 0 20px var(--cyan);">
                    <h2 id="p-nombre" class="t-rosa" style="text-align: center; margin-bottom: 20px;">NOMBRE</h2>
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
                        <button onclick="cerrarConfigurador()" style="background: none; border: none; color: #666; margin-top: 25px; cursor: pointer; display: block; width: 100%;">CANCELAR</button>
                    </div>
                </div>
            </div>

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
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.6098266747267!2d-16.32446402483945!3d28.431027793203313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc41cd37ee2977a7%3A0x18d3a1c0b06be2a8!2sC.%20Chineguas%2C%20185%2C%2038107%20Santa%20Cruz%20de%20Tenerife!5e0!3m2!1ses!2ses!4v1773235591936!5m2!1ses!2ses" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
                        <div><span id="cart-total">0.00</span>€</div>
                    </div>
                    <button class="checkout-btn" onclick="iniciarPago()">PAGAR AHORA</button>
                    <button class="clear-btn" onclick="vaciarCarrito()">VACIAR</button>
                </div>
            </div>

            
            <audio id="sonido-clic" src="sonido clic.mp3" preload="auto"></audio>
            <div id="contenedor-registro"></div>
            <div id="contenedor-login"></div>

           <div id="modal-historial" class="modal-neon" style="display:none;">
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
                            <div id="puntos-progreso-bar" style="width: 0%; height: 100%; background: linear-gradient(to right, var(--cyan), var(--pink)); transition: 1s ease-in-out;"></div>
                        </div>
                        <div class="zona-canjeo" style="margin-top: 15px; text-align: center;">
                            <button id="btn-canjear-desc" class="canjear-btn-neon" style="display: none; width: 100%;" onclick="window.canjearPremio()">
                                RECLAMAR RECOMPENSA DE 5€
                            </button>
                        </div>
                    </div>

                    <h2 style="color: var(--cyan); text-shadow: 0 0 10px var(--cyan); margin-bottom: 20px; font-size: 1.5rem;">HISTORIAL DE BANQUETES</h2>
                    <div id="lista-pedidos" style="max-height: 300px; overflow-y: auto;">
                        </div>
                </div>
            </div>

            <div id="modal-bendiciones" class="modal-neon" style="display:none; position: fixed; z-index: 100020; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); align-items: center; justify-content: center;">
                <div class="modal-content" style="background: #000; border: 2px solid var(--cyan); padding: 30px; width: 90%; max-width: 400px; border-radius: 20px; box-shadow: 0 0 30px var(--cyan); position: relative;">
                    
                    <span class="close-modal" onclick="cerrarBendiciones()" style="position: absolute; right: 20px; top: 15px; color: white; cursor: pointer; font-size: 1.5rem;">×</span>
                    
                    <h2 class="titulo-neon" style="text-align:center; font-size: 1.5rem; margin-bottom: 25px;">
                        MIS <span class="palabra-rosa">BENDICIONES</span>
                    </h2>

                    <xsl:choose>
                        <xsl:when test="/hamburgueseria/juego_ruleta/ya_jugo = 'si'">
                            <div class="ticket-god" style="background: #0a0a0a; border: 2px dashed var(--pink); padding: 20px; border-radius: 10px; position: relative; box-shadow: 0 0 15px rgba(255,0,217,0.2);">
                                <div style="position: absolute; left: -12px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; background: #000; border-radius: 50%; border: 2px solid var(--pink);"></div>
                                <div style="position: absolute; right: -12px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; background: #000; border-radius: 50%; border: 2px solid var(--pink);"></div>

                                <div style="text-align: center;">
                                    <h3 style="color: white; margin: 0; font-size: 0.8rem; letter-spacing: 2px; opacity: 0.6;">CUPÓN DE REGALO</h3>
                                    <p class="t-rosa" style="margin: 15px 0; font-weight: bold; font-size: 1.3rem; text-shadow: 0 0 10px var(--pink);">
                                        <xsl:variable name="pID" select="/hamburgueseria/juego_ruleta/premio_destino"/>
                                        <xsl:choose>
                                            <xsl:when test="$pID = '1'">TITÁN GRATIS</xsl:when>
                                            <xsl:when test="$pID = '2'">EL PECADO DE HADES GRATIS</xsl:when>
                                            <xsl:when test="$pID = '3'">EL RAYO DE ZEUS GRATIS</xsl:when>
                                            <xsl:when test="$pID = '4'">ATENEA GRATIS</xsl:when>
                                            <xsl:when test="$pID = '5'">MEDUSA GRATIS</xsl:when>
                                        </xsl:choose>
                                    </p>
                                    <p style="color: #666; font-size: 0.75rem; margin-bottom: 20px;">
                                        VÁLIDO HASTA: <span style="color: var(--cyan);"><xsl:value-of select="/hamburgueseria/juego_ruleta/caducidad"/></span>
                                    </p>
                                    <button class="card-btn btn-latido" style="width: 100%; padding: 12px; font-weight: bold;">
                                        <xsl:attribute name="onclick">
                                            <xsl:text>canjearPremioDirecto('</xsl:text>
                                            <xsl:variable name="pName" select="/hamburgueseria/juego_ruleta/premio_destino"/>
                                            <xsl:choose>
                                                <xsl:when test="$pName = '1'">TITÁN</xsl:when>
                                                <xsl:when test="$pName = '2'">EL PECADO DE HADES</xsl:when>
                                                <xsl:when test="$pName = '3'">EL RAYO DE ZEUS</xsl:when>
                                                <xsl:when test="$pName = '4'">ATENEA</xsl:when>
                                                <xsl:when test="$pName = '5'">MEDUSA</xsl:when>
                                            </xsl:choose>
                                            <xsl:text>')</xsl:text>
                                        </xsl:attribute>
                                        CANJEAR AHORA
                                    </button>
                                </div>
                            </div>
                        </xsl:when>
                        <xsl:otherwise>
                            <div style="text-align: center; padding: 30px; border: 1px solid #222; border-radius: 15px;">
                                <p style="color: #555; font-style: italic; margin-bottom: 15px;">No tienes bendiciones activas hoy.</p>
                                 <button onclick="cerrarBendiciones()" class="card-btn" style="cursor:pointer;">
                                    VOLVER A LA FORJA
                                </button>
                            </div>
                        </xsl:otherwise>
                    </xsl:choose>
                </div>
            </div>
            <xsl:if test="hamburgueseria/juego_ruleta/@activo = 'si'">
                <div id="modal-ruleta" class="modal-neon" style="display:flex; position: fixed; z-index: 99999; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); align-items: center; justify-content: center;">
                    <div class="modal-content" style="background: #000; border: 3px solid var(--pink); padding: 30px; border-radius: 20px; text-align: center; max-width: 450px; box-shadow: 0 0 30px var(--pink);">
                        <h2 class="titulo-neon">LA SUERTE DE <span class="palabra-rosa">ZEUS</span></h2>
                        <p style="color: white; margin-bottom: 20px;">¡Gira y reclama un manjar gratuito para tu banquete!</p>
                        
                    <div class="roulette-wrapper">
                            <div id="wheel-pointer">▼</div>
                            
                            <div id="main-wheel">
                                
                                <div class="seg seg-1">
                                    <div class="seg-content">
                                        <span class="seg-icon">🍔</span>
                                        <span class="seg-label">TITÁN</span>
                                    </div>
                                </div>
                                
                                <div class="seg seg-2">
                                    <div class="seg-content">
                                        <span class="seg-icon">🍫</span>
                                        <span class="seg-label">HADES</span>
                                    </div>
                                </div>
                                
                                <div class="seg seg-3">
                                    <div class="seg-content">
                                        <span class="seg-icon">🍟</span>
                                        <span class="seg-label">RAYO</span>
                                    </div>
                                </div>
                                
                                <div class="seg seg-4">
                                    <div class="seg-content">
                                        <span class="seg-icon">🐐</span>
                                        <span class="seg-label">ATENEA</span>
                                    </div>
                                </div>
                                
                                <div class="seg seg-5">
                                    <div class="seg-content">
                                        <span class="seg-icon">🐍</span>
                                        <span class="seg-label">MEDUSA</span>
                                    </div>
                                </div>
                                
                            </div> <input type="hidden" id="datos-premio" value="{/hamburgueseria/juego_ruleta/premio_destino}" />
                        </div>

                        <input type="hidden" id="datos-premio" value="{/hamburgueseria/juego_ruleta/premio_destino}" />
                        
                        <button id="btn-girar" class="checkout-btn" style="width: 100%; cursor: pointer;">¡PROBAR MI SUERTE!</button>
                        <button onclick="document.getElementById('modal-ruleta').style.display='none'" style="background:none; border:none; color:#666; margin-top:15px; cursor:pointer;">Quizás en otra ocasión...</button>
                    </div>
                </div>
            </xsl:if>

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