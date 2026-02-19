const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

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
router.post('/register', restringirRol('Administrador'), registerUsuarioValidation(), usuarioApiController.registerUsuario);

// PATCH /api/usuarios/infoPersonal/:idUsuario
router.patch('/infoPersonal/:idUsuario', restringirRol('Administrador'), editInfoPersonalValidation(), usuarioApiController.infoPersonal);

// PATCH /api/usuarios/editCuenta/:idUsuario
router.patch('/editCuenta/:idUsuario', restringirRol('Administrador'), editCuentaValidation(), usuarioApiController.editCuenta);

// PATCH /api/usuarios/editPassword/:idUsuario
router.patch('/editPassword/:idUsuario', restringirRol('Administrador'), editPasswordAdminValidation(), usuarioApiController.editPasswordAdmin);

// PATCH /api/usuarios/estado/:idUsuario
router.patch('/estado/:idUsuario', restringirRol('Administrador'), usuarioApiController.setEstado);

// PATCH /api/usuarios/editPerfil
router.patch('/editPerfil', restringirRol('Recepcionista','Administrador', 'Medico', 'Enfermero', 'Limpieza'), editInfoPersonalPerfilValidation(), usuarioApiController.editPerfil);

// PATCH /api/usuarios/editPassword
router.patch('/editPassword', restringirRol('Recepcionista','Administrador', 'Medico', 'Enfermero', 'Limpieza'), editPasswordUserValidation(), usuarioApiController.editPassword);

// GET /api/usuarios/buscar
router.get('/buscar', restringirRol('Administrador', 'Recepcionista', 'Medico', 'Enfermero'), usuarioApiController.buscar);

module.exports = router;
