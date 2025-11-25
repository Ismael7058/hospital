const { body } = require('express-validator');
const { Usuario } = require('../db/models');

exports.registerMatriculaValidation = () => {
    return [
    body('numero')
      .trim()
      .not().isEmpty().withMessage('El número de matrícula es obligatorio.'),
    body('tipo')
      .trim()
      .not().isEmpty().withMessage('El tipo de matrícula es obligatorio.'),
    body('entidad_emisora')
      .trim()
      .not().isEmpty().withMessage('La entidad emisora es obligatoria.'),
    body('fecha_emision')
      .not().isEmpty().withMessage('La fecha de emisión es obligatoria.')
      .isISO8601().withMessage('La fecha de emisión debe tener un formato de fecha válido (YYYY-MM-DD).').toDate(),
    body('fecha_vencimiento')
      .not().isEmpty().withMessage('La fecha de vencimiento es obligatoria.')
      .isISO8601().withMessage('La fecha de vencimiento debe tener un formato de fecha válido (YYYY-MM-DD).').toDate(),
    body('usuario_id')
      .not().isEmpty().withMessage('El usuario es obligatorio.')
      .isInt().withMessage('El ID de usuario debe ser un número entero.')
      .custom(async (value) => {
        const usuario = await Usuario.findByPk(value);
        if (!usuario) {
          return Promise.reject('El usuario seleccionado no existe.');
        }
      }),
  ];
};

exports.updateMatriculaValidation = () => {
    return [
    body('fecha_vencimiento')
      .not().isEmpty().withMessage('La fecha de vencimiento es obligatoria.')
      .isISO8601().withMessage('La fecha de vencimiento debe tener un formato de fecha válido (YYYY-MM-DD).').toDate(),
    body('usuario_id')
      .not().isEmpty().withMessage('El usuario es obligatorio.')
      .isInt().withMessage('El ID de usuario debe ser un número entero.')
      .custom(async (value) => {
        const usuario = await Usuario.findByPk(value);
        if (!usuario) {
          return Promise.reject('El usuario seleccionado no existe.');
        }
      }),
  ];
};
