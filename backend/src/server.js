// backend/src/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const cookieParser = require('cookie-parser');
const path = require('path');

// Importación de rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sizeRoutes = require('./routes/sizeRoutes');
const cartRoutes = require('./routes/cartRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const authRoutes = require('./routes/authRoutes');
const ubicacionRoutes = require('./routes/ubicacionRoutes');

// Importación de middlewares
const { verifyToken } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());
app.use(cookieParser());

// Configura Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de prueba
app.get('/', (req, res) => res.send('🛍️ Blessing Store!'));
app.get('/test-db', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({ estado: 'éxito', mensaje: 'Conexión MySQL OK.' });
    } catch (error) {
        res.status(500).json({ estado: 'error', mensaje: 'Fallo conexión MySQL.', detalles: error.message });
    }
});

// Montaje de rutas API
app.use('/api/auth', authRoutes);

// Rutas que requieren autenticación (token JWT)
app.use('/api/usuarios', verifyToken, userRoutes);
app.use('/api/carrito', verifyToken, cartRoutes);
app.use('/api/favoritos', verifyToken, favoriteRoutes);

// Otras rutas (no requieren autenticación por defecto)
app.use('/api/productos', productRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/tallas', sizeRoutes);
app.use('/api/ubicaciones', ubicacionRoutes);

// Manejo de errores 404 (ruta no encontrada)
app.use((req, res, next) => res.status(404).json({ message: 'Ruta no encontrada.' }));

// Manejo de errores generales del servidor
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor.', error: err.message });
});

// --- Inicialización del servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Express en funcionamiento en http://localhost:${PORT}`);
    console.log(`Archivos estáticos servidos desde: ${path.join(__dirname, '../public')}`);
    console.log('¡Listo para construir Blessing Store!');
});