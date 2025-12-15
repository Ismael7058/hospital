const { Paciente, Nacionalidad, Identificacion, sequelize } = require('../db/models');


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