const { body, param } = require('express-validator');

exports.registrarEvolucionMedicaValidation = () => {
  return [
    body('admision_id')
      .notEmpty().withMessage('El ID de la admision es obligatoria.')
      .isInt().withMessage('El ID de la admision debe ser un número entero'),
    body('diagnostico')
      .trim()
      .not().isEmpty().withMessage('El diagnostico es obligatorio.')
      .isLength({ min: 3 }).withMessage('El diagnostico debe tener al menos 3 caracteres.'),
    body('tratamiento_ajuste')
      .trim()
      .not().isEmpty().withMessage('El tratamiento es obligatorio.')
      .isLength({ min: 3 }).withMessage('El tratamiento debe tener al menos 3 caracteres.'),
  ];
};

exports.setActivoValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};
