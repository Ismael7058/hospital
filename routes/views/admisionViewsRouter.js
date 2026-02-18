const express = require('express');
const router = express.Router();
const admisionController = require('../../controllers/views/admisionViewsController');


router.get('/', admisionController.getAdmisiones);

router.get('/registrar', admisionController.getRegistrar)

router.get('/:id/estadia', admisionController.getEstadia);

router.get('/:id/evolucion-medica', admisionController.getEvolucionMedica);

router.get('/:id', admisionController.getAdmision);

module.exports = router;
