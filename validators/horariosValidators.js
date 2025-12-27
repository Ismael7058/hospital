const { body, param } = require('express-validator');
const { Usuario } = require('../db/models');

const dias = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo'
]

exports.registrarHorarioValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('fecha', 'El día no es válido')
      .not().isEmpty().withMessage('El día es obligatorio.')
      .isIn(dias).withMessage(`El día debe ser uno de los siguientes: ${dias.join(', ')}`),
    body('hora_inicio')
      .not().isEmpty().withMessage('La hora de inicio es obligatoria.')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).withMessage('La hora de inicio debe tener un formato válido (HH:MM).'),
    body('hora_fin')
      .not().isEmpty().withMessage('La hora de fin es obligatoria.')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).withMessage('La hora de fin debe tener un formato válido (HH:MM).')
      .custom((value, { req }) => {
        if (value <= req.body.hora_inicio) {
          throw new Error('La hora de fin debe ser posterior a la hora de inicio.');
        }
        return true;
      }),
    body('usuario_id')
      .not().isEmpty().withMessage('El usuario es obligatorio.')
      .isInt().withMessage('El ID de usuario debe ser un número entero.')
      .custom(async (value) => {
        const usuario = await Usuario.findByPk(value);
        if (!usuario) {
          return Promise.reject('El usuario seleccionado no existe.');
        }
      }),
  ];
};

exports.editarHorarioValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('fecha', 'El día no es válido')
      .not().isEmpty().withMessage('El día es obligatorio.')
      .isIn(dias).withMessage(`El día debe ser uno de los siguientes: ${dias.join(', ')}`),
    body('hora_inicio')
      .not().isEmpty().withMessage('La hora de inicio es obligatoria.')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).withMessage('La hora de inicio debe tener un formato válido (HH:MM).'),
    body('hora_fin')
      .not().isEmpty().withMessage('La hora de fin es obligatoria.')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).withMessage('La hora de fin debe tener un formato válido (HH:MM).')
      .custom((value, { req }) => {
        if (value <= req.body.hora_inicio) {
          throw new Error('La hora de fin debe ser posterior a la hora de inicio.');
        }
        return true;
      }),
    body('usuario_id')
      .not().isEmpty().withMessage('El usuario es obligatorio.')
      .isInt().withMessage('El ID de usuario debe ser un número entero.')
      .custom(async (value) => {
        const usuario = await Usuario.findByPk(value);
        if (!usuario) {
          return Promise.reject('El usuario seleccionado no existe.');
        }
      }),
  ];
};

exports.setActivoHorarioValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};

exports.eliminarHorarioValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
  ];
}