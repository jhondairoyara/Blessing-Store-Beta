// blessing-store-beta/backend/src/db.js

require('dotenv').config(); // Carga variables de entorno

const mysql = require('mysql2/promise'); // Importa el cliente MySQL con promesas

// Configuración del pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba la conexión a la base de datos
async function testDbConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa a la base de datos MySQL!');
        connection.release(); // Libera la conexión
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
        process.exit(1); // Sale del proceso si falla la conexión crítica
    }
}

testDbConnection(); // Ejecuta la prueba al cargar el módulo

module.exports = pool; // Exporta el pool de conexiones