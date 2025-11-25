const express = require('express');
const router = express.Router();

const matriculaApiController = require('../../controllers/api/matriculaApiController');
const { 
    registerMatriculaValidation, 
    updateMatriculaValidation
} = require('../../validators/matriculaValidators');

// POST /api/matricula/register
router.post('/register', registerMatriculaValidation(), matriculaApiController.registerMatricula);

// PATCH /api/matricula/renovar/:idUsuario
router.patch('/renovar/:idUsuario', updateMatriculaValidation(), matriculaApiController.updateMatricula);

module.exports = router;
