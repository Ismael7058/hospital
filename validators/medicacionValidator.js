const { body } = require('express-validator');
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
    body('descripcion')
      .trim()
      .not().isEmpty().withMessage('La descripcion es obligatoria.')
      .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.'),
    body('intervalo_horas')
      .notEmpty().withMessage('El intervalo de horas es obligatorio')
      .isInt({ min: 1 }).withMessage('El intervalo de horas debe ser un número entero y mayor a 1'),
    body('via_administracion_id')
      .notEmpty().withMessage('La via de ingreso es obligatoria')
      .isInt().withMessage('El ID de la via de ingreso debe ser un número entero')
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