const express = require('express');
const router = express.Router();

const usuarioApiController = require('../../controllers/api/usuarioApiController');
const { 
    registerUsuarioValidation, 
    editInfoPersonalValidation,
    editCuentaValidation,
    editPasswordAdminValidation, 
    editPasswordUserValidation,
    editInfoPersonalPerfilValidation

} = require('../../validators/usuarioValidators');

// POST /api/usuarios/register
router.post('/register', registerUsuarioValidation(), usuarioApiController.registerUsuario);

// PATCH /api/usuarios/infoPersonal/:idUsuario
router.patch('/infoPersonal/:idUsuario', editInfoPersonalValidation(), usuarioApiController.infoPersonal);

// PATCH /api/usuarios/editCuenta/:idUsuario
router.patch('/editCuenta/:idUsuario', editCuentaValidation(), usuarioApiController.editCuenta);

// PATCH /api/usuarios/editPassword/:idUsuario
router.patch('/editPassword/:idUsuario', editPasswordAdminValidation(), usuarioApiController.editPasswordAdmin);

// PATCH /api/usuarios/estado/:idUsuario
router.patch('/estado/:idUsuario', usuarioApiController.setEstado);

// PATCH /api/usuarios/editPerfil
router.patch('/editPerfil', editInfoPersonalPerfilValidation(), usuarioApiController.editPerfil);

// PATCH /api/usuarios/editPassword
router.patch('/editPassword', editPasswordUserValidation(), usuarioApiController.editPassword);

// GET /api/usuarios/buscar
router.get('/buscar', usuarioApiController.buscar);

module.exports = router;
