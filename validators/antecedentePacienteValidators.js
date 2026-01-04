const { body, param } = require('express-validator');
const { Paciente, TiposAtencedentes, FuentesInformacion, AntecedentePaciente } = require('../db/models');

exports.registerAntecedentePacienteValidation = () => {
  return [
    body('descripcion')
      .trim()
      .not().isEmpty().withMessage('La descripcion es obligatoria')
      .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.'),
    body('observaciones')
      .trim()
      .optional({ checkFalsy: true })
      .isLength({ min: 3 }).withMessage('La observacion debe tener al menos 3 caracteres.'),
    body('validado')
      .isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
    body('fuente_informacion_id')
      .notEmpty().withMessage('La fuente de informacion es obligatoria')
      .isInt().withMessage('El ID de la fuente de informacion debe ser un número entero')
      .custom(async (value) => {
        const fuente = await FuentesInformacion.findByPk(value);
        if (!fuente) {
          return Promise.reject('La fuente de informacion seleccionada no existe');
        } else if (!fuente.activo) {
          return Promise.reject('No se puede asociar un antecedente de un paciente con una fuente de informacion inactiva');
        }
      }),
    body('paciente_id')
      .notEmpty().withMessage('El paciente es obligatorio')
      .isInt().withMessage('El ID del paciente debe ser un número entero')
      .custom(async (value) => {
        const paciente = await Paciente.findByPk(value);
        if (!paciente) {
          return Promise.reject('El paciente seleccionado no existe');
        } else if (!paciente.activo) {
          return Promise.reject('No se puede asociar un antecedente a un paciente inactivo');
        }
      }),
    body('tipo_antecedente_id')
      .notEmpty().withMessage('El tipo de antecedente es obligatorio')
      .isInt().withMessage('El ID del tipo de antecedente debe ser un número entero')
      .custom(async (value) => {
        const tipoAntecedente = await TiposAtencedentes.findByPk(value);
        if (!tipoAntecedente) {
          return Promise.reject('El tipo de antecedente seleccionado no existe');
        } else if (!tipoAntecedente.activo) {
          return Promise.reject('No se puede asociar un antecedente a un tipo de antecedente inactivo');
        }
      }),
  ];
};

exports.editAntecedentePacienteValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('descripcion')
      .trim()
      .not().isEmpty().withMessage('La descripcion es obligatoria')
      .isLength({ min: 3 }).withMessage('La descripcion debe tener al menos 3 caracteres.'),
    body('observaciones')
      .trim()
      .optional({ checkFalsy: true })
      .isLength({ min: 3 }).withMessage('La observacion debe tener al menos 3 caracteres.'),
    body('validado')
      .isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};

exports.validarAntecedentePacienteValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('validado')
      .isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
  ];
};

exports.setActivoAntecedentePacienteValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo')
      .isBoolean().withMessage('El estado debe ser un valor booleano (true o false).')
      .custom(async (value, { req }) => {
        if (value === true) {
          const antecedente = await AntecedentePaciente.findByPk(req.params.id);
          if (!antecedente) {
            return Promise.reject('El antecedente no existe');
          }

          const paciente = await Paciente.findByPk(antecedente.paciente_id);
          if (!paciente || !paciente.activo) return Promise.reject('No se puede activar el antecedente porque el paciente asociado está inactivo.');

          const tipo = await TiposAtencedentes.findByPk(antecedente.tipo_antecedente_id);
          if (!tipo || !tipo.activo) return Promise.reject('No se puede activar el antecedente porque el tipo de antecedente asociado está inactivo.');

          const fuente = await FuentesInformacion.findByPk(antecedente.fuente_informacion_id);
          if (!fuente || !fuente.activo) return Promise.reject('No se puede activar el antecedente porque la fuente de información asociada está inactiva.');
        }
      }),
  ];
};

exports.idAntecedentePacienteValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
  ];
};
