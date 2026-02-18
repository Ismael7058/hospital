const { body, param } = require('express-validator');
const { ViaAdministracion} = require('../db/models');


exports.registrarMedicacionValidation = () => {
  return [
    body('admision_id')
      .notEmpty().withMessage('El ID de la admision es obligatoria.')
      .isInt().withMessage('El ID de la admision debe ser un número entero'),
    body('medicamento')
      .trim()
      .not().isEmpty().withMessage('El medicamento es obligatorio.')
      .isLength({ min: 3 }).withMessage('El medicamento debe tener al menos 3 caracteres.'),
    body('dosis')
      .trim()
      .not().isEmpty().withMessage('La dosis es obligatoria.'),
    body('intervalo_horas')
      .notEmpty().withMessage('El intervalo de horas es obligatorio'),
    body('fecha_inicio')
      .notEmpty().withMessage('La fecha de inicio es obligatoria')
      .isISO8601().withMessage('La fecha de inicio no es válida'),
    body('indicaciones')
      .optional({ checkFalsy: true })
      .trim(),
    body('via_administracion_id')
      .notEmpty().withMessage('La via de administracion es obligatoria')
      .isInt().withMessage('El ID de la via de administracion debe ser un número entero')
      .custom(async (value, { req }) => {
        const via = await ViaAdministracion.findByPk(value);
        if (!via) {
          return Promise.reject('La via de administracion seleccionada no existe');
        } else if (!via.activo) {
          return Promise.reject('La via de administracion no esta disponible para esta accion');
        }
      })
  ];
};

exports.setActivoValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};

exports.setEstadoValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('estado')
      .notEmpty().withMessage('El estado de admisión es obligatorio')
      .isIn(['Suministrar', 'Suspendido', 'Cancelado']).withMessage('El estado de la medicacion no es valido'),
  ];
};
