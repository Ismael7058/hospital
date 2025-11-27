const express = require('express');
const router = express.Router();

const especialidadApiController = require('../../controllers/api/especialidadApiController');
const { 
    registrarEspecialidadValidation,
    editEspecialidadValidation,
    setEstadoEspecialidadValidation
} = require('../../validators/especialidadValidators');

// GET /api/especialidades/:id
router.get('/:id', especialidadApiController.getEspecialidad);

// POST /api/especialidades/register
router.post('/register', registrarEspecialidadValidation(), especialidadApiController.registerEspecialidad); 
    
// PATCH /api/especialidades/:id
router.patch('/:id', editEspecialidadValidation(), especialidadApiController.editEspecialidad);

// PATCH /api/especialidades/estado/:id
router.patch('/estado/:id', setEstadoEspecialidadValidation(), especialidadApiController.setEstado);

module.exports = router;
