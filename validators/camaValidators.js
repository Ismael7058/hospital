const { body, param } = require('express-validator');
const { Habitacion } = require('../db/models');

exports.registerCamaValidation = () => {
    return [
        body('codigo')
            .trim()
            .notEmpty().withMessage('El código de la cama es obligatorio.')
            .isAlphanumeric().withMessage('El código solo puede contener letras y números.')
            .isLength({ min: 4, max: 10 }).withMessage('El código debe tener entre 4 y 10 caracteres.'),
        body('habitacion_id')
            .notEmpty().withMessage('La habitación es obligatoria.')
            .isInt().withMessage('El ID de la habitación debe ser un número entero.')
            .custom(async (value) => {
                const habitacion = await Habitacion.findByPk(value);
                if (!habitacion) {
                    return Promise.reject('La habitación seleccionada no existe.');
                } else if (!habitacion.activo) {
                    return Promise.reject('No se puede registrar la cama en una habitacion inactiva.');
                }
            }),
    ];
};

exports.editCamaValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('codigo')
            .trim()
            .notEmpty().withMessage('El código de la cama es obligatorio.')
            .isAlphanumeric().withMessage('El código solo puede contener letras y números.')
            .isLength({ min: 4, max: 10 }).withMessage('El código debe tener entre 4 y 10 caracteres.'),
    ];
};

exports.moverCamaValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('habitacion_id')
            .notEmpty().withMessage('La habitación es obligatoria.')
            .isInt().withMessage('El ID de la habitación debe ser un número entero.')
            .custom(async (value) => {
                const habitacion = await Habitacion.findByPk(value);
                if (!habitacion) {
                    return Promise.reject('La habitación seleccionada no existe.');
                } else if (!habitacion.activo) {
                    return Promise.reject('No se puede registrar la cama en una habitacion inactiva.');
                }
            }),
    ];
};

exports.setEstadoCamaValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('estado')
            .notEmpty().withMessage('El estado es obligatorio.')
            .isIn(['Libre', 'Ocupado', 'Higienizando'])
            .withMessage('El estado debe ser Libre, Ocupado o Higienizando.'),
    ];
};

exports.setActivoCamaValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('activo').isBoolean().withMessage('El activo debe ser un valor booleano (true o false).'),
    ];
};

exports.getCamaValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
    ];
};