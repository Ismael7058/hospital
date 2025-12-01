const { body, param } = require('express-validator');

exports.registerAlaValidation = () => {
  return [
    body('nombre')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
  ];
};

exports.editAlaValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('nombre')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
  ];
};

exports.setActivoAlaValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El activo debe ser un valor booleano (true o false).'),
  ];
};