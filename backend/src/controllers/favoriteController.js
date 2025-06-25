// backend/src/controllers/favoriteController.js

const favoriteModel = require('../models/favoriteModel');

// Obtiene todos los productos favoritos de un usuario.
async function getFavorites(req, res) {
    const userId = req.user.id; 

    // Valida la autenticación del usuario.
    if (!userId) {
        return res.status(401).json({ success: false, message: 'No autenticado. ID de usuario no proporcionado.' });
    }

    try {
        // Obtiene la lista de favoritos desde el modelo.
        const favorites = await favoriteModel.getUserFavorites(userId);

        // Responde con la lista de favoritos.
        res.status(200).json({
            success: true,
            favoritos: favorites,
            message: 'Productos favoritos obtenidos exitosamente.'
        });

    } catch (error) {
        // Maneja errores al obtener favoritos.
        console.error('Error en el controlador al obtener favoritos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al obtener la lista de favoritos.' });
    }
}

// Añade un producto (con variante opcional) a los favoritos del usuario.
async function addFavorite(req, res) {
    const userId = req.user.id;
    const { productId, sizeId, colorName } = req.body;

    // Valida la presencia de ID de usuario y producto.
    if (!userId || !productId) {
        return res.status(400).json({ success: false, message: 'ID de usuario o ID de producto faltante.' });
    }

    try {
        // Convierte sizeId a número o null, y colorName a string o null.
        const newFavorite = await favoriteModel.addFavorite(userId, productId, 
            sizeId ? parseInt(sizeId) : null,
            colorName || null
        );

        // Responde según si el producto fue añadido o ya existía.
        if (newFavorite) {
            res.status(201).json({ success: true, message: 'Producto añadido a favoritos.', favorite: newFavorite });
        } else {
            res.status(200).json({ success: true, message: 'El producto ya estaba en tus favoritos.', favorite: null });
        }
    } catch (error) {
        // Maneja errores al añadir favorito.
        console.error('Error al añadir favorito:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al añadir favorito.' });
    }
}

// Elimina un producto (con variante opcional) de los favoritos del usuario.
async function removeFavorite(req, res) {
    const userId = req.user.id;
    const { productId, sizeId, colorName } = req.body;

    // Valida la presencia de ID de usuario y producto.
    if (!userId || !productId) {
        return res.status(400).json({ success: false, message: 'ID de usuario o ID de producto faltante.' });
    }

    try {
        // Convierte sizeId a número o null, y colorName a string o null.
        const removed = await favoriteModel.removeFavorite(userId, productId, 
            sizeId ? parseInt(sizeId) : null, 
            colorName || null
        );

        // Responde según si el producto fue eliminado o no se encontró.
        if (removed) {
            res.status(200).json({ success: true, message: 'Producto eliminado de favoritos.' });
        } else {
            res.status(404).json({ success: false, message: 'El producto no se encontró en tus favoritos.' });
        }
    } catch (error) {
        // Maneja errores al eliminar favorito.
        console.error('Error al eliminar favorito:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al eliminar favorito.' });
    }
}

// Verifica si un producto (con variante opcional) está en los favoritos del usuario.
async function checkFavorite(req, res) {
    const userId = req.user.id;
    const productId = req.params.productId;
    
    // Procesa los parámetros de consulta para sizeId y colorName.
    const sizeId = req.query.sizeId ? (req.query.sizeId === 'null' ? null : parseInt(req.query.sizeId)) : null;
    const colorName = req.query.colorName ? (req.query.colorName === 'null' ? null : req.query.colorName) : null;

    // Valida la presencia de ID de usuario y producto.
    if (!userId || !productId) {
        return res.status(400).json({ success: false, message: 'ID de usuario o ID de producto faltante.' });
    }

    try {
        // Verifica el estado del favorito.
        const isFav = await favoriteModel.isFavorite(userId, productId, sizeId, colorName);
        res.status(200).json({ success: true, isFavorite: isFav });
    } catch (error) {
        // Maneja errores al verificar el favorito.
        console.error('Error en el controlador al verificar favorito:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al verificar el estado del favorito.' });
    }
}

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite
};