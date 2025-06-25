// backend/src/routes/ubicacionRoutes.js

const express = require('express');
const {
    getAllDepartamentos,
    getMunicipiosByDepartamento
} = require('../controllers/ubicacionController');

const router = express.Router();

// Rutas públicas
router.route('/departamentos').get(getAllDepartamentos);
router.route('/municipios').get(getMunicipiosByDepartamento);

module.exports = router;