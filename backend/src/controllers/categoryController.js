// backend/src/controllers/categoryController.js

const categoryModel = require('../models/categoryModel');

// Obtiene todas las categorías.
async function getAllCategories(req, res) {
    try {
        const categories = await categoryModel.getAllCategories();
        res.json(categories);
    } catch (error) {
        // Maneja errores al obtener categorías.
        console.error('Error en el controlador al obtener todas las categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener categorías.' });
    }
}

// Obtiene una categoría por su ID.
async function getCategoryById(req, res) {
    const { id } = req.params;
    try {
        const category = await categoryModel.getCategoryById(id);
        // Responde si la categoría no es encontrada.
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }
        res.json(category);
    } catch (error) {
        // Maneja errores al obtener categoría por ID.
        console.error(`Error en el controlador al obtener categoría con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la categoría.' });
    }
}

// Crea una nueva categoría.
async function createCategory(req, res) {
    const { nombre_cat } = req.body;

    // Valida la presencia del nombre de la categoría.
    if (!nombre_cat) {
        return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });
    }

    try {
        const newCategory = await categoryModel.createCategory(nombre_cat);
        res.status(201).json({ message: 'Categoría creada exitosamente.', category: newCategory });
    } catch (error) {
        // Maneja errores al crear categoría.
        console.error('Error en el controlador al crear categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la categoría.' });
    }
}

// Actualiza una categoría existente.
async function updateCategory(req, res) {
    const { id } = req.params;
    const { nombre_cat } = req.body;

    // Valida la presencia del nombre de la categoría.
    if (!nombre_cat) {
        return res.status(400).json({ message: 'El nombre de la categoría es obligatorio para actualizar.' });
    }

    try {
        const updated = await categoryModel.updateCategory(id, nombre_cat);
        // Responde si la categoría no es encontrada o no hubo cambios.
        if (!updated) {
            return res.status(404).json({ message: 'Categoría no encontrada o no se realizaron cambios.' });
        }
        res.json({ message: 'Categoría actualizada exitosamente.' });
    } catch (error) {
        // Maneja errores al actualizar categoría.
        console.error(`Error en el controlador al actualizar categoría con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la categoría.' });
    }
}

// Elimina una categoría.
async function deleteCategory(req, res) {
    const { id } = req.params;
    try {
        const deleted = await categoryModel.deleteCategory(id);
        // Responde si la categoría no es encontrada.
        if (!deleted) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }
        res.json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        // Maneja errores al eliminar categoría.
        console.error(`Error en el controlador al eliminar categoría con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la categoría.' });
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};