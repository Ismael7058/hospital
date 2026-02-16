const { body } = require('express-validator');
const { Admision } = require('../db/models');

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