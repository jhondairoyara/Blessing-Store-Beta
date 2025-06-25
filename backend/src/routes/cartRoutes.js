// backend/src/routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Obtener el carrito del usuario autenticado
router.get('/', verifyToken, cartController.getUserCart);

// Añadir o actualizar un producto en el carrito
router.post('/items', verifyToken, cartController.addCartItem);

// Actualizar la cantidad de un producto específico en el carrito
router.put('/items', verifyToken, cartController.updateCartItem);

// Eliminar un producto específico del carrito
router.delete('/items', verifyToken, cartController.removeCartItem);

// Vaciar completamente el carrito del usuario
router.delete('/clear', verifyToken, cartController.clearCart);

module.exports = router;