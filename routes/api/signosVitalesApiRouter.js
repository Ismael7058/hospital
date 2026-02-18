const express = require('express');
const router = express.Router();

const signosVitalesApiController = require('../../controllers/api/signosVitalesApiController');
const {
  registrarSignosVitalesValidation,
  setActivoValidation,
 } = require('../../validators/signosVitalesValidator');

// POST /api/signos-vitales
router.post('/', registrarSignosVitalesValidation(), signosVitalesApiController.registrarSignosVitales);

// PATCH /api/signos-vitales/:id/activo
router.patch('/:id/activo', setActivoValidation(), signosVitalesApiController.setActivo);

module.exports = router;