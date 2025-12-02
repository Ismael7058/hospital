const express = require('express');
const router = express.Router();

const alaApiController = require('../../controllers/api/alaApiController');
const habitacionApiController = require('../../controllers/api/habitacionApiController');
const camaApiController = require('../../controllers/api/camaApiController');

const { 
    registerAlaValidation,
    editAlaValidation,
    setActivoAlaValidation
} = require('../../validators/alaValidators');

const { 
    registerHabitacionValidation,
    editHabitacionValidation,
    moverHabitacionValidation,
    setActivoHabitacionValidation
} = require('../../validators/habitacionValidators')

const { 
    registerCamaValidation,
    editCamaValidation,
    moverCamaValidation,
    setEstadoCamaValidation,
    setActivoCamaValidation
} = require('../../validators/camaValidators')


// POST /api/infraestructura/ala/register
router.post('/ala/register', registerAlaValidation(), alaApiController.registerAla);

// PATCH /api/infraestructura/ala/:id/edit
router.patch('/ala/:id/edit', editAlaValidation(), alaApiController.editAla);

// PATCH /api/infraestructura/ala/:id/activo
router.patch('/ala/:id/activo', setActivoAlaValidation(), alaApiController.setActivoAla);



// POST /api/infraestructura/habitacion/register
router.post('/habitacion/register', registerHabitacionValidation(), habitacionApiController.registerHabitacion);

// PATCH /api/infraestructura/habitacion/:id/edit
router.patch('/habitacion/:id/edit', editHabitacionValidation(), habitacionApiController.editHabitacion);

// PATCH /api/infraestructura/habitacion/:id/trasladar
router.patch('/habitacion/:id/trasladar', moverHabitacionValidation(), habitacionApiController.moverHabitacion);

// PATCH /api/infraestructura/habitacion/:id/activo
router.patch('/habitacion/:id/activo', setActivoHabitacionValidation(), habitacionApiController.setActivoHabitacion);



// POST /api/infraestructura/cama/register
router.post('/cama/register', registerCamaValidation(), camaApiController.registerCama);

// PATCH /api/infraestructura/cama/:id/edit
router.patch('/cama/:id/edit', editCamaValidation(), camaApiController.editCama);

// PATCH /api/infraestructura/cama/:id/trasladar
router.patch('/cama/:id/trasladar', moverCamaValidation(), camaApiController.moverCama);

// PATCH /api/infraestructura/cama/:id/estado
router.patch('/cama/:id/estado', setEstadoCamaValidation(), camaApiController.setEstadoCama);

// PATCH /api/infraestructura/cama/:id/activo
router.patch('/cama/:id/activo', setActivoCamaValidation(), camaApiController.setActivoCama);

module.exports = router;
