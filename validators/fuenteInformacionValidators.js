const { body, param } = require('express-validator');
const { FuentesInformacion } = require('../db/models');

exports.registrarFuenteValidation = () => {
  return [
    body('nombre')
      .trim()
      .not().isEmpty().withMessage('El nombre de la fuente de informacion es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
      .custom(async (value) => {
        const fuente = await FuentesInformacion.findOne({ where: { nombre: value } });
        if (fuente) {
          return Promise.reject('La fuente de informacion ya existe.');
        }
      }),
  ];
};

exports.editarFuenteValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('nombre')
      .trim()
      .not().isEmpty().withMessage('El nombre de la fuente de informacion es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),
  ];
};

exports.setActivoFuenteValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado activo debe ser un valor booleano (true o false).'),
  ];
};

exports.idFuenteValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
  ];
}