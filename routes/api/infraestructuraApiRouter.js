const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

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
    setActivoHabitacionValidation,
    getHabitacionValidation,
    habitacionesDisponibles
} = require('../../validators/habitacionValidators')

const { 
    registerCamaValidation,
    editCamaValidation,
    moverCamaValidation,
    setEstadoCamaValidation,
    setActivoCamaValidation,
    getCamaValidation
} = require('../../validators/camaValidators');


// POST /api/infraestructura/ala/register
router.post('/ala/register', restringirRol('Administrador'), registerAlaValidation(), alaApiController.registerAla);

// PATCH /api/infraestructura/ala/:id/edit
router.patch('/ala/:id/edit', restringirRol('Administrador'), editAlaValidation(), alaApiController.editAla);

// PATCH /api/infraestructura/ala/:id/activo
router.patch('/ala/:id/activo', restringirRol('Administrador'), setActivoAlaValidation(), alaApiController.setActivoAla);

// GET /api/infraestructura/ala/buscar
router.get('/ala/buscar', restringirRol('Administrador'), alaApiController.getAlas);


// POST /api/infraestructura/habitacion/register
router.post('/habitacion/register', restringirRol('Administrador'), registerHabitacionValidation(), habitacionApiController.registerHabitacion);

// PATCH /api/infraestructura/habitacion/:id/edit
router.patch('/habitacion/:id/edit', restringirRol('Administrador'), editHabitacionValidation(), habitacionApiController.editHabitacion);

// PATCH /api/infraestructura/habitacion/:id/trasladar
router.patch('/habitacion/:id/trasladar', restringirRol('Administrador'), moverHabitacionValidation(), habitacionApiController.moverHabitacion);

// PATCH /api/infraestructura/habitacion/:id/activo
router.patch('/habitacion/:id/activo', restringirRol('Administrador'), setActivoHabitacionValidation(), habitacionApiController.setActivoHabitacion);

// GET /api/infraestructura/habitacion/buscar
router.get('/habitacion/buscar', restringirRol('Administrador'), habitacionApiController.getHabitaciones);

// GET /api/infraestructura/habitacion/disponible
router.get('/habitacion/disponible', restringirRol('Administrador', 'Recepcionista', 'Enfermero', 'Medico'), habitacionApiController.habitacionesDisponibles);

// GET /api/infraestructura/habitacion/:id
router.get('/habitacion/:id', restringirRol('Administrador'), habitacionApiController.getHabitacion);



// POST /api/infraestructura/cama/register
router.post('/cama/register', restringirRol('Administrador'), registerCamaValidation(), camaApiController.registerCama);

// PATCH /api/infraestructura/cama/:id/edit
router.patch('/cama/:id/edit', restringirRol('Administrador'), editCamaValidation(), camaApiController.editCama);

// PATCH /api/infraestructura/cama/:id/trasladar
router.patch('/cama/:id/trasladar', restringirRol('Administrador'), moverCamaValidation(), camaApiController.moverCama);

// PATCH /api/infraestructura/cama/:id/estado
router.patch('/cama/:id/estado', restringirRol('Administrador'), setEstadoCamaValidation(), camaApiController.setEstadoCama);

// PATCH /api/infraestructura/cama/:id/activo
router.patch('/cama/:id/activo', restringirRol('Administrador'), setActivoCamaValidation(), camaApiController.setActivoCama);

// GET /api/infraestructura/cama/:id
router.get('/cama/:id', getCamaValidation('Administrador', 'Limpieza'),camaApiController.getCama);

// GET /api/infraestructura/cama
router.get('/cama', restringirRol('Administrador', 'Recepcionista', 'Enfermero', 'Medico'), camaApiController.getCamas);


module.exports = router;
