const { body } = require('express-validator');
const { Rol } = require('../db/models');

exports.registerUsuarioValidation = () => {
  return [
    body('email', 'Por favor, ingrese un email válido').isEmail().normalizeEmail(),

    body('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número.'),

    body('passwordConfirmation', 'Las contraseñas no coinciden')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('La confirmación de la contraseña no coincide con la contraseña');
        }
        return true;
      }),

    body('nombre', 'El nombre es obligatorio')
      .not().isEmpty().withMessage('El nombre es obligatorio')
      .trim()
      .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo debe contener letras y espacios'),

    body('apellido', 'El apellido es obligatorio')
      .not().isEmpty().withMessage('El apellido es obligatorio')
      .trim()
      .isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo debe contener letras y espacios'),

    body('dni', 'El DNI debe ser un número válido de 8 dígitos')
      .not().isEmpty().withMessage('El DNI es obligatorio')
      .trim().isInt().withMessage('El DNI debe contener solo números')
      .isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener 8 dígitos'),

    body('fecha_nacimiento', 'La fecha de nacimiento no es válida').isISO8601().toDate(),

    body('direccion', 'La dirección es obligatoria')
      .not().isEmpty().withMessage('La dirección es obligatoria')
      .trim(),

    body('rol_id', 'El rol no es válido').isInt().custom(async (value) => {
      const rol = await Rol.findByPk(value);
      if (!rol) {
        return Promise.reject('El rol seleccionado no existe.');
      }
    }),

    body('telefono', 'El teléfono es obligatorio').not().isEmpty().trim(),
    body('sexo', 'El sexo es obligatorio').not().isEmpty().trim(),
  ];
};