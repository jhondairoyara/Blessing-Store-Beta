// backend/src/routes/favoriteRoutes.js

const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Asegúrate que 'middlewares' es plural y solo necesitas verifyToken aquí

// Todas las rutas de favoritos requieren que el usuario esté autenticado

// Obtener la lista de favoritos del usuario
router.get('/', verifyToken, favoriteController.getFavorites);

// Añadir un producto a favoritos
router.post('/add', verifyToken, favoriteController.addFavorite);

// Eliminar un producto de favoritos
router.delete('/remove', verifyToken, favoriteController.removeFavorite);

// Verificar si un producto específico está en favoritos
router.get('/check/:productId', verifyToken, favoriteController.checkFavorite);

module.exports = router;