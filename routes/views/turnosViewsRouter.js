const express = require('express');
const router = express.Router();
const turnoController = require('../../controllers/views/turnoViewsController');


router.get('/', turnoController.getTurnos);

router.get('/registrar', turnoController.getRegistrar);

router.get('/:id', turnoController.getTurno);


module.exports = router;
