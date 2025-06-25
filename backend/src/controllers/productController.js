// backend/src/controllers/productController.js

const productModel = require('../models/productModel');

// Obtiene todos los productos, con opciones de búsqueda y filtrado por categoría.
async function getProducts(req, res) {
    const searchTerm = req.query.search;
    const categoryId = req.query.category;

    try {
        // Obtiene productos del modelo aplicando filtros.
        const products = await productModel.getAllProducts(searchTerm, categoryId);
        res.json(products);
    } catch (error) {
        // Maneja errores al obtener productos.
        console.error('Error en el controlador getProducts:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener productos.' });
    }
}

// Obtiene un producto por su ID.
async function getProduct(req, res) {
    const productId = req.params.id;
    try {
        // Obtiene el producto desde el modelo.
        const product = await productModel.getProductById(productId);

        // Responde si el producto no es encontrado.
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.json(product);
    } catch (error) {
        // Maneja errores al obtener un producto.
        console.error(`Error en el controlador getProduct para ID ${productId}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el producto.' });
    }
}

// Crea un nuevo producto.
async function createProduct(req, res) {
    const {
        nombre_producto,
        descripcion,
        precio_unitario,
        porcentaje_descuento,
        caracteristicas_principales,
        id_categoria,
        imagenes,
        variantes_stock
    } = req.body;

    // Valida campos obligatorios.
    if (!nombre_producto || !precio_unitario || !id_categoria || !variantes_stock || variantes_stock.length === 0) {
        return res.status(400).json({ message: 'Nombre, precio unitario, categoría y al menos una variante de stock son campos obligatorios.' });
    }

    // Valida cada variante de stock.
    for (const variant of variantes_stock) {
        if (!variant.id_talla || !variant.color_variante || typeof variant.cantidad_disponible === 'undefined' || variant.cantidad_disponible < 0) {
            return res.status(400).json({ message: 'Cada variante debe tener id_talla, color_variante y cantidad_disponible (no negativa).' });
        }
    }

    try {
        // Crea el producto usando el modelo.
        const newProduct = await productModel.createProduct({
            nombre_producto,
            descripcion,
            precio_unitario,
            porcentaje_descuento,
            caracteristicas_principales,
            id_categoria,
            imagenes,
            variantes_stock
        });
        res.status(201).json({ message: 'Producto creado exitosamente.', product: newProduct });
    } catch (error) {
        // Maneja errores durante la creación del producto.
        console.error('Error en el controlador createProduct:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el producto.' });
    }
}

// Actualiza un producto existente.
async function updateProduct(req, res) {
    const productId = req.params.id;
    const {
        nombre_producto,
        descripcion,
        precio_unitario,
        porcentaje_descuento,
        caracteristicas_principales,
        id_categoria,
        imagenes,
        variantes_stock
    } = req.body;

    // Valida que se proporcione al menos un campo para actualizar.
    if (!nombre_producto && !descripcion && !precio_unitario && !porcentaje_descuento && !caracteristicas_principales && !id_categoria && (!imagenes || imagenes.length === 0) && (!variantes_stock || variantes_stock.length === 0)) {
        return res.status(400).json({ message: 'Se requiere al menos un campo para actualizar el producto (nombre, precio, categoría, imágenes o variantes de stock).' });
    }

    // Valida las variantes de stock si se proporcionan.
    if (variantes_stock && variantes_stock.length > 0) {
        for (const variant of variantes_stock) {
            if (!variant.id_talla || !variant.color_variante || typeof variant.cantidad_disponible === 'undefined' || variant.cantidad_disponible < 0) {
                return res.status(400).json({ message: 'Cada variante proporcionada para actualización debe tener id_talla, color_variante y cantidad_disponible (no negativa).' });
            }
        }
    }

    try {
        // Actualiza el producto usando el modelo.
        const updated = await productModel.updateProduct(productId, {
            nombre_producto,
            descripcion,
            precio_unitario,
            porcentaje_descuento,
            caracteristicas_principales,
            id_categoria,
            imagenes,
            variantes_stock
        });
        // Responde si el producto no es encontrado.
        if (!updated) {
            return res.status(404).json({ message: 'Producto no encontrado o no se realizaron cambios.' });
        }
        res.json({ message: 'Producto actualizado exitosamente.' });
    } catch (error) {
        // Maneja errores durante la actualización del producto.
        console.error(`Error en el controlador updateProduct para ID ${productId}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el producto.' });
    }
}

// Elimina un producto.
async function deleteProduct(req, res) {
    const productId = req.params.id;
    try {
        // Elimina el producto usando el modelo.
        const deleted = await productModel.deleteProduct(productId);
        // Responde si el producto no es encontrado.
        if (!deleted) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        // Maneja errores durante la eliminación del producto.
        console.error(`Error en el controlador deleteProduct para ID ${productId}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el producto.' });
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};