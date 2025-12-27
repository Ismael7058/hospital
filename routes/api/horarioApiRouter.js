const express = require('express');
const router = express.Router();
const horarioController = require('../../controllers/api/horarioApiController');

const { 
  registrarHorarioValidation,
  editarHorarioValidation,
  setActivoHorarioValidation,
  eliminarHorarioValidation
 } = require('../../validators/horariosValidators')

// GET /api/horarios/:id
router.get('/:id', horarioController.getHorario);

// POST /api/horarios/registrar
router.post('/registrar', registrarHorarioValidation(), horarioController.registrarHorario);

// PATCH /api/horarios/:id/editar
router.patch('/:id/edit', editarHorarioValidation(), horarioController.editHorario);

// PATCH /api/horarios/:id/activo
router.patch('/:id/activo', setActivoHorarioValidation(), horarioController.setActivoHorario);

// DELETE /api/horarios/:id/eliminar
router.delete('/:id/eliminar', eliminarHorarioValidation(), horarioController.eliminarHorario);

module.exports = router;