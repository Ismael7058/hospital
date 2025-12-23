const { body, param } = require('express-validator');

exports.registrarSeguroValidation = () => {
  return [
    body('nombre')
      .trim()
      .not().isEmpty().withMessage('El nombre del seguro medico es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
  ];
};

exports.editSeguroValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('nombre')
      .trim()
      .not().isEmpty().withMessage('El nombre del seguro medico es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),
  ];
};

exports.setActivoSeguroValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};
