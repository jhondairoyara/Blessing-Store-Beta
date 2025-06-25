// backend/src/controllers/userController.js

const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Esquema de validación para los datos del perfil de usuario. :)
const userProfileSchema = Joi.object({
    Nombres: Joi.string()
        .pattern(/^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ-]+$/)
        .min(2).max(50).trim()
        .optional()
        .messages({
            'string.pattern.base': 'El campo Nombres solo puede contener letras, espacios y guiones.',
            'string.min': 'El campo Nombres debe tener al menos {#limit} caracteres.',
            'string.max': 'El campo Nombres no debe exceder los {#limit} caracteres.'
        }),
    Apellidos: Joi.string()
        .pattern(/^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ-]+$/)
        .min(2).max(50).trim()
        .optional()
        .allow('')
        .messages({
            'string.pattern.base': 'El campo Apellidos solo puede contener letras, espacios y guiones.',
            'string.min': 'El campo Apellidos debe tener al menos {#limit} caracteres.',
            'string.max': 'El campo Apellidos no debe exceder los {#limit} caracteres.'
        }),
    Telefono: Joi.string()
        .pattern(/^[0-9]+$/)
        .max(10)
        .optional()
        .allow('')
        .messages({
            'string.pattern.base': 'El campo Teléfono solo puede contener números.',
            'string.max': 'El campo Teléfono no debe exceder los {#limit} dígitos.'
        }),
    Direccion: Joi.string().max(255).trim().optional().allow(''),
    Id_Ciudad: Joi.number().integer().min(1).optional().allow(null),
    Fecha_Nacimiento: Joi.date().iso().optional().allow(null),
    Correo_Electronico: Joi.string().email().max(255).trim().optional()
        .messages({
            'string.email': 'El campo Correo Electrónico debe ser una dirección de correo válida.'
        })
}).min(1);

// Obtiene los datos del perfil de un usuario autenticado.
async function getUserProfile(req, res) {
    const userId = req.user.id;

    try {
        // Busca el usuario por ID, incluyendo información de ubicación.
        const user = await userModel.findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Excluye la contraseña hasheada de la respuesta.
        const { HashedPassword, ...userWithoutPassword } = user;
        
        // Formatea la fecha de nacimiento si existe.
        if (userWithoutPassword.Fecha_Nacimiento) {
            userWithoutPassword.Fecha_Nacimiento = new Date(userWithoutPassword.Fecha_Nacimiento).toISOString().split('T')[0];
        }

        res.json(userWithoutPassword);

    } catch (error) {
        // Maneja errores al obtener el perfil.
        console.error(`Error al obtener perfil de usuario ${userId}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al obtener perfil.' });
    }
}

// Actualiza los datos del perfil de un usuario.
async function updateProfile(req, res) {
    const userId = req.user.id;

    try {
        // Valida los datos del cuerpo de la solicitud con el esquema Joi.
        const { error, value } = userProfileSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Verifica si se proporcionaron datos para actualizar.
        if (Object.keys(value).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
        }

        // Prepara los datos para las tablas de usuario y cuenta.
        const userDataToUpdate = {};
        if (value.Nombres !== undefined) userDataToUpdate.Nombres = value.Nombres;
        if (value.Apellidos !== undefined) userDataToUpdate.Apellidos = value.Apellidos === '' ? null : value.Apellidos;
        if (value.Telefono !== undefined) userDataToUpdate.Telefono = value.Telefono === '' ? null : value.Telefono;
        if (value.Direccion !== undefined) userDataToUpdate.Direccion = value.Direccion === '' ? null : value.Direccion;
        if (value.Id_Ciudad !== undefined) userDataToUpdate.Id_Ciudad = value.Id_Ciudad;
        if (value.Fecha_Nacimiento !== undefined) userDataToUpdate.Fecha_Nacimiento = value.Fecha_Nacimiento; 

        const accountDataToUpdate = {};
        if (value.Correo_Electronico !== undefined) accountDataToUpdate.Correo_Electronico = value.Correo_Electronico;
        
        // Llama al modelo para actualizar el perfil.
        const success = await userModel.updateUserProfile(userId, userDataToUpdate, accountDataToUpdate);

        // Responde si la actualización no fue exitosa.
        if (!success) {
            return res.status(500).json({ message: 'No se pudo actualizar el perfil.' });
        }

        // Recupera el perfil completo y actualizado.
        const updatedUser = await userModel.findUserById(userId);

        // Responde si no se pudo recuperar el perfil actualizado.
        if (!updatedUser) {
            return res.status(500).json({ message: 'Perfil actualizado, pero no se pudo recuperar el perfil completo.' });
        }
        
        // Excluye la contraseña hasheada y formatea la fecha.
        const { HashedPassword, ...userWithoutPassword } = updatedUser;
        if (userWithoutPassword.Fecha_Nacimiento) {
            userWithoutPassword.Fecha_Nacimiento = new Date(userWithoutPassword.Fecha_Nacimiento).toISOString().split('T')[0];
        }

        // Envía el perfil actualizado.
        res.status(200).json({
            message: 'Perfil actualizado exitosamente.',
            user: userWithoutPassword
        });

    } catch (error) {
        // Maneja errores durante la actualización del perfil, incluyendo duplicidad de correo.
        console.error(`Error al actualizar perfil de usuario ${userId}:`, error);
        if (error.code === 'ER_DUP_ENTRY' || (error.sqlMessage && error.sqlMessage.includes('Duplicate entry')) || (error.message && error.message.includes('Duplicate entry'))) { 
            if (error.message.includes('Correo_Electronico') || (error.sqlMessage && error.sqlMessage.includes('Correo_Electronico'))) { 
                return res.status(409).json({ message: 'El correo electrónico ya está en uso por otro usuario.' });
            }
        }
        if (error.code === 'EMAIL_DUPLICATE') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor al actualizar perfil.' });
    }
}

// Actualiza la contraseña de un usuario.
async function changePassword(req, res) {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Esquema de validación para la nueva contraseña.
    const passwordSchema = Joi.string().min(8).required().messages({
        'string.min': 'La nueva contraseña debe tener al menos {#limit} caracteres.',
        'string.empty': 'La nueva contraseña no puede estar vacía.',
        'any.required': 'La nueva contraseña es obligatoria.'
    });

    // Valida la nueva contraseña.
    const { error: newPasswordError } = passwordSchema.validate(newPassword);
    if (newPasswordError) {
        return res.status(400).json({ message: newPasswordError.details[0].message });
    }

    // Valida la presencia de ambas contraseñas.
    if (!currentPassword || !newPassword) { 
        return res.status(400).json({ message: 'La contraseña actual y la nueva son obligatorias.' });
    }

    try {
        // Busca el usuario para verificar la contraseña actual.
        const user = await userModel.findUserById(userId); 
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Compara la contraseña actual.
        const isMatch = await bcrypt.compare(currentPassword, user.HashedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
        }

        // Actualiza la contraseña en la base de datos.
        await userModel.updateUserPassword(userId, newPassword);
        res.json({ message: 'Contraseña actualizada exitosamente.' });

    } catch (error) {
        // Maneja errores al cambiar la contraseña.
        console.error(`Error al cambiar contraseña para usuario ${userId}:`, error);
        res.status(500).json({ message: 'Error interno del servidor al cambiar contraseña.' });
    }
}

module.exports = {
    getUserProfile,
    updateProfile,
    changePassword
};