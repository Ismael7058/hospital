const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/views/usuariosViewsController');


router.get('/Registrar', usuarioController.getRegistrar);

router.get('/Ver', usuarioController.getUsuario);


module.exports = router;
