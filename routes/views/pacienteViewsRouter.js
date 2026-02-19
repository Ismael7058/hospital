const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

const pacienteController = require('../../controllers/views/pacienteViewsController');

router.get('/', restringirRol('Administrador', 'Recepcion'), pacienteController.getListaPaciente);

router.get('/registrar', restringirRol('Administrador', 'Recepcion'), pacienteController.getRegistrar);

router.get('/:id/seguros', restringirRol('Administrador', 'Recepcion'), pacienteController.getSeguros);

router.get('/:id/antecedentes', restringirRol('Administrador', 'Medico', 'Enfermero'), pacienteController.getAntecedentes);

router.get('/:id', restringirRol('Administrador', 'Recepcion'), pacienteController.getPaciente);

module.exports = router;
