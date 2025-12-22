const { body, param } = require('express-validator');
const { Usuario } = require('../db/models');

exports.registrarAgendaValidation = () => {
    return [
        body('usuario_id')
            .notEmpty().withMessage('El usuario es obligatorio.')
            .isInt().withMessage('El ID de usuario debe ser un número entero.')
            .custom(async (value) => {
                const usuario = await Usuario.findByPk(value);
                if (!usuario) {
                    return Promise.reject('El usuario seleccionado no existe.');
                }
            }),
        body('fecha_inicio', 'La fecha de inicio no es válida').isISO8601(),
        body('fecha_fin', 'La fecha de fin no es válida').isISO8601(),
        body('fecha_fin').custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.fecha_inicio)) {
                throw new Error('La fecha de fin debe ser posterior a la fecha de inicio.');
            }
            return true;
        }),
        body('motivo')
            .optional({ checkFalsy: true })
            .trim()
            .isLength({ min: 3 }).withMessage('El motivo debe tener al menos 3 caracteres.'),
    ];
};

exports.editAgendaValidacion = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('fecha_inicio', 'La fecha de inicio no es válida').isISO8601(),
        body('fecha_fin', 'La fecha de fin no es válida').isISO8601(),
        body('fecha_fin').custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.fecha_inicio)) {
                throw new Error('La fecha de fin debe ser posterior a la fecha de inicio.');
            }
            return true;
        }),
        body('motivo')
            .optional({ checkFalsy: true })
            .trim()
            .isLength({ min: 3 }).withMessage('El motivo debe tener al menos 3 caracteres.'),
    ];
};

exports.setActivoAgendaValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('activo').isBoolean().withMessage('El estado debe ser un valor booleano (true o false).'),
    ];
};
