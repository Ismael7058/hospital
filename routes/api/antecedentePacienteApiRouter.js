const express = require('express');
const router = express.Router();

const antecedentePacienteController = require('../../controllers/api/antecedentePacienteApiController');
const {
  registerAntecedentePacienteValidation,
  editAntecedentePacienteValidation,
  validarAntecedentePacienteValidation,
  setActivoAntecedentePacienteValidation,
  idAntecedentePacienteValidation
} = require('../../validators/antecedentePacienteValidators');

// GET /api/antecentes-paciente/:id
router.get('/:id', idAntecedentePacienteValidation(), antecedentePacienteController.getAntecedentePaciente);

// POST /api/antecentes-paciente/registrar
router.post('/registrar', registerAntecedentePacienteValidation(), antecedentePacienteController.registrarAntecedentePaciente); 
    
// PATCH /api/antecentes-paciente/:id/activo
router.patch('/:id/activo', setActivoAntecedentePacienteValidation(), antecedentePacienteController.setActivo);

// PATCH /api/antecentes-paciente/:id/validado
router.patch('/:id/validado', validarAntecedentePacienteValidation(), antecedentePacienteController.setValidacion);

// PATCH /api/antecentes-paciente/:id
router.patch('/:id', editAntecedentePacienteValidation(), antecedentePacienteController.editarAntecedentePaciente);

module.exports = router;
