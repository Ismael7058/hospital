const express = require('express');
const router = express.Router();

const signosVitalesApiController = require('../../controllers/api/signosVitalesApiController');
const {
  registrarSignosVitalesValidation,
 } = require('../../validators/signosVitalesValidator');

// POST /api/signos-vitales
router.post('/', registrarSignosVitalesValidation(), signosVitalesApiController.registrarSignosVitales);


module.exports = router;