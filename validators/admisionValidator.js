const { body, query, param } = require('express-validator');
const { Paciente, ViaIngreso, Turno, Cama } = require('../db/models');

exports.registrarAdmisionValidation = () => {
  return [
    query('modo')
      .notEmpty().withMessage('El modo de admisión es obligatorio')
      .isIn(['guardia', 'turno', 'emergencia']).withMessage('El modo de admisión no es válido'),
    body('motivo_internacion')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.'),
    body('via_ingreso_id')
      .notEmpty().withMessage('La via de ingreso es obligatoria')
      .isInt().withMessage('El ID de la via de ingreso debe ser un número entero')
      .custom(async (value, { req }) => {
        const via = await ViaIngreso.findByPk(value);
        if (!via) {
          return Promise.reject('La via de ingreso seleccionada no existe');
        } else if (!via.activo) {
          return Promise.reject('La via de ingreso no esta disponible para esta accion');
        }

        const modo = req.query.modo;
        const nombreVia = via.nombre.toLowerCase();

        if (modo === 'emergencia' && !nombreVia.includes('emergencia')) {
          return Promise.reject('La via de ingreso seleccionada no corresponde al modo Emergencia.');
        }
        if (modo === 'guardia' && !nombreVia.includes('guardia')) {
          return Promise.reject('La via de ingreso seleccionada no corresponde al modo Guardia.');
        }
        if (modo === 'turno' && !nombreVia.includes('turno')) {
          return Promise.reject('La via de ingreso seleccionada no corresponde al modo Turno.');
        }
      }),

    body('paciente_id')
      .if((value, { req }) => ['guardia', 'turno'].includes(req.query.modo))
      .notEmpty().withMessage('El paciente es obligatorio.')
      .isInt().withMessage('El ID del paciente debe ser un número entero')
      .custom(async (value) => {
        const paciente = await Paciente.findByPk(value);
        if (!paciente) {
          return Promise.reject('El paciente seleccionado no existe');
        } else if (!paciente.activo) {
          return Promise.reject('El paciente no esta disponible para esta accion');
        }
      }),

    body('turno_id')
      .if((value, { req }) => req.query.modo === 'turno')
      .notEmpty().withMessage('El ID del turno es obligatorio.')
      .isInt().withMessage('El ID del turno debe ser un número entero.')
      .custom(async (value, { req }) => {
        const turno = await Turno.findByPk(value);
        if (!turno) return Promise.reject('El turno seleccionado no existe.');
        if (!turno.activo) return Promise.reject('El turno no esta disponible');
        if (req.body.paciente_id && turno.paciente_id != req.body.paciente_id) {
          return Promise.reject('El paciente del turno no coincide con el paciente ingresado');
        }
      }),

    body('paciente_id').if((value, { req }) => req.query.modo === 'emergencia').optional()
      .isInt().withMessage('El ID del paciente debe ser un número entero')
      .custom(async (value) => {
        const paciente = await Paciente.findByPk(value);
        if (!paciente) {
          return Promise.reject('El paciente seleccionado no existe');
        } else if (!paciente.activo) {
          return Promise.reject('El paciente no esta disponible para esta accion');
        }
      }),
    body('nombre').if((value, { req }) => req.query.modo === 'emergencia').optional({ checkFalsy: true }),
    body('sexo').if((value, { req }) => req.query.modo === 'emergencia'),
    body('apellido').if((value, { req }) => req.query.modo === 'emergencia').optional({ checkFalsy: true }).trim(),
    body('fecha_nacimiento').if((value, { req }) => req.query.modo === 'emergencia').optional({ checkFalsy: true }).trim(),
    body('nro_doc').if((value, { req }) => req.query.modo === 'emergencia').optional({ checkFalsy: true }).trim(),
    body('tipo_doc').if((value, { req }) => req.query.modo === 'emergencia').optional({ checkFalsy: true })
      .isIn(['DNI', 'Pasaporte', 'Cédula']).withMessage('Tipo de documento no válido.'),
  ];
};

exports.setActivoAdmisionValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};

exports.setEstadoAdmisionValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('estado')
      .notEmpty().withMessage('El estado de admisión es obligatorio')
      .isIn(['Alta Medica', 'Cancelada']).withMessage('El estado de admisión no es valido'),
  ];
};

exports.cambiarCamaValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('cama_id')
      .notEmpty().withMessage('El ID de la cama es obligatorio.')
      .isInt().withMessage('El ID de la cama debe ser un número entero.')
      .custom(async (value, { req }) => {
        const cama = await Cama.findByPk(value);
        if (!cama) return Promise.reject('La cama seleccionado no existe.');
        if (!cama.activo) return Promise.reject('La cama no esta disponible');
      }),

  ];
};

exports.atenderAdmisionValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('cama_id')
      .notEmpty().withMessage('El ID de la cama es obligatorio.')
      .isInt().withMessage('El ID de la cama debe ser un número entero.')
      .custom(async (value, { req }) => {
        const cama = await Cama.findByPk(value);
        if (!cama) return Promise.reject('La cama seleccionado no existe.');
        if (!cama.activo) return Promise.reject('La cama no esta disponible');
      }),

  ];
};