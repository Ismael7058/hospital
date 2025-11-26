const express = require('express');
const router = express.Router();

const matriculaApiController = require('../../controllers/api/matriculaApiController');
const { 
    registerMatriculaValidation, 
    updateMatriculaValidation
} = require('../../validators/matriculaValidators');

// POST /api/matriculas/register
router.post('/register', registerMatriculaValidation(), matriculaApiController.registerMatricula);

// PATCH /api/matriculas/update/:id
router.patch('/update/:id', updateMatriculaValidation(), matriculaApiController.updateMatricula);

// PATCH /api/matriculas/estado/:idMatricula
router.patch('/estado/:idMatricula', matriculaApiController.setEstado);

module.exports = router;
