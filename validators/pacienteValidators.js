const { body, param } = require('express-validator');
const { Paciente, Nacionalidad, Identificacion } = require('../db/models');

exports.registrarPacienteValidation = () => {
  return [
    // --- Información Personal ---
    body('nombre', 'El nombre es obligatorio')
      .not().isEmpty().withMessage('El nombre es obligatorio')
      .trim()
      .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo debe contener letras y espacios'),
    body('apellido', 'El apellido es obligatorio')
      .not().isEmpty().withMessage('El apellido es obligatorio')
      .trim()
      .isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo debe contener letras y espacios'),
    body('fecha_nacimiento', 'La fecha de nacimiento no es válida')
      .not().isEmpty().withMessage('La fecha de nacimiento es obligatoria.')
      .isISO8601().toDate(),
    body('sexo', 'El sexo es obligatorio')
      .not().isEmpty().withMessage('El sexo es obligatorio.')
      .isIn(['Masculino', 'Femenino']).withMessage('El sexo debe ser Masculino o Femenino.'),
    body('email', 'Por favor, ingrese un email válido')
      .optional({ checkFalsy: true })
      .isEmail().withMessage('El formato del correo electrónico no es válido.')
      .normalizeEmail(),
    body('telefono').optional({ checkFalsy: true }).trim(),
    body('direccion').optional({ checkFalsy: true }).trim(),

    // --- Nacionalidades (Tagify) ---
    body('nacionalidades')
      .custom(async (value) => {
        if (!value) {
          throw new Error('Debe seleccionar al menos una nacionalidad.');
        }
        try {
          const nacionalidades = JSON.parse(value);
          if (!Array.isArray(nacionalidades) || nacionalidades.length === 0) {
            throw new Error('Debe seleccionar al menos una nacionalidad.');
          }
          // Validar que todos los IDs de nacionalidad existan en la BD
          const ids = nacionalidades.map(n => n.value);
          const count = await Nacionalidad.count({ where: { id: ids } });
          if (count !== ids.length) {
            throw new Error('Una o más nacionalidades seleccionadas no son válidas.');
          }
        } catch (e) {
          throw new Error('El formato de las nacionalidades no es válido.');
        }
        return true;
      }),

    // --- Identificaciones (Campos dinámicos) ---
    body('identificaciones').isArray({ min: 1 }).withMessage('Debe proporcionar al menos un documento de identificación.'),
    body('identificaciones.*.tipo_doc', 'El tipo de documento es obligatorio.')
      .not().isEmpty()
      .isIn(['DNI', 'Pasaporte', 'Cédula']).withMessage('Tipo de documento no válido.'),
    // Validar el nro_doc según el tipo_doc
    body('identificaciones.*').custom((doc, { req }) => {
      const { tipo_doc, nro_doc } = doc;

      if (!nro_doc) {
        throw new Error('El número de documento es obligatorio.');
      }

      switch (tipo_doc) {
        case 'DNI':
          if (!/^\d{8}$/.test(nro_doc)) {
            throw new Error('El DNI debe contener exactamente 8 dígitos numéricos.');
          }
          break;
        case 'Pasaporte':
          if (!/^[a-zA-Z0-9]{6,9}$/.test(nro_doc)) {
            throw new Error('El Pasaporte debe ser alfanumérico y tener entre 6 y 9 caracteres.');
          }
          break;
        case 'Cédula':
          if (!/^\d{7,11}$/.test(nro_doc)) {
            throw new Error('La Cédula debe contener entre 7 y 11 dígitos numéricos.');
          }
          break;
      }
      return true;
    }),
    body('identificaciones').custom((identificaciones) => {
      const uniqueDocs = new Set(identificaciones.map(doc => `${doc.tipo_doc}-${doc.nro_doc}`));
      if (uniqueDocs.size !== identificaciones.length) {
        throw new Error('No puede registrar el mismo documento de identificación más de una vez.');
      }
      return true;
    }),
    // Validar que no se repita el tipo de documento en el mismo formulario
    body('identificaciones').custom((identificaciones) => {
      if (Array.isArray(identificaciones)) {
        const tiposDeDoc = identificaciones.map(doc => doc.tipo_doc);
        const uniqueTipos = new Set(tiposDeDoc);
        if (uniqueTipos.size !== tiposDeDoc.length) {
          throw new Error('No puede registrar más de un documento del mismo tipo para un paciente.');
        }
      }
      return true;
    }),
    // Validar que los documentos no existan ya en la base de datos
    body('identificaciones').custom(async (identificaciones) => {
      for (const doc of identificaciones) {
        if (doc.tipo_doc && doc.nro_doc) {
          const existente = await Identificacion.findOne({
            where: { tipo_doc: doc.tipo_doc, nro_doc: doc.nro_doc }
          });
          if (existente) {
            return Promise.reject(`El documento ${doc.tipo_doc} ${doc.nro_doc} ya está registrado.`);
          }
        }
      }
    }),
  ];
};

exports.setActivoPacienteValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    body('activo').isBoolean().withMessage('El activo debe ser un valor booleano (true o false).'),
  ];
};

exports.editInformacionPacienteValidation = () => {
  return[
    // --- Información Personal ---
    body('nombre', 'El nombre es obligatorio')
      .not().isEmpty().withMessage('El nombre es obligatorio')
      .trim()
      .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo debe contener letras y espacios'),
    body('apellido', 'El apellido es obligatorio')
      .not().isEmpty().withMessage('El apellido es obligatorio')
      .trim()
      .isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo debe contener letras y espacios'),
    body('fecha_nacimiento', 'La fecha de nacimiento no es válida')
      .not().isEmpty().withMessage('La fecha de nacimiento es obligatoria.')
      .isISO8601().toDate(),
    body('sexo', 'El sexo es obligatorio')
      .not().isEmpty().withMessage('El sexo es obligatorio.')
      .isIn(['Masculino', 'Femenino']).withMessage('El sexo debe ser Masculino o Femenino.'),
    body('email', 'Por favor, ingrese un email válido')
      .optional({ checkFalsy: true })
      .isEmail().withMessage('El formato del correo electrónico no es válido.')
      .normalizeEmail(),
    body('telefono').optional({ checkFalsy: true }).trim(),
    body('direccion').optional({ checkFalsy: true }).trim(),
    // --- Nacionalidades (Tagify) ---
    body('nacionalidades')
      .custom(async (value) => {
        if (!value) {
          throw new Error('Debe seleccionar al menos una nacionalidad.');
        }
        try {
          const nacionalidades = JSON.parse(value);
          if (!Array.isArray(nacionalidades) || nacionalidades.length === 0) {
            throw new Error('Debe seleccionar al menos una nacionalidad.');
          }
          // Validar que todos los IDs de nacionalidad existan en la BD
          const ids = nacionalidades.map(n => n.value);
          const count = await Nacionalidad.count({ where: { id: ids } });
          if (count !== ids.length) {
            throw new Error('Una o más nacionalidades seleccionadas no son válidas.');
          }
        } catch (e) {
          throw new Error('El formato de las nacionalidades no es válido.');
        }
        return true;
      }),
  ]
};

exports.editIdentificacionPacienteValidation = () => {
  return [
    param('id').isInt().withMessage('El ID debe ser un número entero.'),
    
    body('identificaciones').isArray({ min: 1 }).withMessage('Debe proporcionar al menos un documento de identificación.'),
    body('identificaciones.*.tipo_doc', 'El tipo de documento es obligatorio.')
      .not().isEmpty()
      .isIn(['DNI', 'Pasaporte', 'Cédula']).withMessage('Tipo de documento no válido.'),
    
    // Validar el nro_doc según el tipo_doc
    body('identificaciones.*').custom((doc, { req }) => {
      const { tipo_doc, nro_doc } = doc;

      if (!nro_doc) {
        throw new Error('El número de documento es obligatorio.');
      }

      switch (tipo_doc) {
        case 'DNI':
          if (!/^\d{8}$/.test(nro_doc)) {
            throw new Error('El DNI debe contener exactamente 8 dígitos numéricos.');
          }
          break;
        case 'Pasaporte':
          if (!/^[a-zA-Z0-9]{6,9}$/.test(nro_doc)) {
            throw new Error('El Pasaporte debe ser alfanumérico y tener entre 6 y 9 caracteres.');
          }
          break;
        case 'Cédula':
          if (!/^\d{7,11}$/.test(nro_doc)) {
            throw new Error('La Cédula debe contener entre 7 y 11 dígitos numéricos.');
          }
          break;
      }
      return true;
    }),
    
    body('identificaciones').custom((identificaciones) => {
      const uniqueDocs = new Set(identificaciones.map(doc => `${doc.tipo_doc}-${doc.nro_doc}`));
      if (uniqueDocs.size !== identificaciones.length) {
        throw new Error('No puede registrar el mismo documento de identificación más de una vez.');
      }
      return true;
    }),
    
    body('identificaciones').custom((identificaciones) => {
      if (Array.isArray(identificaciones)) {
        const tiposDeDoc = identificaciones.map(doc => doc.tipo_doc);
        const uniqueTipos = new Set(tiposDeDoc);
        if (uniqueTipos.size !== tiposDeDoc.length) {
          throw new Error('No puede registrar más de un documento del mismo tipo para un paciente.');
        }
      }
      return true;
    })
  ];
};