const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/views/usuariosViewsController');
const { restringirRol } = require('../../middlewares/authMiddleware');

router.get('/', restringirRol('Administrador'), usuarioController.getListar);

router.get('/Registrar', restringirRol('Administrador'), usuarioController.getRegistrar);

router.get('/:id/agenda', restringirRol('Administrador', 'Medico'), usuarioController.getAusencia);

router.get('/:id/horarios', restringirRol('Administrador', 'Medico'), usuarioController.getHorarios);

router.get('/:id', restringirRol('Administrador'), usuarioController.getUsuario);


module.exports = router;
