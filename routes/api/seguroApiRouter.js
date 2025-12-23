const express = require('express');
const router = express.Router();

const seguroApiController = require('../../controllers/api/seguroApiController');
const { 
    registrarSeguroValidation,
    editSeguroValidation,
    setActivoSeguroValidation
} = require('../../validators/seguroValidators');

// POST /api/seguros/register
router.post('/register', registrarSeguroValidation(), seguroApiController.registerSeguro); 
    
// PATCH /api/seguros/:id/activo
router.patch('/:id/activo', setActivoSeguroValidation(), seguroApiController.setActivo);

// PATCH /api/seguros/:id
router.patch('/:id', editSeguroValidation(), seguroApiController.editSeguro);

// GET /api/seguros/:id
router.get('/:id', seguroApiController.getSeguro);

module.exports = router;
