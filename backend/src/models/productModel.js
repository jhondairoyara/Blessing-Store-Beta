// backend/src/models/productModel.js

const db = require('../db'); // Importa el pool de conexiones de la base de datos

/**
 * Obtiene todas las imágenes asociadas a un producto dado su ID.
 * @param {number} productId - El ID del producto.
 * @returns {Promise<Array<object>>} Un arreglo de objetos de imagen formateados.
 */
async function getProductImages(productId) {
    try {
        const [images] = await db.query(
            `SELECT
                Id_Imagen AS id,
                Nombre_Archivo AS nombre_archivo,
                Color_Asociado AS color_asociado,
                Orden AS orden
              FROM
                producto_imagenes
              WHERE
                Id_Producto = ?
              ORDER BY Orden ASC`,
            [productId]
        );
        return images;
    } catch (error) {
        console.error(`Error al obtener imágenes para el producto ${productId}:`, error);
        throw error;
    }
}

/**
 * Obtiene todos los productos, con opciones de búsqueda por término y filtrado por categoría.
 * Incluye detalles de categoría, imágenes y variantes de stock (talla, color, cantidad).
 * @param {string | null} searchTerm - Término de búsqueda para nombre o descripción del producto.
 * @param {number | null} categoryId - ID de la categoría para filtrar productos.
 * @returns {Promise<Array<object>>} Un arreglo de objetos de producto formateados con sus detalles.
 */
async function getAllProducts(searchTerm = null, categoryId = null) {
    try {
        let query = `
            SELECT
                p.Id_Producto,
                p.Nombre_Producto,
                p.Descripcion,
                p.Precio_Unitario,
                p.Porcentaje_Descuento,
                p.Caracteristicas_Principales,
                p.Id_Categoria,
                c.Nombre_Cat AS Nombre_Categoria,
                GROUP_CONCAT(
                    DISTINCT CONCAT_WS(':', t.Nombres_Talla, pt.Color_Variante, pt.Cantidad_Disponible, t.Id_Tallas)
                    ORDER BY t.Nombres_Talla ASC, pt.Color_Variante ASC
                ) AS Stock_Variantes
            FROM producto p
            JOIN categoria c ON p.Id_Categoria = c.Id_Categoria
            LEFT JOIN producto_tallas pt ON p.Id_Producto = pt.Id_Producto
            LEFT JOIN tallas t ON pt.Id_Tallas = t.Id_Tallas
        `;
        let params = [];
        let whereClauses = [];

        if (searchTerm) {
            whereClauses.push('(p.Nombre_Producto LIKE ? OR p.Descripcion LIKE ?)');
            const likeTerm = `%${searchTerm}%`;
            params.push(likeTerm, likeTerm);
        }

        if (categoryId) {
            whereClauses.push('p.Id_Categoria = ?');
            params.push(categoryId);
        }

        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }

        query += `
            GROUP BY
                p.Id_Producto, p.Nombre_Producto, p.Descripcion, p.Precio_Unitario, p.Porcentaje_Descuento,
                p.Caracteristicas_Principales, p.Id_Categoria, Nombre_Categoria
            ORDER BY p.Id_Producto ASC;
        `;

        const [rows] = await db.query(query, params);

        const productsWithDetails = await Promise.all(rows.map(async product => {
            const processedProduct = {
                id: product.Id_Producto,
                nombre: product.Nombre_Producto,
                descripcion: product.Descripcion,
                precio: parseFloat(product.Precio_Unitario),
                descuento_porcentaje: parseFloat(product.Porcentaje_Descuento || 0),
                caracteristicas_principales: product.Caracteristicas_Principales,
                categoria: {
                    id: product.Id_Categoria,
                    nombre: product.Nombre_Categoria
                },
                imagenes: await getProductImages(product.Id_Producto),
                variantes: []
            };

            if (product.Stock_Variantes) {
                const variantsMap = new Map();
                product.Stock_Variantes.split(',').forEach(variantStr => {
                    const [talla, color, cantidad, idTalla] = variantStr.split(':');
                    if (talla && color && cantidad !== undefined && idTalla !== undefined) {
                        const key = `${talla}-${color}`;
                        if (!variantsMap.has(key)) {
                            variantsMap.set(key, {
                                talla: talla,
                                color: color,
                                stock: parseInt(cantidad, 10),
                                Id_Talla: parseInt(idTalla, 10)
                            });
                        }
                    }
                });
                processedProduct.variantes = Array.from(variantsMap.values());
            }
            delete product.Stock_Variantes;
            
            return processedProduct;
        }));

        return productsWithDetails;

    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        throw error;
    }
}

/**
 * Obtiene un producto específico por su ID.
 * Incluye detalles de categoría, imágenes y variantes de stock (talla, color, cantidad).
 * @param {number} id - El ID del producto a buscar.
 * @returns {Promise<object|null>} El objeto del producto formateado si se encuentra, de lo contrario, null.
 */
async function getProductById(id) {
    try {
        const [rows] = await db.query(`
            SELECT
                p.Id_Producto,
                p.Nombre_Producto,
                p.Descripcion,
                p.Precio_Unitario,
                p.Porcentaje_Descuento,
                p.Caracteristicas_Principales,
                p.Id_Categoria,
                c.Nombre_Cat AS Nombre_Categoria,
                GROUP_CONCAT(
                    DISTINCT CONCAT_WS(':', t.Nombres_Talla, pt.Color_Variante, pt.Cantidad_Disponible, t.Id_Tallas)
                    ORDER BY t.Nombres_Talla ASC, pt.Color_Variante ASC
                ) AS Stock_Variantes
            FROM producto p
            JOIN categoria c ON p.Id_Categoria = c.Id_Categoria
            LEFT JOIN producto_tallas pt ON p.Id_Producto = pt.Id_Producto
            LEFT JOIN tallas t ON pt.Id_Tallas = t.Id_Tallas
            WHERE p.Id_Producto = ?
            GROUP BY
                p.Id_Producto, p.Nombre_Producto, p.Descripcion, p.Precio_Unitario, p.Porcentaje_Descuento,
                p.Caracteristicas_Principales, p.Id_Categoria, Nombre_Categoria
        `, [id]);

        if (rows.length === 0) {
            return null;
        }

        const product = rows[0];
        const processedProduct = {
            id: product.Id_Producto,
            nombre: product.Nombre_Producto,
            descripcion: product.Descripcion,
            precio: parseFloat(product.Precio_Unitario),
            descuento_porcentaje: parseFloat(product.Porcentaje_Descuento || 0),
            caracteristicas_principales: product.Caracteristicas_Principales,
            categoria: {
                id: product.Id_Categoria,
                nombre: product.Nombre_Categoria
            },
            imagenes: await getProductImages(product.Id_Producto),
            variantes: []
        };

        if (product.Stock_Variantes) {
            const variantsMap = new Map();
            product.Stock_Variantes.split(',').forEach(variantStr => {
                const [talla, color, cantidad, idTalla] = variantStr.split(':');
                if (talla && color && cantidad !== undefined && idTalla !== undefined) {
                    const key = `${talla}-${color}`;
                    if (!variantsMap.has(key)) {
                        variantsMap.set(key, {
                            talla: talla,
                            color: color,
                            stock: parseInt(cantidad, 10),
                            Id_Talla: parseInt(idTalla, 10)
                        });
                    }
                }
            });
            processedProduct.variantes = Array.from(variantsMap.values());
        }
        delete product.Stock_Variantes;

        return processedProduct;

    } catch (error) {
        console.error(`Error al obtener el producto con ID ${id}:`, error);
        throw error;
    }
}

/**
 * Crea un nuevo producto en la base de datos, incluyendo sus imágenes y variantes de stock.
 * @param {object} productData - Objeto con los datos del producto (nombre_producto, descripcion, precio_unitario, etc.).
 * @returns {Promise<object>} El objeto del producto creado con su nuevo ID.
 */
async function createProduct(productData) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Inserta en la tabla 'producto'.
        const [productResult] = await connection.query(
            'INSERT INTO producto (Nombre_Producto, Descripcion, Precio_Unitario, Porcentaje_Descuento, Caracteristicas_Principales, Id_Categoria) VALUES (?, ?, ?, ?, ?, ?)',
            [productData.nombre_producto, productData.descripcion, productData.precio_unitario, productData.porcentaje_descuento, productData.caracteristicas_principales, productData.id_categoria]
        );
        const productId = productResult.insertId;

        // Inserta imágenes del producto si existen.
        if (productData.imagenes && productData.imagenes.length > 0) {
            const imageValues = productData.imagenes.map((img, index) => [
                productId,
                img.nombre_archivo,
                img.color_asociado || null,
                img.orden !== undefined ? img.orden : (index + 1)
            ]);
            await connection.query(
                'INSERT INTO producto_imagenes (Id_Producto, Nombre_Archivo, Color_Asociado, Orden) VALUES ?',
                [imageValues]
            );
        }

        // Inserta variantes de stock (talla, color, cantidad) si existen.
        if (productData.variantes_stock && productData.variantes_stock.length > 0) {
            const variantValues = productData.variantes_stock.map(variant => [
                productId,
                variant.id_talla,
                variant.color_variante,
                variant.cantidad_disponible
            ]);
            await connection.query(
                'INSERT INTO producto_tallas (Id_Producto, Id_Tallas, Color_Variante, Cantidad_Disponible) VALUES ?',
                [variantValues]
            );
        }

        await connection.commit();
        return { id: productId, ...productData };

    } catch (error) {
        await connection.rollback();
        console.error('Error al crear producto:', error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Actualiza un producto existente en la base de datos, incluyendo sus imágenes y variantes de stock.
 * @param {number} id - El ID del producto a actualizar.
 * @param {object} productData - Objeto con los datos del producto a actualizar.
 * @returns {Promise<boolean>} True si el producto fue actualizado, false de lo contrario.
 */
async function updateProduct(id, productData) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Actualiza la tabla 'producto'.
        const [productResult] = await connection.query(
            'UPDATE producto SET Nombre_Producto = ?, Descripcion = ?, Precio_Unitario = ?, Porcentaje_Descuento = ?, Caracteristicas_Principales = ?, Id_Categoria = ? WHERE Id_Producto = ?',
            [productData.nombre_producto, productData.descripcion, productData.precio_unitario, productData.porcentaje_descuento, productData.caracteristicas_principales, productData.id_categoria, id]
        );

        // Maneja imágenes: Elimina las antiguas e inserta las nuevas.
        await connection.query('DELETE FROM producto_imagenes WHERE Id_Producto = ?', [id]);
        if (productData.imagenes && productData.imagenes.length > 0) {
            const imageValues = productData.imagenes.map((img, index) => [
                id,
                img.nombre_archivo,
                img.color_asociado || null,
                img.orden !== undefined ? img.orden : (index + 1)
            ]);
            await connection.query(
                'INSERT INTO producto_imagenes (Id_Producto, Nombre_Archivo, Color_Asociado, Orden) VALUES ?',
                [imageValues]
            );
        }

        // Maneja variantes de stock: Elimina las antiguas e inserta las nuevas.
        await connection.query('DELETE FROM producto_tallas WHERE Id_Producto = ?', [id]);
        if (productData.variantes_stock && productData.variantes_stock.length > 0) {
            const variantValues = productData.variantes_stock.map(variant => [
                id,
                variant.id_talla,
                variant.color_variante,
                variant.cantidad_disponible
            ]);
            await connection.query(
                'INSERT INTO producto_tallas (Id_Producto, Id_Tallas, Color_Variante, Cantidad_Disponible) VALUES ?',
                [variantValues]
            );
        }

        await connection.commit();
        return productResult.affectedRows > 0;

    } catch (error) {
        await connection.rollback();
        console.error(`Error al actualizar producto con ID ${id}:`, error);
        throw error;
    } finally {
        connection.release();
    }
}

/**
 * Elimina un producto existente de la base de datos, incluyendo sus imágenes y variantes de stock.
 * @param {number} id - El ID del producto a eliminar.
 * @returns {Promise<boolean>} True si el producto fue eliminado, false de lo contrario.
 */
async function deleteProduct(id) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Elimina registros asociados en tablas relacionadas para evitar errores de clave foránea.
        await connection.query('DELETE FROM producto_imagenes WHERE Id_Producto = ?', [id]);
        await connection.query('DELETE FROM producto_tallas WHERE Id_Producto = ?', [id]);

        // Elimina el producto de la tabla principal.
        const [result] = await connection.query('DELETE FROM producto WHERE Id_Producto = ?', [id]);

        await connection.commit();
        return result.affectedRows > 0;

    } catch (error) {
        await connection.rollback();
        console.error(`Error al eliminar producto con ID ${id}:`, error);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};