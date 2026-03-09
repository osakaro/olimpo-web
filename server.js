const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'oscar@@@006FUL',
    database: 'olimpo_db'
};

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
        res.status(500).json({ mensaje: "ERROR DB" });
    } finally { if (connection) await connection.end(); }
});

// GUARDAR PEDIDO (Calcula envío y resta puntos)
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
        res.status(500).json({ mensaje: "ERROR AL GUARDAR" });
    } finally { if (connection) await connection.end(); }
});

// HISTORIAL (Envía Pedidos + Puntos Reales)
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
        res.status(500).json({ mensaje: "ERROR HISTORIAL" });
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
        res.status(500).json({ mensaje: "EMAIL YA EXISTENTE" });
    } finally { if (connection) await connection.end(); }
});

const path = require('path');

// Esto le dice a Express que sirva todos tus archivos (CSS, JS, XML, etc.)
app.use(express.static(path.join(__dirname, '')));

// Esto hace que al entrar a la URL principal, se cargue tu XML o HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.xml')); // O index.html si es el principal
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor del Olimpo en el puerto ${PORT}`);
});
//final