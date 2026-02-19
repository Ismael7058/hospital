const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

const antecedentePacienteController = require('../../controllers/api/antecedentePacienteApiController');
const {
  registerAntecedentePacienteValidation,
  editAntecedentePacienteValidation,
  validarAntecedentePacienteValidation,
  setActivoAntecedentePacienteValidation,
  idAntecedentePacienteValidation
} = require('../../validators/antecedentePacienteValidators');

// GET /api/antecentes-paciente/:id
router.get('/:id', restringirRol('Medico', 'Administrador', 'Enfermero'), idAntecedentePacienteValidation(), antecedentePacienteController.getAntecedentePaciente);

// POST /api/antecentes-paciente/registrar
router.post('/registrar', restringirRol('Medico'), registerAntecedentePacienteValidation(), antecedentePacienteController.registrarAntecedentePaciente); 
    
// PATCH /api/antecentes-paciente/:id/activo
router.patch('/:id/activo', restringirRol('Administrador'), setActivoAntecedentePacienteValidation(), antecedentePacienteController.setActivo);

// PATCH /api/antecentes-paciente/:id/validado
router.patch('/:id/validado', restringirRol('Medico'), validarAntecedentePacienteValidation(), antecedentePacienteController.setValidacion);

// PATCH /api/antecentes-paciente/:id
router.patch('/:id', restringirRol('Medico'), editAntecedentePacienteValidation(), antecedentePacienteController.editarAntecedentePaciente);

module.exports = router;
