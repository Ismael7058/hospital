const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

const infraestructuraController = require('../../controllers/views/infraestructuraViewsController');

router.get('/', restringirRol('Administrador', 'Limpieza'), infraestructuraController.getDashboard);
router.get('/alas', restringirRol('Administrador'), infraestructuraController.getListarAlas);
router.get('/habitaciones', restringirRol('Administrador'), infraestructuraController.getListarHabitaciones);
router.get('/camas', restringirRol('Administrador'), infraestructuraController.getListarCamas);
router.get('/camas/:id/higienizaciones',  restringirRol('Administrador'), infraestructuraController.getHistorialHigienizaciones);

module.exports = router;
