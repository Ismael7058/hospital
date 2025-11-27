const { body, param } = require('express-validator');
const { Especialidad } = require('../db/models');

exports.registrarEspecialidadValidation = () => {
  return [
    body('nombre')
      .trim()
      .not().isEmpty().withMessage('El nombre de la especialidad es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.')
      .custom(async (value) => {
        const especialidad = await Especialidad.findOne({ where: { nombre: value } });
        if (especialidad) {
          return Promise.reject('La especialidad ya existe.');
        }
      }),
  ];
};

exports.editEspecialidadValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('nombre')
      .trim()
      .not().isEmpty().withMessage('El nombre de la especialidad es obligatorio.')
      .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres.'),
  ];
};

exports.setEstadoEspecialidadValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};
