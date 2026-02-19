const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

const admisionController = require('../../controllers/views/admisionViewsController');

router.get('/', restringirRol('Administrador', 'Medico', 'Enfermero', 'Recepcion'), admisionController.getAdmisiones);

router.get('/registrar',restringirRol('Administrador', 'Recepcion'), admisionController.getRegistrar)

router.get('/:id/estadia', restringirRol('Administrador', 'Medico', 'Enfermero'), admisionController.getEstadia);

router.get('/:id/evolucion-medica', restringirRol('Administrador', 'Medico', 'Enfermero'), admisionController.getEvolucionMedica);

router.get('/:id/estudios-solicitados', restringirRol('Administrador', 'Medico', 'Enfermero'), admisionController.getEstudiosSolicitados);

router.get('/:id/cuidados', restringirRol('Administrador', 'Medico', 'Enfermero'), admisionController.getCuidadosPreeliminares);

router.get('/:id/medicaciones', restringirRol('Administrador', 'Medico', 'Enfermero'), admisionController.getMedicaciones);

router.get('/:id/signos-vitales', restringirRol('Administrador', 'Medico', 'Enfermero'), admisionController.getSignosVitales);

router.get('/:id/ubicaciones', restringirRol('Administrador'), admisionController.getUbicacionesInternaciones);

router.get('/:id', restringirRol('Administrador', 'Medico', 'Enfermero'), admisionController.getAdmision);

module.exports = router;
