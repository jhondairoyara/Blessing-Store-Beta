// backend/src/models/cartModel.js

const db = require('../db');

/**
 * Obtiene el carrito de un usuario. Si no existe, lo crea.
 * @param {number} userId - El ID del usuario.
 * @returns {Promise<object>} El objeto del carrito.
 */
async function getOrCreateCart(userId) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        let [carts] = await connection.query(
            'SELECT Id_Carrito FROM carrito WHERE Id_Usuario = ?',
            [userId]
        );

        let cartId;
        if (carts.length > 0) {
            // Si el carrito existe, obtiene su ID.
            cartId = carts[0].Id_Carrito;
        } else {
            // Si el carrito no existe, lo crea.
            const [result] = await connection.query(
                'INSERT INTO carrito (Id_Usuario, Tiempo_Creacion) VALUES (?, NOW())',
                [userId]
            );
            cartId = result.insertId;
        }
        await connection.commit();
        return { Id_Carrito: cartId, Id_Usuario: userId };
    } catch (error) {
        // En caso de error, revierte la transacción.
        if (connection) await connection.rollback();
        console.error('Error al obtener o crear el carrito:', error);
        throw error;
    } finally {
        // Libera la conexión a la base de datos.
        if (connection) connection.release();
    }
}

/**
 * Obtiene los detalles de un carrito por su ID, incluyendo información de producto, talla, color y stock actual.
 * @param {number} cartId - El ID del carrito.
 * @returns {Promise<Array<object>>} Lista de ítems en el carrito.
 */
async function getCartDetails(cartId) {
    try {
        const [items] = await db.query(`
            SELECT
                dc.Id_Producto,
                p.Nombre_Producto,
                p.Descripcion,
                dc.Cantidad,
                dc.Precio_Unitario_Al_Momento AS Precio_Unitario_Carrito,
                p.Precio_Unitario AS Precio_Unitario_Actual,
                (dc.Precio_Unitario_Al_Momento * dc.Cantidad) AS Subtotal,
                dc.Id_Talla AS Id_Talla,
                t.Nombres_Talla AS Nombre_Talla,
                dc.Color_Seleccionado AS Color_Seleccionado,
                COALESCE(pt.Cantidad_Disponible, 0) AS stock,
                COALESCE(
                    (SELECT pi_color.Nombre_Archivo FROM producto_imagenes pi_color WHERE pi_color.Id_Producto = p.Id_Producto AND pi_color.Color_Asociado = dc.Color_Seleccionado ORDER BY pi_color.Orden ASC LIMIT 1),
                    (SELECT pi_default.Nombre_Archivo FROM producto_imagenes pi_default WHERE pi_default.Id_Producto = p.Id_Producto ORDER BY pi_default.Orden ASC LIMIT 1)
                ) AS Imagen_URL_Producto
            FROM detalles_carrito dc
            JOIN producto p ON dc.Id_Producto = p.Id_Producto
            LEFT JOIN tallas t ON dc.Id_Talla = t.Id_Tallas
            LEFT JOIN producto_tallas pt ON dc.Id_Producto = pt.Id_Producto
                                          AND dc.Id_Talla = pt.Id_Tallas
                                          AND dc.Color_Seleccionado = pt.Color_Variante
            WHERE dc.Id_Carrito = ?
            GROUP BY
                dc.Id_Producto, p.Nombre_Producto, p.Descripcion, dc.Cantidad,
                dc.Precio_Unitario_Al_Momento, p.Precio_Unitario, t.Nombres_Talla, dc.Color_Seleccionado,
                pt.Cantidad_Disponible, Imagen_URL_Producto
            ORDER BY dc.Id_Producto ASC
        `, [cartId]);

        // Formatea los resultados para el frontend.
        return items.map(item => ({
            ...item,
            imagen_url: item.Imagen_URL_Producto,
            Imagenes: item.Imagen_URL_Producto ? [item.Imagen_URL_Producto] : []
        }));
    } catch (error) {
        // Maneja errores al obtener los detalles del carrito.
        console.error(`Error al obtener detalles del carrito ${cartId}:`, error);
        throw error;
    }
}

/**
 * Añade un producto al carrito o actualiza su cantidad si ya existe.
 * Incluye precio_al_momento, id_talla y color, y VERIFICA STOCK.
 * @param {number} userId - El ID del usuario.
 * @param {number} productId - El ID del producto.
 * @param {number} quantityToAdd - La cantidad a añadir.
 * @param {number} selectedSizeId - El ID de la talla seleccionada.
 * @param {string} selectedColor - El nombre del color seleccionado.
 * @returns {Promise<object>} Un objeto indicando el éxito y el mensaje.
 */
async function addOrUpdateCartItem(userId, productId, quantityToAdd, selectedSizeId, selectedColor) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Obtiene o crea el carrito del usuario.
        const cart = await getOrCreateCart(userId);
        const cartId = cart.Id_Carrito;

        // Obtiene el precio actual del producto.
        const [productInfo] = await connection.query(
            'SELECT Precio_Unitario FROM producto WHERE Id_Producto = ?',
            [productId]
        );

        if (productInfo.length === 0) {
            await connection.rollback();
            throw new Error('Producto no encontrado.');
        }
        const priceAtAddition = productInfo[0].Precio_Unitario;

        // Obtiene el stock disponible para la combinación específica de talla y color.
        const [stockResult] = await connection.query(
            `SELECT Cantidad_Disponible
             FROM producto_tallas
             WHERE Id_Producto = ? AND Id_Tallas = ? AND Color_Variante = ?`,
            [productId, selectedSizeId, selectedColor]
        );

        console.log(`[cartModel] Stock para Producto: ${productId}, Talla: ${selectedSizeId}, Color: ${selectedColor} =>`, stockResult);

        if (stockResult.length === 0 || stockResult[0].Cantidad_Disponible === 0) {
            await connection.rollback();
            return { success: false, message: 'La combinación de producto, talla y color no existe o está agotada en el inventario.' };
        }
        const availableStock = stockResult[0].Cantidad_Disponible;

        // Verifica si el producto (con la misma talla y color) ya está en el carrito.
        const [existingItem] = await connection.query(
            'SELECT Cantidad FROM detalles_carrito WHERE Id_Carrito = ? AND Id_Producto = ? AND Id_Talla = ? AND Color_Seleccionado = ?',
            [cartId, productId, selectedSizeId, selectedColor]
        );

        console.log('[cartModel] Existing item in cart query result:', existingItem);

        let finalQuantity;
        let message;

        if (existingItem.length > 0) {
            // Si el ítem existe, actualiza la cantidad.
            const currentQuantityInCart = existingItem[0].Cantidad;
            finalQuantity = currentQuantityInCart + quantityToAdd;

            if (finalQuantity > availableStock) {
                finalQuantity = availableStock;
                message = 'Se añadió la cantidad máxima disponible para este producto. (Stock limitado)';
            } else {
                message = 'Cantidad del producto actualizada en el carrito.';
            }

            await connection.query(
                'UPDATE detalles_carrito SET Cantidad = ?, Precio_Unitario_Al_Momento = ?, Fecha_Actualizacion = NOW() WHERE Id_Carrito = ? AND Id_Producto = ? AND Id_Talla = ? AND Color_Seleccionado = ?',
                [finalQuantity, priceAtAddition, cartId, productId, selectedSizeId, selectedColor]
            );
        } else {
            // Si el ítem no existe, inserta una nueva entrada.
            finalQuantity = quantityToAdd;
            if (finalQuantity > availableStock) {
                finalQuantity = availableStock;
                message = 'Se añadió la cantidad máxima disponible para este producto. (Stock limitado)';
            } else {
                message = 'Producto añadido al carrito.';
            }

            await connection.query(
                'INSERT INTO detalles_carrito (Id_Carrito, Id_Producto, Cantidad, Precio_Unitario_Al_Momento, Id_Talla, Color_Seleccionado, Fecha_Adicion) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                [cartId, productId, finalQuantity, priceAtAddition, selectedSizeId, selectedColor]
            );
        }

        await connection.commit();
        return { success: true, message: message, newQuantity: finalQuantity };

    } catch (error) {
        // En caso de error, revierte la transacción.
        if (connection) await connection.rollback();
        console.error('Error al añadir o actualizar ítem en el carrito:', error);
        if (error.message.includes('Producto no encontrado') || error.message.includes('agotada')) {
            throw error;
        }
        throw new Error('Error interno al procesar el ítem del carrito.');
    } finally {
        // Libera la conexión a la base de datos.
        if (connection) connection.release();
    }
}

/**
 * Actualiza la cantidad de un producto específico en el carrito, identificado por talla y color, y verifica el stock.
 * @param {number} userId - El ID del usuario.
 * @param {number} productId - El ID del producto.
 * @param {number} selectedSizeId - El ID de la talla seleccionada.
 * @param {string} selectedColor - El nombre del color seleccionado.
 * @param {number} newQuantity - La nueva cantidad deseada.
 * @returns {Promise<object>} Un objeto indicando el éxito y el mensaje.
 */
async function updateCartItemQuantity(userId, productId, selectedSizeId, selectedColor, newQuantity) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Obtiene el ID del carrito para el usuario.
        const [cartResult] = await connection.query(`SELECT Id_Carrito FROM carrito WHERE Id_Usuario = ?`, [userId]);
        if (cartResult.length === 0) {
            await connection.rollback();
            return { success: false, message: 'Carrito no encontrado para el usuario.' };
        }
        const cartId = cartResult[0].Id_Carrito;

        // Si la nueva cantidad es 0 o menos, elimina el ítem del carrito.
        if (newQuantity <= 0) {
            const [deleteResult] = await connection.query(
                'DELETE FROM detalles_carrito WHERE Id_Carrito = ? AND Id_Producto = ? AND Id_Talla = ? AND Color_Seleccionado = ?',
                [cartId, productId, selectedSizeId, selectedColor]
            );
            await connection.commit();
            return { success: deleteResult.affectedRows > 0, message: deleteResult.affectedRows > 0 ? 'Producto eliminado del carrito.' : 'Ítem no encontrado para eliminar.' };
        }

        // Obtiene el stock disponible para la combinación específica.
        const [stockResult] = await connection.query(
            `SELECT Cantidad_Disponible
             FROM producto_tallas
             WHERE Id_Producto = ? AND Id_Tallas = ? AND Color_Variante = ?`,
            [productId, selectedSizeId, selectedColor]
        );

        if (stockResult.length === 0 || stockResult[0].Cantidad_Disponible === 0) {
            await connection.rollback();
            return { success: false, message: 'La combinación de producto, talla y color no existe o está agotada en el inventario.' };
        }
        const availableStock = stockResult[0].Cantidad_Disponible;

        let finalQuantity = newQuantity;
        let message = 'Cantidad del producto en el carrito actualizada exitosamente.';

        // Limita la cantidad si excede el stock disponible.
        if (newQuantity > availableStock) {
            finalQuantity = availableStock;
            message = 'Se actualizó la cantidad a la máxima disponible debido a limitaciones de stock.';
        }

        // Actualiza la cantidad del ítem en el carrito.
        const [result] = await connection.query(
            'UPDATE detalles_carrito SET Cantidad = ?, Fecha_Actualizacion = NOW() WHERE Id_Carrito = ? AND Id_Producto = ? AND Id_Talla = ? AND Color_Seleccionado = ?',
            [finalQuantity, cartId, productId, selectedSizeId, selectedColor]
        );

        await connection.commit();
        return { success: result.affectedRows > 0, message: message, newQuantity: finalQuantity };

    } catch (error) {
        // En caso de error, revierte la transacción.
        if (connection) await connection.rollback();
        console.error('Error al actualizar cantidad del ítem en el carrito:', error);
        throw new Error('Error interno del servidor al actualizar el ítem del carrito.');
    } finally {
        // Libera la conexión a la base de datos.
        if (connection) connection.release();
    }
}

/**
 * Elimina un producto específico del carrito, identificado por talla y color.
 * @param {number} userId - El ID del usuario.
 * @param {number} productId - El ID del producto a eliminar.
 * @param {number} selectedSizeId - El ID de la talla seleccionada.
 * @param {string} selectedColor - El nombre del color seleccionado.
 * @returns {Promise<boolean>} True si la operación fue exitosa.
 */
async function removeCartItem(userId, productId, selectedSizeId, selectedColor) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Obtiene el ID del carrito para el usuario.
        const [cartResult] = await connection.query(`SELECT Id_Carrito FROM carrito WHERE Id_Usuario = ?`, [userId]);
        if (cartResult.length === 0) {
            await connection.rollback();
            return false;
        }
        const cartId = cartResult[0].Id_Carrito;

        // Elimina el ítem del carrito.
        const [result] = await connection.query(
            'DELETE FROM detalles_carrito WHERE Id_Carrito = ? AND Id_Producto = ? AND Id_Talla = ? AND Color_Seleccionado = ?',
            [cartId, productId, selectedSizeId, selectedColor]
        );
        await connection.commit();
        return result.affectedRows > 0;
    } catch (error) {
        // En caso de error, revierte la transacción.
        if (connection) await connection.rollback();
        console.error('Error al eliminar ítem del carrito:', error);
        throw new Error('Error interno del servidor al eliminar el ítem del carrito.');
    } finally {
        // Libera la conexión a la base de datos.
        if (connection) connection.release();
    }
}

/**
 * Vacía completamente el carrito (elimina todos los ítems).
 * @param {number} userId - El ID del usuario.
 * @returns {Promise<boolean>} True si la operación fue exitosa.
 */
async function clearCart(userId) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Obtiene el ID del carrito para el usuario.
        const [cartResult] = await connection.query(`SELECT Id_Carrito FROM carrito WHERE Id_Usuario = ?`, [userId]);
        if (cartResult.length === 0) {
            await connection.rollback();
            return false;
        }
        const cartId = cartResult[0].Id_Carrito;

        // Elimina todos los ítems del carrito.
        const [result] = await connection.query('DELETE FROM detalles_carrito WHERE Id_Carrito = ?', [cartId]);
        await connection.commit();
        return result.affectedRows > 0;
    } catch (error) {
        // En caso de error, revierte la transacción.
        if (connection) await connection.rollback();
        console.error('Error al vaciar el carrito:', error);
        throw new Error('Error interno del servidor al vaciar el carrito.');
    } finally {
        // Libera la conexión a la base de datos.
        if (connection) connection.release();
    }
}

module.exports = {
    getOrCreateCart,
    getCartDetails,
    addOrUpdateCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
};