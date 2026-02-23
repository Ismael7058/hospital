const { Ala, sequelize, Cama, Habitacion } = require('../db/models');
const { Op } = require('sequelize');

exports.registerAla = async (alaData) => {
    const ala = await Ala.findOne({ where: { nombre: alaData.nombre } });
    if (ala) {
        throw new Error('El nombre ya está en uso');
    }

    const datosParaCrear = {
        ...alaData,
        estado: 'Libre',
        activo: true
    }

    try {
        const newAla = await Ala.create(datosParaCrear);
        return newAla;
    } catch (error) {
        throw error;
    }
}

exports.editAla = async (id, datosActualizados) => {
    const ala = await Ala.findByPk(id);
    if (!ala) {
        throw new Error('Ala no encontrada');
    }

    const nombreUsado = await Ala.findOne( { where: { nombre: datosActualizados.nombre } });
    if (nombreUsado && nombreUsado.id !== id){
        throw new Error('El nombre ya está en uso');
    }

    ala.nombre = datosActualizados.nombre;
    await ala.save();
    return ala;
}

exports.setActivo = async (id, activo) => {
    try {
        const resultado = await sequelize.transaction(async (t) => {
            const ala = await Ala.findByPk(id, { transaction: t });
            if (!ala) {
                throw new Error('Ala no encontrada');
            }

            if (ala.activo === activo) {
                throw new Error(`El ala ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
            }

            if (!activo) {
                const camasEstado = await Cama.count({
                    include: [{
                        model: Habitacion,
                        as: 'habitacion',
                        required: true,
                        where: { ala_id: id },
                        attributes: []
                    }],
                    where: { estado: { [Op.ne]: 'Libre' } },
                    transaction: t
                });

                if (camasEstado > 0) {
                    throw new Error('No se puede desactivar el ala porque tiene camas ocupadas.');
                }

                // Desactivar en cascada: Camas y luego Habitaciones
                const habitacionIds = await Habitacion.findAll({ where: { ala_id: id }, attributes: ['id'], raw: true, transaction: t });
                const ids = habitacionIds.map(h => h.id);
                await Cama.update({ activo: false }, { where: { habitacion_id: ids }, transaction: t });
                await Habitacion.update({ activo: false }, { where: { ala_id: id }, transaction: t });
            }

            ala.activo = activo;
            await ala.save({ transaction: t });
            return ala;
        });
        return resultado;
    } catch (error) {
        throw error;
    }
}

exports.getListarAlas = async (pagina, porPagina) => {
    const offset = (pagina - 1) * porPagina;

    const { count, rows: alas } = await Ala.findAndCountAll({
        attributes: {
            include: [
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "Habitaciones" AS h
                        WHERE h.ala_id = "Ala".id
                    )`),
                    'cantidadHabitaciones'
                ]
            ]
        },
        order: [['nombre', 'ASC']],
        limit: porPagina,
        offset: offset,
        distinct: true
    });
    return {
        alas,
        totalRegistros: count
    };
};

exports.getAlas = async (nombre) => {
    try {
        const alas = await Ala.findAll({
            where: {
                nombre: { [Op.iLike]: `%${nombre}%`},
                activo: true
            },
            limit: 10,
            attributes: ['id', 'nombre']
        });

        return alas;
    } catch (error) {
        throw new Error('Error al realizar la búsqueda de las alas.');
    }
}

exports.alasDisponibles = async (sexo = null) => {
  const whereHabitacion = {
    activo: true
  }

  const op_and = [];

  op_and.push(sequelize.literal(
    `
    EXISTS (
      SELECT 1
      FROM "Camas" AS "Cama"
      WHERE "Cama"."habitacion_id" = "habitaciones"."id"
      AND "Cama"."activo" = true
      AND "Cama"."estado" = 'Libre'
    )
    `
  ))

  if (sexo) {
    op_and.push(sequelize.literal(
    `
      NOT EXISTS (
        SELECT 1
        FROM "Camas" AS "CamaOcupada"
        INNER JOIN "Ubicaciones_Internacion" AS "UI" ON "UI"."cama_id" = "CamaOcupada"."id"
        INNER JOIN "Admisiones" AS "Admision" ON "UI"."admision_id" = "Admision"."id"
        INNER JOIN "Pacientes" AS "Paciente" ON "Admision"."paciente_id" = "Paciente"."id"
        WHERE "CamaOcupada"."habitacion_id" = "habitaciones"."id"
        AND "CamaOcupada"."estado" != 'Libre'
        AND "UI"."fecha_hora_liberacion" IS NULL
        AND "Paciente"."sexo" != ${sequelize.escape(sexo)}
      )
    `
    ));
  }

  whereHabitacion[Op.and] = op_and;

  const alas = await Ala.findAll({
      where: {
          activo: true
      },
      limit: 10,
      attributes: ['id', 'nombre'],
      include: [
        {
          model: Habitacion,
          as: 'habitaciones',
          where: whereHabitacion
        }
      ]
  });

  return alas;

};
