const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

const pacienteController = require('../../controllers/views/pacienteViewsController');

router.get('/', restringirRol('Administrador', 'Recepcion'), pacienteController.getListaPaciente);

router.get('/registrar', restringirRol('Administrador', 'Recepcion'), pacienteController.getRegistrar);

router.get('/:id/seguros', restringirRol('Administrador', 'Recepcion'), pacienteController.getSeguros);

router.get('/:id/antecedentes', restringirRol('Administrador', 'Medico', 'Enfermero'), pacienteController.getAntecedentes);

router.get('/:id/evolucion-medica', restringirRol('Administrador', 'Medico', 'Enfermero'), pacienteController.getEvolucionMedica);

router.get('/:id/estudios-solicitados', restringirRol('Administrador', 'Medico', 'Enfermero'), pacienteController.getEstudiosSolicitados);

router.get('/:id/cuidados', restringirRol('Administrador', 'Medico', 'Enfermero'), pacienteController.getCuidadosPreliminares);

router.get('/:id/medicaciones', restringirRol('Administrador', 'Medico', 'Enfermero'), pacienteController.getMedicaciones);

router.get('/:id', restringirRol('Administrador', 'Recepcion', 'Medico'), pacienteController.getPaciente);

module.exports = router;
