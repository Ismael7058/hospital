const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/views/usuariosViewsController');


router.get('/', usuarioController.getListar);

router.get('/Registrar', usuarioController.getRegistrar);

router.get('/:id/agenda', usuarioController.getAusencia);

router.get('/:id/horarios', usuarioController.getHorarios);

router.get('/:id', usuarioController.getUsuario);


module.exports = router;
