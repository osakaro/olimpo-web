require('dotenv').config(); // 1. CARGA LAS VARIABLES AL PRINCIPIO
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors()); 
app.use(express.json()); 

// 2. CONFIGURACIÓN USANDO LAS VARIABLES DEL .ENV
const dbConfig = {
    host: process.env.TIDB_CLOUD_HOST,
    user: process.env.TIDB_CLOUD_USER,
    password: process.env.TIDB_CLOUD_PASSWORD,
    database: process.env.TIDB_CLOUD_DATABASE,
    port: process.env.TIDB_CLOUD_PORT,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
};

// 1. Esto busca el CSS y las imágenes dentro de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// 2. Esto envía el archivo XML que está dentro de public al entrar a la web
const fs = require('fs').promises;

app.get('/', async (req, res) => {
    let connection;
    try {
        // 1. Lee el XML que ahora está "limpio"
        let xmlBase = await fs.readFile(path.join(__dirname, 'public', 'hamburgueseria.xml'), 'utf8');
        const userEmail = req.query.email;

        let bloqueRuleta = '';

        if (userEmail) {
            connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.execute(
                "SELECT ya_jugo, premio_id, DATE_FORMAT(caducidad_premio, '%d/%m/%Y') as fecha FROM usuarios WHERE email = ?", 
                [userEmail]
            );

            if (rows.length > 0 && rows[0].ya_jugo === 'si') {
                // Si ya jugó, inyectamos la ruleta APAGADA pero con los datos del premio
                bloqueRuleta = `
                <juego_ruleta activo="no">
                    <ya_jugo>si</ya_jugo>
                    <premio_destino>${rows[0].premio_id}</premio_destino>
                    <caducidad>${rows[0].fecha}</caducidad>
                </juego_ruleta>`;
            } else {
                // Si está logueado pero NO ha jugado, inyectamos la ruleta ENCENDIDA
                bloqueRuleta = `<juego_ruleta activo="si"><ya_jugo>no</ya_jugo></juego_ruleta>`;
            }
        } else {
            // Si es un invitado (no hay email), inyectamos la ruleta ENCENDIDA
            bloqueRuleta = `<juego_ruleta activo="si"><ya_jugo>no</ya_jugo></juego_ruleta>`;
        }

        // 2. Aquí es donde se vuelve a meter la ruleta en el XML antes de enviarlo
        xmlBase = xmlBase.replace('</hamburgueseria>', `${bloqueRuleta}\n</hamburgueseria>`);
        
        res.header('Content-Type', 'application/xml');
        res.send(xmlBase);

    } catch (error) {
        console.error("Error:", error);
        // Si todo falla, enviamos el archivo normal
        res.sendFile(path.join(__dirname, 'public', 'hamburgueseria.xml'));
    } finally {
        if (connection) await connection.end();
    }
});

// --- RUTAS DE API ---

// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute("SELECT * FROM usuarios WHERE email = ? AND password = ?", [email, password]);
        if (results.length > 0) {
            res.json({ exito: true, nombre: results[0].nombre, mensaje: "BIENVENIDO" });
        } else {
            res.status(401).json({ exito: false, mensaje: "MORTAL NO ENCONTRADO" });
        }
    } catch (error) {
        res.status(500).json({ mensaje: "ERROR DB: " + error.message });
    } finally { if (connection) await connection.end(); }
});

// GUARDAR PEDIDO
app.post('/guardar-pedido', async (req, res) => {
    const { email, total, consumirPuntos } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const totalComida = (total < 50 && total > 4.99) ? (total - 4.99) : total;
        const puntosGanados = Math.floor(totalComida / 10);
        const esDescuento = (consumirPuntos === true || consumirPuntos === 'true' || consumirPuntos === 'si');
        const restaFija = esDescuento ? 10 : 0;

        await connection.execute("UPDATE usuarios SET puntos = GREATEST(0, puntos + ? - ?) WHERE email = ?", [puntosGanados, restaFija, email]);
        await connection.execute("INSERT INTO pedidos (usuario_email, productos, total, fecha) VALUES (?, ?, ?, NOW())", [email, req.body.productos || 'Varios', total]);

        res.status(200).json({ mensaje: "PUNTOS ACTUALIZADOS" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "ERROR AL GUARDAR: " + error.message });
    } finally { if (connection) await connection.end(); }
});

// HISTORIAL
app.get('/historial/:email', async (req, res) => {
    const email = req.params.email;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [pedidos] = await connection.execute("SELECT productos, total, DATE_FORMAT(fecha, '%d/%m/%Y %H:%i') as fecha_formateada FROM pedidos WHERE usuario_email = ? ORDER BY fecha DESC", [email]);
        const [usuario] = await connection.execute("SELECT puntos FROM usuarios WHERE email = ?", [email]);
        const puntosReales = usuario.length > 0 ? usuario[0].puntos : 0;
        res.json({ pedidos, puntos: puntosReales });
    } catch (error) {
        res.status(500).json({ mensaje: "ERROR HISTORIAL: " + error.message });
    } finally { if (connection) await connection.end(); }
});

// REGISTRO
app.post('/registro', async (req, res) => {
    const { nombre, email, password, direccion } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute("INSERT INTO usuarios (nombre, email, password, direccion, puntos) VALUES (?, ?, ?, ?, 0)", [nombre, email, password, direccion]);
        res.json({ mensaje: "MORTAL REGISTRADO" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "ERROR DB: " + error.message });
    } finally { if (connection) await connection.end(); }
});

// PUERTO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor del Olimpo en el puerto ${PORT}`);
});


//RULETA DE LA FORTUNA
// --- RULETA DE LA FORTUNA ---
app.post('/guardar-premio', async (req, res) => {
    const { email, id_premio } = req.body;
    let connection;
    
    const fechaCaducidad = new Date();
    fechaCaducidad.setDate(fechaCaducidad.getDate() + 7);
    const caducidadFormateada = fechaCaducidad.toISOString().split('T')[0];

    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            "UPDATE usuarios SET ya_jugo = 'si', premio_id = ?, caducidad_premio = ? WHERE email = ?", 
            [id_premio, caducidadFormateada, email]
        );
        res.status(200).json({ mensaje: "BENDICIÓN GUARDADA EN EL OLIMPO" });
    } catch (error) {
        res.status(500).json({ mensaje: "ERROR AL GUARDAR PREMIO: " + error.message });
    } finally {
        if (connection) await connection.end();
    }
});