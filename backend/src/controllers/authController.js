// backend/src/controllers/authController.js

const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const db = require('../db');

// Clave secreta para JWT, se obtiene de las variables de entorno.
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'un_secreto_muy_seguro_y_largo_para_jwt_cambiame_en_env';

// Controlador para el inicio de sesión de usuarios.
exports.login = async (req, res) => {
    const { correo, password } = req.body;

    // Valida la presencia de credenciales.
    if (!correo || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    try {
        // Busca el usuario por correo electrónico.
        const [rows] = await db.query(
            `SELECT
                c.Id_Cuenta,
                c.Id_Usuario,
                c.Correo_Electronico,
                c.Contraseña,
                u.Nombres,
                u.Apellidos,
                u.rol AS RolUsuario
            FROM
                cuenta c
            JOIN
                usuario u ON c.Id_Usuario = u.Id_Usuario
            WHERE
                c.Correo_Electronico = ?`,
            [correo]
        );

        // Verifica si se encontró el usuario.
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const userAccount = rows[0];

        // Verifica la existencia de la contraseña en la base de datos.
        if (!userAccount.Contraseña) {
            console.error('Error: La contraseña del usuario no se encontró en la base de datos para el correo:', correo);
            return res.status(500).json({ message: 'Error interno del servidor: Contraseña de usuario no encontrada.' });
        }

        // Compara la contraseña proporcionada con el hash almacenado.
        const isMatch = await bcryptjs.compare(password, userAccount.Contraseña);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Genera un token JWT.
        const token = jwt.sign(
            {
                id: userAccount.Id_Usuario,
                correo: userAccount.Correo_Electronico,
                rol: userAccount.RolUsuario
            },
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Envía una respuesta exitosa con el token y los datos del usuario.
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            user: {
                id: userAccount.Id_Usuario,
                nombres: userAccount.Nombres,
                apellidos: userAccount.Apellidos,
                correo: userAccount.Correo_Electronico,
                rol: userAccount.RolUsuario
            }
        });

    } catch (error) {
        // Maneja errores durante el proceso de login.
        console.error('Error durante el proceso de login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Controlador para el registro de nuevos usuarios.
exports.register = async (req, res) => {
    const { nombres, apellidos, telefono, direccion, id_ciudad, fecha_nacimiento, correo, password } = req.body;

    const rol = 'cliente';

    // Valida la presencia de campos obligatorios para el registro.
    if (!nombres || !apellidos || !correo || !password) {
        return res.status(400).json({ message: 'Nombres, apellidos, correo y contraseña son obligatorios para el registro.' });
    }

    // Formatea la fecha de nacimiento si se proporciona.
    let formattedFechaNacimiento = null;
    if (fecha_nacimiento) {
        try {
            const date = new Date(fecha_nacimiento);
            if (!isNaN(date.getTime())) {
                formattedFechaNacimiento = date.toISOString().split('T')[0];
            } else {
                console.warn('Fecha de nacimiento inválida proporcionada:', fecha_nacimiento);
            }
        } catch (e) {
            console.error('Error al procesar fecha de nacimiento:', e);
        }
    }

    let connection;
    try {
        // Obtiene una conexión del pool y comienza una transacción.
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Verifica si el correo electrónico ya está registrado.
        const [existingAccounts] = await connection.query('SELECT Id_Cuenta FROM cuenta WHERE Correo_Electronico = ?', [correo]);
        if (existingAccounts.length > 0) {
            await connection.rollback();
            connection.release();
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Inserta el nuevo usuario en la tabla 'usuario'.
        const [userResult] = await connection.query(
            `INSERT INTO usuario (Nombres, Apellidos, Telefono, Direccion, Id_Ciudad, Fecha_Nacimiento, rol)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nombres,
                apellidos,
                telefono || null,
                direccion || null,
                (id_ciudad && id_ciudad !== '') ? parseInt(id_ciudad, 10) : null,
                formattedFechaNacimiento,
                rol
            ]
        );
        const newUserId = userResult.insertId;

        // Hashea la contraseña.
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Inserta la nueva cuenta en la tabla 'cuenta'.
        await connection.query(
            `INSERT INTO cuenta (Id_Usuario, Correo_Electronico, Contraseña, Fecha_Registro)
             VALUES (?, ?, ?, NOW())`,
            [newUserId, correo, hashedPassword]
        );

        // Confirma la transacción.
        await connection.commit();

        // Genera un token JWT para el nuevo usuario.
        const token = jwt.sign(
            { id: newUserId, correo: correo, rol: rol },
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Envía una respuesta exitosa con el token y los datos del nuevo usuario.
        res.status(201).json({
            message: 'Registro exitoso.',
            token,
            user: {
                id: newUserId,
                nombres,
                apellidos,
                correo,
                rol
            }
        });

    } catch (error) {
        // Maneja errores durante el registro.
        console.error('Error durante el registro:', error);
        // Intenta hacer rollback si hay una conexión activa.
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Error al intentar rollback durante el registro:', rollbackError);
            }
        }
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
    } finally {
        // Libera la conexión a la base de datos.
        if (connection) {
            connection.release();
        }
    }
};