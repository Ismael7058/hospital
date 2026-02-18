const { body } = require('express-validator');


exports.registrarSignosVitalesValidation = () => {
  return [
    body('admision_id')
      .notEmpty().withMessage('El ID de la admision es obligatoria.')
      .isInt().withMessage('El ID de la admision debe ser un número entero'),
    body('frecuencia_cardiaca')
      .notEmpty().withMessage('La frecuencia cardíaca es obligatoria.')
      .isInt({ min: 1 }).withMessage('La frecuencia cardíaca debe ser un número entero mayor a 0.'),
    body('presion_arterial')
      .notEmpty().withMessage('La presión arterial es obligatoria.'),
    body('saturacion_oxigeno')
      .notEmpty().withMessage('La saturación de oxígeno es obligatoria.')
      .isInt({ min: 1 }).withMessage('La saturación de oxígeno debe ser un número entero mayor a 0.'),
    body('temperatura') 
      .notEmpty().withMessage('La temperatura es obligatoria.')
      .isFloat().withMessage('La temperatura debe ser un número válido.'),
  ];
};