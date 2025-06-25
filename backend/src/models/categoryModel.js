// backend/src/models/categoryModel.js

const db = require('../db');

/**
 * Obtiene todas las categorías de la base de datos.
 * @returns {Promise<Array>} Un arreglo de objetos de categoría.
 */
async function getAllCategories() {
    try {
        const [rows] = await db.query('SELECT Id_Categoria, Nombre_Cat FROM categoria ORDER BY Nombre_Cat ASC');
        return rows;
    } catch (error) {
        console.error('Error al obtener todas las categorías:', error);
        throw error;
    }
}

/**
 * Obtiene una categoría específica por su ID.
 * @param {number} id - El ID de la categoría a buscar.
 * @returns {Promise<object|undefined>} El objeto de la categoría si se encuentra, de lo contrario, undefined.
 */
async function getCategoryById(id) {
    try {
        const [rows] = await db.query('SELECT Id_Categoria, Nombre_Cat FROM categoria WHERE Id_Categoria = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error(`Error al obtener categoría con ID ${id}:`, error);
        throw error;
    }
}

/**
 * Crea una nueva categoría en la base de datos.
 * @param {string} name - El nombre de la nueva categoría.
 * @returns {Promise<object>} Un objeto con el ID insertado y el nombre de la categoría.
 */
async function createCategory(name) {
    try {
        const [result] = await db.query('INSERT INTO categoria (Nombre_Cat) VALUES (?)', [name]);
        return { id: result.insertId, name: name };
    } catch (error) {
        console.error('Error al crear categoría:', error);
        throw error;
    }
}

/**
 * Actualiza el nombre de una categoría existente.
 * @param {number} id - El ID de la categoría a actualizar.
 * @param {string} name - El nuevo nombre para la categoría.
 * @returns {Promise<boolean>} True si la categoría fue actualizada, false si no se encontró el ID.
 */
async function updateCategory(id, name) {
    try {
        const [result] = await db.query('UPDATE categoria SET Nombre_Cat = ? WHERE Id_Categoria = ?', [name, id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error al actualizar categoría con ID ${id}:`, error);
        throw error;
    }
}

/**
 * Elimina una categoría de la base de datos.
 * Considera las restricciones de clave foránea si hay productos que referencian esta categoría.
 * @param {number} id - El ID de la categoría a eliminar.
 * @returns {Promise<boolean>} True si la categoría fue eliminada, false si no se encontró el ID.
 */
async function deleteCategory(id) {
    try {
        const [result] = await db.query('DELETE FROM categoria WHERE Id_Categoria = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error al eliminar categoría con ID ${id}:`, error);
        throw error;
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};