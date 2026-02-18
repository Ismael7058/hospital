const express = require('express');
const router = express.Router();
const admisionController = require('../../controllers/views/admisionViewsController');


router.get('/', admisionController.getAdmisiones);

router.get('/registrar', admisionController.getRegistrar)

router.get('/:id/estadia', admisionController.getEstadia);

router.get('/:id/evolucion-medica', admisionController.getEvolucionMedica);

router.get('/:id/estudios-solicitados', admisionController.getEstudiosSolicitados);

router.get('/:id/cuidados', admisionController.getCuidadosPreeliminares);

router.get('/:id/medicaciones', admisionController.getMedicaciones);

router.get('/:id/signos-vitales', admisionController.getSignosVitales);

router.get('/:id', admisionController.getAdmision);

module.exports = router;
