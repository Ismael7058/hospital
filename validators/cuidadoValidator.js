const { body, param } = require('express-validator');

exports.registrarCuidadoValidation = () => {
  return [
    body('admision_id')
      .notEmpty().withMessage('El ID de la admision es obligatoria.')
      .isInt().withMessage('El ID de la admision debe ser un número entero'),
    body('descripcion')
      .trim()
      .not().isEmpty().withMessage('La descripcion es obligatoria.')
      .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.'),
  ];
};

exports.setActivoValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};
