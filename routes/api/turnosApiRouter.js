const express = require('express');
const router = express.Router();

const turnoApiController = require('../../controllers/api/turnoApiController');
const { 
    registrarTurnoValidation,
    editTurnoValidation,
    idTurnoValidation,
    setActivoTurnoValidation,
    setEstadoTurnoValidation
} = require('../../validators/turnoValidators');

// POST /api/turnos/register
router.post('/register', registrarTurnoValidation(), turnoApiController.registrarTurno); 
    
// PATCH /api/turnos/:id/activo
router.patch('/:id/activo', setActivoTurnoValidation(), turnoApiController.setActivo);

// PATCH /api/turnos/:id/estado
router.patch('/:id/estado', setEstadoTurnoValidation(), turnoApiController.setEstado);

// PATCH /api/turnos/:id
router.patch('/:id', editTurnoValidation(), turnoApiController.editarTurno);

// GET /api/turnos/:id
router.get('/:id', idTurnoValidation(), turnoApiController.getTurno);

// DELETE /api/turnos/:id
router.delete('/:id', idTurnoValidation(), turnoApiController.eliminarTurno);

module.exports = router;