const { PacienteSeguro, Paciente } = require('../db/models');
const { adaptarFecha } = require('../helper/fecha')

exports.registrarPacienteSeguro = async (datosPacienteSeguro) => {
    const { paciente_id, seguro_medico_id, nro_afiliado, fecha_vigencia, fecha_expiracion } = datosPacienteSeguro;

    const seguroExiste = await PacienteSeguro.findOne({
        where: {
            paciente_id,
            nro_afiliado,
            seguro_medico_id,
            activo: true
        }
    });
    if (seguroExiste) {
        throw new Error ('El paciente ya tiene este seguro médico activo.');
    }

    const nuevo = await PacienteSeguro.create({
        paciente_id,
        seguro_medico_id,
        nro_afiliado,
        fecha_vigencia,
        fecha_expiracion,
        activo: true
    });
    return nuevo;
};

exports.renovarPacienteSeguro = async (id, datosModificados) => {
    const { fecha_expiracion } = datosModificados;

    const seguroPaciente = await PacienteSeguro.findByPk(id, { include: [{ model: Paciente}]});
    if (!seguroPaciente) {
      throw new Error ('Seguro del paciente no encontrado' );
    }
    if (!seguroPaciente.Paciente.activo) {
      throw new Error ('Paciente no disponible, no puede modificar sus seguros medicos' );
    }

    if (adaptarFecha(seguroPaciente.fecha_vigencia) >= adaptarFecha(fecha_expiracion)) {
      throw new Error ('La fecha de expiracion debe ser mayor a la fecha de vigencia' );
    };

    await seguroPaciente.update({
        fecha_expiracion
    });
    return seguroPaciente;
};

exports.setActivo = async (id, activo) => {
    const seguroPaciente = await PacienteSeguro.findByPk(id);
    if (!seguroPaciente) {
      throw new Error ('Seguro del paciente no encontrado' );
    }

    if (seguroPaciente.activo === activo) {
        throw new Error(`La especialidad ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
    }

    await seguroPaciente.update({ activo });
    return seguroPaciente;
};