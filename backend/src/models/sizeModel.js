// backend/src/models/sizeModel.js

const db = require('../db');

// Funciones de Consulta (Lectura)
async function getAllSizes() {
    try {
        const [rows] = await db.query('SELECT Id_Tallas, Nombres_Talla FROM tallas ORDER BY Nombres_Talla ASC');
        return rows;
    } catch (error) {
        console.error('Error al obtener todas las tallas:', error);
        throw error;
    }
}

async function getSizeById(id) {
    try {
        const [rows] = await db.query('SELECT Id_Tallas, Nombres_Talla FROM tallas WHERE Id_Tallas = ?', [id]);
        return rows[0]; // Retorna la talla encontrada
    } catch (error) {
        console.error(`Error al obtener talla con ID ${id}:`, error);
        throw error;
    }
}

// Funciones de Escritura (Creación, Actualización, Eliminación)
async function createSize(name) {
    try {
        const [result] = await db.query('INSERT INTO tallas (Nombres_Talla) VALUES (?)', [name]);
        return { id: result.insertId, name: name }; // Retorna el ID y nombre de la nueva talla
    } catch (error) {
        console.error('Error al crear talla:', error);
        throw error;
    }
}

async function updateSize(id, name) {
    try {
        const [result] = await db.query('UPDATE tallas SET Nombres_Talla = ? WHERE Id_Tallas = ?', [name, id]);
        return result.affectedRows > 0; // Indica si se actualizó la talla
    } catch (error) {
        console.error(`Error al actualizar talla con ID ${id}:`, error);
        throw error;
    }
}

async function deleteSize(id) {
    try {
        const [result] = await db.query('DELETE FROM tallas WHERE Id_Tallas = ?', [id]);
        return result.affectedRows > 0; // Indica si se eliminó la talla
    } catch (error) {
        console.error(`Error al eliminar talla con ID ${id}:`, error);
        throw error;
    }
}

module.exports = {
    getAllSizes,
    getSizeById,
    createSize,
    updateSize,
    deleteSize
};