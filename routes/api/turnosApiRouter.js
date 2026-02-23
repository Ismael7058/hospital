const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

const turnoApiController = require('../../controllers/api/turnoApiController');
const { 
    registrarTurnoValidation,
    editTurnoValidation,
    idTurnoValidation,
    setActivoTurnoValidation,
    setEstadoTurnoValidation
} = require('../../validators/turnoValidators');

// POST /api/turnos/register
router.post('/register', restringirRol('Administrador', 'Recepcion'), registrarTurnoValidation(), turnoApiController.registrarTurno); 
    
// PATCH /api/turnos/:id/activo
router.patch('/:id/activo', restringirRol('Administrador'), setActivoTurnoValidation(), turnoApiController.setActivo);

// PATCH /api/turnos/:id/estado
router.patch('/:id/estado', restringirRol('Administrador', 'Recepcion'), setEstadoTurnoValidation(), turnoApiController.setEstado);

// PATCH /api/turnos/:id
router.patch('/:id', restringirRol('Administrador'), editTurnoValidation(), turnoApiController.editarTurno);

// GET /api/turnos/:id
router.get('/:id', restringirRol('Administrador', 'Recepcion'), idTurnoValidation(), turnoApiController.getTurno);

// DELETE /api/turnos/:id
router.delete('/:id', restringirRol('Administrador'), idTurnoValidation(), turnoApiController.eliminarTurno);

module.exports = router;