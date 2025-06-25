// backend/src/controllers/cartController.js

const cartModel = require('../models/cartModel');

// Obtiene o crea el carrito de compras del usuario.

async function getUserCart(req, res) {
    const userId = req.user.id; 

    // Valida la autenticación del usuario.
    if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado. ID de usuario no disponible.' });
    }

    try {
        // Obtiene o crea el carrito y sus detalles.
        const cart = await cartModel.getOrCreateCart(userId);
        const cartDetails = await cartModel.getCartDetails(cart.Id_Carrito);

        // Calcula el total del carrito.
        const total = cartDetails.reduce((sum, item) => sum + parseFloat(item.Subtotal || 0), 0);

        // Envía la respuesta con los detalles del carrito.
        res.json({
            cartId: cart.Id_Carrito,
            userId: cart.Id_Usuario,
            items: cartDetails,
            total: parseFloat(total.toFixed(2))
        });
    } catch (error) {
        // Maneja errores al obtener/crear el carrito.
        console.error('[getUserCart] Error en el controlador:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar el carrito.' });
    }
}

// Añade o actualiza un producto en el carrito.

async function addCartItem(req, res) {
    const userId = req.user.id;
    const { productId, quantity, selectedSizeId, selectedColor } = req.body;

    // Valida la autenticación y los datos de entrada.
    if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado. ID de usuario no disponible.' });
    }
    if (!productId || !quantity || quantity <= 0 || !selectedSizeId || !selectedColor) {
        return res.status(400).json({ message: 'Id_Producto, cantidad, Id_Talla y Color son obligatorios y la cantidad debe ser positiva.' });
    }

    try {
        // Llama al modelo para añadir o actualizar el ítem.
        const result = await cartModel.addOrUpdateCartItem(
            userId,
            productId,
            quantity,
            selectedSizeId,
            selectedColor
        );

        // Envía la respuesta según el resultado de la operación.
        if (result.success) {
            res.status(200).json({ 
                message: result.message, 
                newQuantity: result.newQuantity 
            });
        } else {
            res.status(400).json({ message: result.message }); 
        }
    } catch (error) {
        // Maneja errores al añadir el ítem al carrito.
        console.error('[addCartItem] Error en el controlador:', error);
        res.status(500).json({ message: 'Error interno del servidor al añadir el producto al carrito.' });
    }
}


// Actualiza la cantidad de un producto específico en el carrito.

async function updateCartItem(req, res) {
    const userId = req.user.id;
    const { productId, newQuantity, selectedSizeId, selectedColor } = req.body;

    // Valida la autenticación y los datos de entrada.
    if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado. ID de usuario no disponible.' });
    }
    if (!productId || typeof newQuantity === 'undefined' || newQuantity < 0 || !selectedSizeId || !selectedColor) {
        return res.status(400).json({ message: 'Id_Producto, nueva cantidad, Id_Talla y Color son obligatorios. La nueva cantidad no puede ser negativa.' });
    }

    try {
        // Llama al modelo para actualizar la cantidad del ítem.
        const result = await cartModel.updateCartItemQuantity(
            userId,
            productId,
            selectedSizeId,
            selectedColor,
            newQuantity
        );

        // Envía la respuesta según el resultado de la operación.
        if (result.success) {
            res.status(200).json({ 
                message: 'Cantidad del producto en el carrito actualizada exitosamente.',
                newQuantity: result.newQuantity 
            });
        } else {
            res.status(400).json({ message: result.message || 'No se pudo actualizar la cantidad del producto en el carrito.' });
        }
    } catch (error) {
        // Maneja errores al actualizar el ítem en el carrito.
        console.error('[updateCartItem] Error en el controlador:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el ítem del carrito.' });
    }
}

// Elimina un producto específico del carrito del usuario.

async function removeCartItem(req, res) {
    const userId = req.user.id;
    const { productId, selectedSizeId, selectedColor } = req.body; 

    // Valida la autenticación y los datos de entrada.
    if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado. ID de usuario no disponible.' });
    }
    if (!productId || !selectedSizeId || !selectedColor) {
        return res.status(400).json({ message: 'Id_Producto, Id_Talla y Color son obligatorios para eliminar un ítem.' });
    }

    try {
        // Llama al modelo para eliminar el ítem del carrito.
        const success = await cartModel.removeCartItem(
            userId,
            productId,
            selectedSizeId,
            selectedColor
        );

        // Envía la respuesta según el resultado de la operación.
        if (success) {
            res.status(200).json({ message: 'Producto eliminado del carrito exitosamente.' });
        } else {
            res.status(404).json({ message: 'Ítem no encontrado en el carrito.' });
        }
    } catch (error) {
        // Maneja errores al eliminar el ítem del carrito.
        console.error('[removeCartItem] Error en el controlador:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el ítem del carrito.' });
    }
}

// Vacía completamente el carrito del usuario.

async function clearCart(req, res) {
    const userId = req.user.id;

    // Valida la autenticación del usuario.
    if (!userId) {
        return res.status(401).json({ message: 'Usuario no autenticado. ID de usuario no disponible.' });
    }

    try {
        // Llama al modelo para vaciar el carrito.
        const success = await cartModel.clearCart(userId); 

        // Envía la respuesta según el resultado de la operación.
        if (success) {
            res.status(200).json({ message: 'Carrito vaciado exitosamente.' });
        } else {
            res.status(404).json({ message: 'Carrito no encontrado o ya estaba vacío.' });
        }
    } catch (error) {
        // Maneja errores al vaciar el carrito.
        console.error('[clearCart] Error en el controlador:', error);
        res.status(500).json({ message: 'Error interno del servidor al vaciar el carrito.' });
    }
}

module.exports = {
    getUserCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
};