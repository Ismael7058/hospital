const { body, param } = require('express-validator');
const { Ala } = require('../db/models');

exports.registerHabitacionValidation = () => {
    return [
        body('numero')
            .trim()
            .notEmpty().withMessage('El número de habitación es obligatorio.')
            .isLength({ min: 4 }).withMessage('El número de habitación debe tener al menos 4 caracteres.'),
        body('capacidad')
            .notEmpty().withMessage('La capacidad es obligatoria.')
            .isInt({ min: 1, max: 2 }).withMessage('La capacidad debe ser un número entre 1 y 2.'),
        body('descripcion')
            .trim()
            .notEmpty().withMessage('La descripción es obligatoria.')
            .isLength({ min: 5 }).withMessage('La descripción debe tener al menos 5 caracteres.'),
        body('ala_id')
            .notEmpty().withMessage('El ala es obligatoria.')
            .isInt().withMessage('El ID de ala debe ser un número entero.')
            .custom(async (value) => {
                const ala = await Ala.findByPk(value);
                if (!ala) {
                    return Promise.reject('El ala seleccionada no existe.');
                } else if (!ala.activo) {
                    return Promise.reject('No se puede registrar la habitación en un ala inactiva.');
                }
            }),
    ];
};

exports.editHabitacionValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('numero')
            .trim()
            .notEmpty().withMessage('El número de habitación es obligatorio.')
            .isLength({ min: 4 }).withMessage('El número de habitación debe tener al menos 4 caracteres.'),
        body('capacidad')
            .notEmpty().withMessage('La capacidad es obligatoria.')
            .isInt({ min: 1, max: 2 }).withMessage('La capacidad debe ser un número entre 1 y 2.'),
        body('descripcion')
            .trim()
            .notEmpty().withMessage('La descripción es obligatoria.')
            .isLength({ min: 5 }).withMessage('La descripción debe tener al menos 5 caracteres.'),
    ];
};

exports.moverHabitacionValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('ala_id')
            .notEmpty().withMessage('El ala es obligatoria.')
            .isInt().withMessage('El ID de ala debe ser un número entero.')
            .custom(async (value) => {
                const ala = await Ala.findByPk(value);
                if (!ala) {
                    return Promise.reject('El ala seleccionada no existe.');
                } else if (!ala.activo) {
                    return Promise.reject('No se puede mover la habitación a un ala inactiva.');
                }
            }),
    ];
};

exports.setActivoHabitacionValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
        body('activo').isBoolean().withMessage('El activo debe ser un valor booleano (true o false).'),
    ];
};

exports.getHabitacionValidation = () => {
    return [
        param('id').isInt().withMessage('El ID debe ser un número entero.'),
    ];
};
