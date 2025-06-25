// backend/src/models/userModel.js

const db = require('../db');
const bcrypt = require('bcryptjs');

// Funciones de Creación
async function createUser(userData, accountData, rol = 'cliente') {
    // Crea un nuevo usuario y su cuenta asociada en una transacción
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [userResult] = await connection.query(
            'INSERT INTO usuario (Nombres, Apellidos, Telefono, Direccion, Id_Ciudad, Fecha_Nacimiento, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userData.nombres, userData.apellidos, userData.telefono, userData.direccion, userData.id_ciudad, userData.fecha_nacimiento, rol]
        );
        const userId = userResult.insertId;
        const hashedPassword = await bcrypt.hash(accountData.contrasena, 10);
        await connection.query(
            'INSERT INTO cuenta (Id_Usuario, Correo_Electronico, Contraseña, Fecha_Registro) VALUES (?, ?, ?, NOW())',
            [userId, accountData.correo_electronico, hashedPassword]
        );
        await connection.commit();
        return { id: userId, correo: accountData.correo_electronico, rol: rol };
    } catch (error) {
        await connection.rollback();
        console.error('Error al crear usuario y cuenta:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Funciones de Consulta (Lectura)
async function findUserByEmail(email) {
    // Busca un usuario por su correo electrónico, incluyendo detalles de ubicación
    try {
        const [rows] = await db.query(
            `SELECT
                u.Id_Usuario, u.Nombres, u.Apellidos, u.Telefono, u.Direccion, u.Id_Ciudad,
                c_tbl.Nom_Ciudad AS Nombre_Ciudad, d_tbl.Id_Departamento, d_tbl.Nom_Departamento AS Nombre_Departamento,
                u.Fecha_Nacimiento, u.rol, acct.Id_Cuenta, acct.Correo_Electronico, acct.Contraseña AS HashedPassword, acct.Fecha_Registro
             FROM cuenta acct
             JOIN usuario u ON acct.Id_Usuario = u.Id_Usuario
             LEFT JOIN ciudad c_tbl ON u.Id_Ciudad = c_tbl.Id_Ciudad
             LEFT JOIN departamento d_tbl ON c_tbl.Id_Departamento = d_tbl.Id_Departamento
             WHERE acct.Correo_Electronico = ?`,
            [email]
        );
        return rows[0];
    } catch (error) {
        console.error('Error al buscar usuario por correo:', error);
        throw error;
    }
}

async function findUserById(id) {
    // Busca un usuario por su ID, incluyendo detalles de ubicación
    try {
        const [rows] = await db.query(
            `SELECT
                u.Id_Usuario, u.Nombres, u.Apellidos, u.Telefono, u.Direccion, u.Id_Ciudad,
                c_tbl.Nom_Ciudad AS Nombre_Ciudad, d_tbl.Id_Departamento, d_tbl.Nom_Departamento AS Nombre_Departamento,
                u.Fecha_Nacimiento, u.rol, acct.Id_Cuenta, acct.Correo_Electronico, acct.Contraseña AS HashedPassword, acct.Fecha_Registro
             FROM cuenta acct
             JOIN usuario u ON acct.Id_Usuario = u.Id_Usuario
             LEFT JOIN ciudad c_tbl ON u.Id_Ciudad = c_tbl.Id_Ciudad
             LEFT JOIN departamento d_tbl ON c_tbl.Id_Departamento = d_tbl.Id_Departamento
             WHERE u.Id_Usuario = ?`,
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error(`Error al buscar usuario por ID ${id}:`, error);
        throw error;
    }
}

// Funciones de Actualización
async function updateUserProfile(userId, userData, accountData) {
    // Actualiza la información de perfil del usuario y su correo electrónico en una transacción
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        const updateUserFields = [];
        const updateUserValues = [];

        if (userData.Nombres !== undefined) { updateUserFields.push('Nombres = ?'); updateUserValues.push(userData.Nombres); }
        if (userData.Apellidos !== undefined) { updateUserFields.push('Apellidos = ?'); updateUserValues.push(userData.Apellidos); }
        if (userData.Telefono !== undefined) { updateUserFields.push('Telefono = ?'); updateUserValues.push(userData.Telefono); }
        if (userData.Direccion !== undefined) { updateUserFields.push('Direccion = ?'); updateUserValues.push(userData.Direccion); }
        if (userData.Id_Ciudad !== undefined) { updateUserFields.push('Id_Ciudad = ?'); updateUserValues.push(userData.Id_Ciudad); }
        if (userData.Fecha_Nacimiento !== undefined) { updateUserFields.push('Fecha_Nacimiento = ?'); updateUserValues.push(userData.Fecha_Nacimiento); }

        if (updateUserFields.length > 0) {
            const userUpdateQuery = `UPDATE usuario SET ${updateUserFields.join(', ')} WHERE Id_Usuario = ?`;
            await connection.query(userUpdateQuery, [...updateUserValues, userId]);
        }

        if (accountData.Correo_Electronico !== undefined) {
            const [existingEmail] = await connection.query(
                'SELECT Id_Usuario FROM cuenta WHERE Correo_Electronico = ? AND Id_Usuario != ?',
                [accountData.Correo_Electronico, userId]
            );
            if (existingEmail.length > 0) {
                await connection.rollback();
                const error = new Error('El correo electrónico ya está registrado por otro usuario.');
                error.code = 'EMAIL_DUPLICATE';
                throw error;
            }
            await connection.query(
                'UPDATE cuenta SET Correo_Electronico = ? WHERE Id_Usuario = ?',
                [accountData.Correo_Electronico, userId]
            );
        }
        await connection.commit();
        return true; // Indica éxito
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error al actualizar el perfil del usuario:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

async function updateUserPassword(userId, newPassword) {
    // Actualiza la contraseña de un usuario
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await db.query(
            'UPDATE cuenta SET Contraseña = ? WHERE Id_Usuario = ?',
            [hashedPassword, userId]
        );
        return result.affectedRows > 0;
    } catch (error) {
        console.error(`Error al actualizar contraseña para usuario con ID ${userId}:`, error);
        throw error;
    }
}

// Exportación de Funciones
module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserProfile,
    updateUserPassword
};