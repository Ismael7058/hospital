const { param, body } = require('express-validator');

exports.registrarPacienteSeguroValidation = () => {
    return [
        body('paciente_id')
            .notEmpty().withMessage('El ID del paciente es obligatorio')
            .isInt().withMessage('El ID del paciente debe ser un número entero'),
        
        body('seguro_medico_id')
            .notEmpty().withMessage('El ID del seguro médico es obligatorio')
            .isInt().withMessage('El ID del seguro médico debe ser un número entero'),

        body('nro_afiliado')
            .notEmpty().withMessage('El número de afiliado es obligatorio')
            .isLength({ max: 50 }).withMessage('El número de afiliado no puede exceder los 50 caracteres'),
        
        body('fecha_vigencia')
            .notEmpty().withMessage('La fecha de vigencia es obligatoria')
            .isDate().withMessage('Formato de fecha de vigencia inválido'),

        body('fecha_expiracion')
            .notEmpty().withMessage('La fecha de expiración es obligatoria')
            .isDate().withMessage('Formato de fecha de expiración inválido')
            .custom((value, { req }) => {
                if (new Date(value) <= new Date(req.body.fecha_vigencia)) {
                    throw new Error('La fecha de expiración debe ser posterior a la fecha de vigencia');
                }
                return true;
            }),
    ];
};

exports.renovarPacienteSeguroValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('fecha_expiracion')
            .notEmpty().withMessage('La fecha de expiración es obligatoria')
            .isDate().withMessage('Formato de fecha de expiración inválido')
            .custom((value) => {
                if (new Date(value) <= new Date()) {
                    throw new Error('La fecha de expiración debe ser posterior a la fecha de hoy');
                }
                return true;
            }),
    ]
};

exports.setActivoPacienteSeguroValidation = () =>{ 
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('activo').isBoolean().withMessage('El campo activo debe ser un booleano')
    ];
};
