const express = require('express');
const router = express.Router();

const agendaApiController = require('../../controllers/api/agendaApiController');
const { 
    registrarAgendaValidation,
    editAgendaValidacion,
    setActivoAgendaValidation
} = require('../../validators/agendaValidators');

// POST /api/especialidades/register
router.post('/register', registrarAgendaValidation(), agendaApiController.registrarAgenda);

// PATCH /api/especialidades/:id/activo
router.patch('/:id/activo', setActivoAgendaValidation(), agendaApiController.setActivo);

// PATCH /api/especialidades/:id
router.patch('/:id', editAgendaValidacion(), agendaApiController.editAgenda);

module.exports = router;
