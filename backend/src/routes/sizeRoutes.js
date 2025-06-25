// backend/src/routes/sizeRoutes.js

const express = require('express');
const router = express.Router();
const sizeController = require('../controllers/sizeController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware'); // Importa los middlewares

// Rutas Públicas (cualquiera puede obtener las tallas)
router.get('/', sizeController.getAllSizes);
router.get('/:id', sizeController.getSizeById);

// Rutas Protegidas (solo usuarios con rol 'admin' pueden crear, actualizar o eliminar tallas)
router.post('/', verifyToken, authorizeRoles('admin'), sizeController.createSize);
router.put('/:id', verifyToken, authorizeRoles('admin'), sizeController.updateSize);
router.delete('/:id', verifyToken, authorizeRoles('admin'), sizeController.deleteSize);

module.exports = router;