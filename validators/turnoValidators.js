const { body, param } = require('express-validator');

const estado = ['Pendiente', 'Confirmado', 'Cancelado'];

exports.registrarTurnoValidation = () => {
  return [
    body('fecha', 'La fecha no es válida')
      .not().isEmpty().withMessage('La fecha es obligatoria.')
      .isISO8601().toDate(),
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
    body('medico_id')
      .not().isEmpty().withMessage('El medico es obligatorio.')
      .isInt().withMessage('El ID del medico debe ser un número entero.'),
    body('paciente_id')
      .notEmpty().withMessage('El ID del paciente es obligatorio')
      .isInt().withMessage('El ID del paciente debe ser un número entero'),
    body('motivo')
      .trim()
      .not().isEmpty().withMessage('El motivo del turno es obligatorio.')
      .isLength({ min: 3 }).withMessage('El motivo debe tener al menos 3 caracteres.'),
  ];
};

exports.editTurnoValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('fecha', 'La fecha no es válida')
      .not().isEmpty().withMessage('La fecha es obligatoria.')
      .isISO8601().toDate(),
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
    body('motivo')
      .trim()
      .not().isEmpty().withMessage('El motivo del turno es obligatorio.')
      .isLength({ min: 3 }).withMessage('El motivo debe tener al menos 3 caracteres.'),
    body('estado', 'El estado no es válido')
      .not().isEmpty().withMessage('El estado es obligatorio.')
      .isIn(estado).withMessage(`El estado de ser uno de los siguientes: ${estado.join(', ')}`),
    body('medico_id')
      .not().isEmpty().withMessage('El medico es obligatorio.')
      .isInt().withMessage('El ID del medico debe ser un número entero.'),
    body('paciente_id')
      .notEmpty().withMessage('El ID del paciente es obligatorio')
      .isInt().withMessage('El ID del paciente debe ser un número entero'),
  ];
};

exports.setActivoTurnoValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};

exports.setEstadoTurnoValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('estado', 'El estado no es válido')
      .not().isEmpty().withMessage('El estado es obligatorio.')
      .isIn(estado).withMessage(`El estado de ser uno de los siguientes: ${estado.join(', ')}`),
  ];
}

exports.idTurnoValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
  ];
}