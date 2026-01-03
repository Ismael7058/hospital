const express = require('express');
const router = express.Router();

const fuentesInformacionApiController = require('../../controllers/api/fuentesInformacionApiController');
const { 
    registrarFuenteValidation,
    editarFuenteValidation,
    setActivoFuenteValidation,
    idFuenteValidation
} = require('../../validators/fuenteInformacionValidators');

// GET /api/fuentes/:id
router.get('/:id', idFuenteValidation(), fuentesInformacionApiController.getFuente);

// POST /api/fuentes/registrar
router.post('/registrar', registrarFuenteValidation(), fuentesInformacionApiController.registrarFuente); 
    
// PATCH /api/fuentes/:id/activo
router.patch('/:id/activo', setActivoFuenteValidation(), fuentesInformacionApiController.setActivo);

// PATCH /api/fuentes/:id
router.patch('/:id', editarFuenteValidation(), fuentesInformacionApiController.editarFuente);

module.exports = router;
