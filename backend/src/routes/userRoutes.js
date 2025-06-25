// backend/src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/profile', verifyToken, userController.getUserProfile);
router.patch('/profile', verifyToken, userController.updateProfile);

// Cambio de contraseña
router.patch('/change-password', verifyToken, userController.changePassword);

module.exports = router;