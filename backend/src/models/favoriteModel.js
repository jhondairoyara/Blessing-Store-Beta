// backend/src/models/favoriteModel.js

const db = require('../db');

/**
 * Obtiene todos los productos favoritos de un usuario, incluyendo información detallada
 * del producto y la variante específica (talla y color) si aplica, junto con su stock.
 * @param {number} userId - El ID del usuario.
 * @returns {Promise<Array<object>>} Lista de productos favoritos formateados.
 */
async function getUserFavorites(userId) {
    try {
        const [favorites] = await db.query(`
            SELECT
                f.Id_Favorito,
                f.Id_Producto,
                f.Id_Talla,
                f.Color_Seleccionado,
                p.Nombre_Producto,
                p.Descripcion,
                p.Precio_Unitario,
                p.Porcentaje_Descuento,
                c.Nombre_Cat AS Categoria,
                -- Obtiene la imagen principal de la variante específica (por Color_Seleccionado) si existe,
                -- o la primera imagen general del producto.
                COALESCE(
                    (SELECT pi.Nombre_Archivo FROM producto_imagenes pi 
                     WHERE pi.Id_Producto = p.Id_Producto AND pi.Color_Asociado = f.Color_Seleccionado 
                     ORDER BY pi.Orden ASC LIMIT 1),
                    (SELECT pi.Nombre_Archivo FROM producto_imagenes pi 
                     WHERE pi.Id_Producto = p.Id_Producto AND pi.Color_Asociado IS NULL 
                     ORDER BY pi.Orden ASC LIMIT 1),
                    (SELECT pi.Nombre_Archivo FROM producto_imagenes pi 
                     WHERE pi.Id_Producto = p.Id_Producto ORDER BY pi.Orden ASC LIMIT 1)
                ) AS imagen_url,
                t.Nombres_Talla AS Nombre_Talla,
                -- Stock de la variante específica de talla/color desde 'producto_tallas'
                COALESCE(
                    pt.Cantidad_Disponible,
                    0
                ) AS stock
            FROM favoritos f
            JOIN producto p ON f.Id_Producto = p.Id_Producto
            LEFT JOIN categoria c ON p.Id_Categoria = c.Id_Categoria
            LEFT JOIN tallas t ON f.Id_Talla = t.Id_Tallas
            LEFT JOIN producto_tallas pt ON
                pt.Id_Producto = f.Id_Producto AND
                (pt.Id_Tallas = f.Id_Talla OR (pt.Id_Tallas IS NULL AND f.Id_Talla IS NULL)) AND
                (pt.Color_Variante = f.Color_Seleccionado OR (pt.Color_Variante IS NULL AND f.Color_Seleccionado IS NULL))
            WHERE f.Id_Usuario = ?
            ORDER BY f.Fecha_Agregado DESC
        `, [userId]);

        // Formatea los resultados para el frontend.
        return favorites.map(fav => {
            const precio_final = fav.Porcentaje_Descuento && fav.Porcentaje_Descuento > 0
                                 ? fav.Precio_Unitario * (1 - fav.Porcentaje_Descuento / 100)
                                 : fav.Precio_Unitario;
            
            return {
                Id_Favorito: fav.Id_Favorito,
                Id_Producto: fav.Id_Producto,
                Id_Talla: fav.Id_Talla,
                Color_Seleccionado: fav.Color_Seleccionado,
                nombre_producto: fav.Nombre_Producto,
                descripcion: fav.Descripcion,
                precio_unitario: parseFloat(precio_final),
                imagen_url: fav.imagen_url ? `uploads/${fav.imagen_url}` : null,
                stock: parseInt(fav.stock) || 0,
                Nombre_Talla: fav.Nombre_Talla
            };
        });

    } catch (error) {
        // Maneja errores al obtener favoritos.
        console.error(`Error al obtener favoritos para el usuario ${userId}:`, error);
        throw error;
    }
}

/**
 * Añade un producto/variante a la lista de favoritos de un usuario.
 * @param {number} userId - El ID del usuario.
 * @param {number} productId - El ID del producto.
 * @param {number | null} sizeId - El ID de la talla (null si no aplica).
 * @param {string | null} colorName - El nombre del color (null si no aplica).
 * @returns {Promise<object>} Objeto con el Id_Favorito insertado y un indicador de existencia.
 */
async function addFavorite(userId, productId, sizeId, colorName) {
    try {
        // Verifica si la combinación ya existe para evitar duplicados.
        const [existing] = await db.query(`
            SELECT Id_Favorito FROM favoritos 
            WHERE Id_Usuario = ? AND Id_Producto = ? 
            AND (Id_Talla = ? OR (Id_Talla IS NULL AND ? IS NULL))
            AND (Color_Seleccionado = ? OR (Color_Seleccionado IS NULL AND ? IS NULL))
        `, [userId, productId, sizeId, sizeId, colorName, colorName]);

        if (existing.length > 0) {
            // Si ya es favorito, no hace nada.
            console.log(`La variante de producto (Producto: ${productId}, Talla: ${sizeId}, Color: ${colorName}) ya es favorita para el usuario ${userId}.`);
            return { message: 'Ya es favorito', Id_Favorito: existing[0].Id_Favorito, exists: true };
        }

        // Inserta el nuevo favorito.
        const [result] = await db.query(
            'INSERT INTO favoritos (Id_Usuario, Id_Producto, Id_Talla, Color_Seleccionado, Fecha_Agregado) VALUES (?, ?, ?, ?, NOW())',
            [userId, productId, sizeId, colorName]
        );
        return { Id_Favorito: result.insertId, exists: false };
    } catch (error) {
        // Maneja errores al añadir favorito.
        console.error('Error al añadir favorito:', error);
        throw error;
    }
}

/**
 * Elimina un producto/variante de la lista de favoritos de un usuario.
 * @param {number} userId - El ID del usuario.
 * @param {number} productId - El ID del producto.
 * @param {number | null} sizeId - El ID de la talla (null si no aplica).
 * @param {string | null} colorName - El nombre del color (null si no aplica).
 * @returns {Promise<object>} Objeto con el número de filas afectadas.
 */
async function removeFavorite(userId, productId, sizeId, colorName) {
    try {
        // Elimina el favorito.
        const [result] = await db.query(`
            DELETE FROM favoritos 
            WHERE Id_Usuario = ? AND Id_Producto = ?
            AND (Id_Talla = ? OR (Id_Talla IS NULL AND ? IS NULL))
            AND (Color_Seleccionado = ? OR (Color_Seleccionado IS NULL AND ? IS NULL))
        `, [userId, productId, sizeId, sizeId, colorName, colorName]);
        return { affectedRows: result.affectedRows };
    } catch (error) {
        // Maneja errores al eliminar favorito.
        console.error('Error al eliminar favorito:', error);
        throw error;
    }
}

/**
 * Verifica si un producto/variante específico es favorito para un usuario.
 * @param {number} userId - El ID del usuario.
 * @param {number} productId - El ID del producto.
 * @param {number | null} sizeId - El ID de la talla (null si no aplica).
 * @param {string | null} colorName - El nombre del color (null si no aplica).
 * @returns {Promise<boolean>} True si es favorito, false en caso contrario.
 */
async function isFavorite(userId, productId, sizeId, colorName) {
    try {
        // Consulta para verificar la existencia del favorito.
        const [rows] = await db.query(`
            SELECT COUNT(*) AS count FROM favoritos 
            WHERE Id_Usuario = ? AND Id_Producto = ? 
            AND (Id_Talla = ? OR (Id_Talla IS NULL AND ? IS NULL))
            AND (Color_Seleccionado = ? OR (Color_Seleccionado IS NULL AND ? IS NULL))
        `, [userId, productId, sizeId, sizeId, colorName, colorName]);
        return rows[0].count > 0;
    } catch (error) {
        // Maneja errores al verificar favorito.
        console.error('Error al verificar favorito:', error);
        throw error;
    }
}

module.exports = {
    getUserFavorites,
    addFavorite,
    removeFavorite,
    isFavorite
};