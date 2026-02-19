const { body, param } = require('express-validator');


exports.registrarSignosVitalesValidation = () => {
  return [
    body('admision_id')
      .notEmpty().withMessage('El ID de la admision es obligatoria.')
      .isInt().withMessage('El ID de la admision debe ser un número entero'),
    body('frecuencia_cardiaca')
      .notEmpty().withMessage('La frecuencia cardíaca es obligatoria.')
      .isInt({ min: 30, max: 250 }).withMessage('La frecuencia cardíaca debe estar entre 30 y 250 lpm.'),
    body('presion_arterial')
      .notEmpty().withMessage('La presión arterial es obligatoria.')
      .matches(/^\d{2,3}\/\d{2,3}$/).withMessage('El formato debe ser Sistólica/Diastólica (ej: 120/80).')
      .custom((value) => {
        const [sis, dias] = value.split('/').map(Number);
        if (sis < 50 || sis > 300 || dias < 30 || dias > 200) {
          throw new Error('Valores de presión arterial fuera de rango válido.');
        }
        return true;
      }),
    body('saturacion_oxigeno')
      .notEmpty().withMessage('La saturación de oxígeno es obligatoria.')
      .isInt({ min: 60, max: 100 }).withMessage('La saturación de oxígeno debe estar entre 60% y 100%.'),
    body('temperatura') 
      .notEmpty().withMessage('La temperatura es obligatoria.')
      .isFloat({ min: 30, max: 45 }).withMessage('La temperatura debe estar entre 30°C y 45°C.'),
  ];
};

exports.setActivoValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};
