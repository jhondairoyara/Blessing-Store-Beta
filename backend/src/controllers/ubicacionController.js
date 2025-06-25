// backend/src/controllers/ubicacionController.js

const db = require('../db');

// Función auxiliar para el manejo de errores asíncronos.
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Obtiene todos los departamentos.
exports.getAllDepartamentos = catchAsync(async (req, res, next) => {
    // Consulta la base de datos para obtener departamentos.
    const [rows] = await db.query('SELECT Id_Departamento, Nom_Departamento FROM departamento ORDER BY Nom_Departamento ASC');

    // Mapea los resultados a un formato compatible con el frontend.
    const departamentos = rows.map(dep => ({
        id: dep.Id_Departamento,
        nombre: dep.Nom_Departamento
    }));

    // Responde con la lista de departamentos.
    res.status(200).json({
        success: true,
        count: departamentos.length,
        data: departamentos
    });
});

// Obtiene ciudades/municipios por ID de departamento.
exports.getMunicipiosByDepartamento = catchAsync(async (req, res, next) => {
    const { departamentoId } = req.query;

    // Valida la presencia del ID de departamento.
    if (!departamentoId) {
        return res.status(400).json({ success: false, error: 'Por favor, especifique el ID del departamento.' });
    }

    // Valida y parsea el ID del departamento.
    const idDep = parseInt(departamentoId, 10);
    if (isNaN(idDep) || idDep <= 0) {
        return res.status(400).json({ success: false, error: 'El ID del departamento debe ser un número válido.' });
    }

    // Consulta la base de datos para obtener ciudades por departamento.
    const [ciudadRows] = await db.query('SELECT Id_Ciudad, Nom_Ciudad FROM ciudad WHERE Id_Departamento = ? ORDER BY Nom_Ciudad ASC', [idDep]);

    // Mapea los resultados a un formato compatible con el frontend.
    const ciudades = ciudadRows.map(ciu => ({
        id: ciu.Id_Ciudad,
        nombre: ciu.Nom_Ciudad
    }));

    // Responde con la lista de ciudades.
    res.status(200).json({
        success: true,
        count: ciudades.length,
        data: ciudades
    });
});