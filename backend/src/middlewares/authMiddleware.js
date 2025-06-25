// backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware para verificar el token JWT y adjuntar los datos del usuario.
async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    // Verifica si el encabezado de autorización está presente y tiene el formato correcto.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado o inválido.' });
    }

    // Extrae el token del encabezado.
    const token = authHeader.split(' ')[1];

    try {
        // Verifica el token usando la clave secreta.
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Adjunta información básica del usuario decodificada del token.
        req.user = {
            id: decoded.id,
            correo: decoded.correo,
            rol: decoded.rol
        };

        // Consulta la base de datos para obtener datos frescos y completos del usuario.
        const [userDbRows] = await db.query(
            `SELECT
                u.Id_Usuario,
                u.Nombres,
                u.Apellidos,
                u.rol,
                c.Correo_Electronico
            FROM
                usuario u
            JOIN
                cuenta c ON u.Id_Usuario = c.Id_Usuario
            WHERE
                u.Id_Usuario = ?`,
            [req.user.id]
        );

        // Verifica si el usuario asociado al token existe en la base de datos.
        if (userDbRows.length === 0) {
            return res.status(401).json({ message: 'Usuario asociado al token no encontrado en la base de datos.' });
        }

        const userFromDb = userDbRows[0];

        // Sobreescribe req.user con los datos frescos y completos obtenidos de la base de datos.
        req.user = {
            id: userFromDb.Id_Usuario,
            nombres: userFromDb.Nombres,
            apellidos: userFromDb.Apellidos,
            correo: userFromDb.Correo_Electronico,
            rol: userFromDb.rol
        };

        next(); // Pasa al siguiente middleware o ruta.

    } catch (error) {
        // Manejo específico de errores de JWT.
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado. Inicie sesión de nuevo.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido. Acceso denegado.' });
        }
        // Manejo de otros errores.
        console.error('Error al verificar token JWT:', error.message);
        if (error.sqlMessage) {
            console.error('SQL Error:', error.sqlMessage);
        }
        res.status(500).json({ message: 'Error interno del servidor al autenticar.' });
    }
}

// Middleware para autorizar peticiones basadas en los roles de usuario.
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Asegura que los datos del usuario y su rol estén disponibles.
        if (!req.user || !req.user.rol) {
            return res.status(403).json({ message: 'Acceso denegado. Rol de usuario no disponible.' });
        }

        // Verifica si el rol del usuario está incluido en los roles permitidos.
        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({ message: `Acceso denegado. Requiere rol(es): ${allowedRoles.join(', ')}.` });
        }

        next(); // Pasa al siguiente middleware o ruta.
    };
};

module.exports = {
    verifyToken,
    authorizeRoles
};