// backend/src/controllers/sizeController.js

const sizeModel = require('../models/sizeModel');

// Obtiene todas las tallas.
async function getAllSizes(req, res) {
    try {
        const sizes = await sizeModel.getAllSizes();
        res.json(sizes);
    } catch (error) {
        // Maneja errores al obtener tallas.
        console.error('Error en el controlador al obtener todas las tallas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener tallas.' });
    }
}

// Obtiene una talla por su ID.
async function getSizeById(req, res) {
    const { id } = req.params;
    try {
        const size = await sizeModel.getSizeById(id);
        // Responde si la talla no es encontrada.
        if (!size) {
            return res.status(404).json({ message: 'Talla no encontrada.' });
        }
        res.json(size);
    } catch (error) {
        // Maneja errores al obtener talla por ID.
        console.error(`Error en el controlador al obtener talla con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la talla.' });
    }
}

// Crea una nueva talla.
async function createSize(req, res) {
    const { nombres_talla } = req.body;

    // Valida la presencia del nombre de la talla.
    if (!nombres_talla) {
        return res.status(400).json({ message: 'El nombre de la talla es obligatorio.' });
    }

    try {
        const newSize = await sizeModel.createSize(nombres_talla);
        res.status(201).json({ message: 'Talla creada exitosamente.', size: newSize });
    } catch (error) {
        // Maneja errores al crear talla.
        console.error('Error en el controlador al crear talla:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la talla.' });
    }
}

// Actualiza una talla existente.
async function updateSize(req, res) {
    const { id } = req.params;
    const { nombres_talla } = req.body;

    // Valida la presencia del nombre de la talla.
    if (!nombres_talla) {
        return res.status(400).json({ message: 'El nombre de la talla es obligatorio para actualizar.' });
    }

    try {
        const updated = await sizeModel.updateSize(id, nombres_talla);
        // Responde si la talla no es encontrada o no hubo cambios.
        if (!updated) {
            return res.status(404).json({ message: 'Talla no encontrada o no se realizaron cambios.' });
        }
        res.json({ message: 'Talla actualizada exitosamente.' });
    } catch (error) {
        // Maneja errores al actualizar talla.
        console.error(`Error en el controlador al actualizar talla con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la talla.' });
    }
}

// Elimina una talla.
async function deleteSize(req, res) {
    const { id } = req.params;
    try {
        const deleted = await sizeModel.deleteSize(id);
        // Responde si la talla no es encontrada.
        if (!deleted) {
            return res.status(404).json({ message: 'Talla no encontrada.' });
        }
        res.json({ message: 'Talla eliminada exitosamente.' });
    } catch (error) {
        // Maneja errores al eliminar talla.
        console.error(`Error en el controlador al eliminar talla con ID ${id}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la talla.' });
    }
}

module.exports = {
    getAllSizes,
    getSizeById,
    createSize,
    updateSize,
    deleteSize
};