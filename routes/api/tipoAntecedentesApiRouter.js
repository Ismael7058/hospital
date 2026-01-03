const express = require('express');
const router = express.Router();

const tipoAntecedentesApiController = require('../../controllers/api/tipoAntecedentesApiController');
const { 
    registrarTipoAntecedentesValidation,
    editarTipoAntecedentesValidation,
    setActivoTipoAntecedentesValidation,
    idTipoAntecedentesValidation
} = require('../../validators/tipoAntedentesValidators');

// GET /api/tipo-antecedente/:id
router.get('/:id', idTipoAntecedentesValidation(), tipoAntecedentesApiController.getTipoAntecedentes);

// POST /api/tipo-antecedente/registrar
router.post('/registrar', registrarTipoAntecedentesValidation(), tipoAntecedentesApiController.registrarTipoAntecedentes); 
    
// PATCH /api/tipo-antecedente/:id/activo
router.patch(':id/activo', setActivoTipoAntecedentesValidation(), tipoAntecedentesApiController.setActivo);

// PATCH /api/tipo-antecedente/:id
router.patch('/:id', editarTipoAntecedentesValidation(), tipoAntecedentesApiController.editarTipoAntecedentes);

module.exports = router;
