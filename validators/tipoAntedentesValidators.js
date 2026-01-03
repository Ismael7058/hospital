const { body, param } = require('express-validator');
const { TiposAtencedentes } = require('../db/models');

exports.registrarTipoAntecedentesValidation = () => {
  return [
    body('nombre')
      .trim()
      .not().isEmpty().withMessage('El nombre del tipo de antecedente es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
      .custom(async (value) => {
        const tipoAntecedente = await TiposAtencedentes.findOne({ where: { nombre: value } });
        if (tipoAntecedente) {
          return Promise.reject('El tipo de antecedente ya existe.');
        }
      }),
  ];
};

exports.editarTipoAntecedentesValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('nombre')
      .trim()
      .not().isEmpty().withMessage('El nombre del tipo de antecedente es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),
  ];
};

exports.setActivoTipoAntecedentesValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado activo debe ser un valor booleano (true o false).'),
  ];
};

exports.idTipoAntecedentesValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
  ];
}