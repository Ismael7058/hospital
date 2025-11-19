const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/views/usuariosViewsController');


router.get('/Registrar', usuarioController.getRegistrar);

router.get('/Listar', usuarioController.getListar);

router.get('/:id', usuarioController.getUsuario);


module.exports = router;
