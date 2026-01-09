const { Paciente, Nacionalidad, Identificacion, sequelize } = require('../db/models');
const { Op } = require('sequelize');


exports.registerPaciente = async (pacienteData) => {
    const t = await sequelize.transaction();
    try {
        const { nombre, apellido, fecha_nacimiento, sexo, email, telefono, direccion, nacionalidades, identificaciones } = pacienteData;

        // Crear el paciente
        const nuevoPaciente = await Paciente.create({
            nombre,
            apellido,
            fecha_nacimiento,
            sexo,
            email: email || null, // Guardar null si el email está vacío
            telefono,
            direccion,
            activo: true
        }, { transaction: t });

        // Asociar nacionalidades
        const nacionalidadesData = JSON.parse(nacionalidades);
        const nacionalidadIds = nacionalidadesData.map(n => n.value);
        await nuevoPaciente.addNacionalidades(nacionalidadIds, { transaction: t });

        // Crear identificaciones
        const identificacionesParaCrear = identificaciones.map(doc => ({
            ...doc,
            paciente_id: nuevoPaciente.id
        }));
        await Identificacion.bulkCreate(identificacionesParaCrear, { transaction: t });


        await t.commit();

        return nuevoPaciente;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

exports.setActivo = async (id, estado) => {
    const paciente = await Paciente.findByPk(id);
    if (!paciente) {
        throw new Error('Paciente no encontrado');
    }

    if (paciente.activo === estado) {
        throw new Error(`El paciente ya se encuentra ${estado ? 'activo' : 'inactivo'}.`);
    }

    paciente.activo = estado;
    await paciente.save();
    return paciente;
}

exports.editInformacion = async (id, datosModificados) => {
    const t = await sequelize.transaction();
    try {
        const { nombre, apellido, fecha_nacimiento, sexo, email, telefono, direccion, nacionalidades } = datosModificados;

        const paciente = await Paciente.findByPk(id, { transaction: t });
        if (!paciente) {
            throw new Error('Paciente no encontrado');
        }

        await paciente.update({
            nombre,
            apellido,
            fecha_nacimiento,
            sexo,
            email: email || null,
            telefono,
            direccion,
        }, { transaction: t });

        // Actualizar Nacionalidades (reemplazar las existentes)
        if (nacionalidades) {
            const nacionalidadesData = JSON.parse(nacionalidades);
            const nacionalidadIds = nacionalidadesData.map(n => n.value);
            await paciente.setNacionalidades(nacionalidadIds, { transaction: t });
        }

        await t.commit();

        return paciente;
    } catch (error) {
        await t.rollback();
        throw new Error('Error al intentar modificar al paciente');;
    }
}

exports.editIdentificacion = async (id, identificaciones) => {
    const t = await sequelize.transaction();
    try {
        const paciente = await Paciente.findByPk(id, { transaction: t });
        if (!paciente) {
            throw new Error('Paciente no encontrado');
        }

        // Eliminar identificaciones anteriores
        await Identificacion.destroy({ where: { paciente_id: id }, transaction: t });

        // Crear las nuevas
        const identificacionesParaCrear = identificaciones.map(doc => ({
            ...doc,
            paciente_id: id
        }));
        await Identificacion.bulkCreate(identificacionesParaCrear, { transaction: t });

        await t.commit();
        return paciente;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

exports.buscarPacientes = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 3) {
        return [];
    }
    const pacientes = await Paciente.findAll({
        where: {
            [Op.and]: [
                { activo: true },
                {
                    [Op.or]: [
                        { nombre: { [Op.iLike]: `%${searchTerm}%` } },
                        { apellido: { [Op.iLike]: `%${searchTerm}%` } },
                        { '$identificaciones.nro_doc$': { [Op.iLike]: `%${searchTerm}%` } }
                    ]
                }
            ]
        },
        include: [{
            model: Identificacion,
            as: 'identificaciones',
            attributes: ['tipo_doc', 'nro_doc']
        }],
        limit: 10,
        subQuery: false,
        attributes: ['id', 'nombre', 'apellido'],
        order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });

    return pacientes;
}