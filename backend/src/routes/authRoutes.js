// backend/src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta POST para iniciar sesión de un usuario
router.post('/login', authController.login);

// Ruta POST para registrar un nuevo usuario
router.post('/register', authController.register);

module.exports = router;