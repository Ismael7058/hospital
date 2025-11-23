const express = require('express');
const router = express.Router();

const usuarioApiController = require('../../controllers/api/usuarioApiController');
const { 
    registerUsuarioValidation, 
    editPerfilValidation, 
    editPasswordAdminValidation, 
    modifyUsuarioValidation, 
    editInfoPersonalValidation,
} = require('../../validators/usuarioValidators');

// POST /api/usuarios/register
router.post('/register', registerUsuarioValidation(), usuarioApiController.registerUsuario);

// PATCH /api/usuarios/infoPersonal/:idUsuario
router.patch('/infoPersonal/:idUsuario', editInfoPersonalValidation(), usuarioApiController.infoPersonal);

// PATCH /api/usuarios/editCuenta/:idUsuario
router.patch('/editCuenta/:idUsuario', editCuentaValidation(), usuarioApiController.editCuenta);

// PATCH /api/usuarios/editPassword/:idUsuario
router.patch('/editPassword/:idUsuario', editPasswordAdminValidation(), usuarioApiController.editPasswordAdmin);

// PUT /api/usuarios/editPerfil
router.put('/editPerfil', editPerfilValidation(), usuarioApiController.editPerfil);

// PUT /api/usuarios/editPassword
router.put('/editPassword', editPasswordValidation(), usuarioApiController.editPassword);

// PUT /api/usuarios/modify
router.put('/modify', modifyUsuarioValidation(), usuarioApiController.modifyUsuario);

// POST /api/usuarios/altaLogica
router.post('/altaLogica', usuarioApiController.altaLogica);

// POST /api/usuarios/bajaLogica
router.post('/bajaLogica', usuarioApiController.bajaLogica);


module.exports = router;
