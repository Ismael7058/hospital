const express = require('express');
const router = express.Router();
const infraestructuraController = require('../../controllers/views/infraestructuraViewsController');

router.get('/', infraestructuraController.getDashboard);
router.get('/alas', infraestructuraController.getListarAlas);
router.get('/habitaciones', infraestructuraController.getListarHabitaciones);
router.get('/camas', infraestructuraController.getListarCamas);
router.get('/camas/:id/higienizaciones', infraestructuraController.getHistorialHigienizaciones);

module.exports = router;
