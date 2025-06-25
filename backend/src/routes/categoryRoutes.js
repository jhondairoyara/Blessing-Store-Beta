// backend/src/routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación y autorización

// --- Rutas Públicas (no requieren autenticación) ---

// Obtener todas las categorías
router.get('/', categoryController.getAllCategories);

// Obtener una categoría por ID
router.get('/:id', categoryController.getCategoryById);


// --- Rutas Protegidas (requieren autenticación y rol 'admin') ---

// Crear una nueva categoría
router.post('/', verifyToken, authorizeRoles('admin'), categoryController.createCategory);

// Actualizar una categoría existente por ID
router.put('/:id', verifyToken, authorizeRoles('admin'), categoryController.updateCategory);

// Eliminar una categoría por ID
router.delete('/:id', verifyToken, authorizeRoles('admin'), categoryController.deleteCategory);

module.exports = router;