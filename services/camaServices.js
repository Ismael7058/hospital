const { Cama, Habitacion, Ala, HistorialHigienizacion, sequelize } = require('../db/models');
const { Op } = require('sequelize');

exports.registerCama = async (camaData) => {
    try {
        const codigoUsado = await Cama.findOne({ where: { codigo: camaData.codigo } });
        if (codigoUsado) {
            throw new Error('El codigo ya está en uso');
        }

        const habitacion = await Habitacion.findByPk(camaData.habitacion_id);

        if (!habitacion) {
            throw new Error('La habitación especificada no existe.');
        }

        const countCamas = await Cama.count({
            where: {
                habitacion_id: camaData.habitacion_id, 
                activo: true
            }
        });

        if (countCamas >= habitacion.capacidad) {
            throw new Error(`La habitación ya ha alcanzado su capacidad máxima de camas.`);
        }

        const datosParaCrear = {
            codigo: camaData.codigo,
            habitacion_id: camaData.habitacion_id,
            estado: 'Libre',
            activo: true
        }

        const newCama = await Cama.create(datosParaCrear);
        return newCama;
    } catch (error) {
        throw error;
    }
}

exports.getListarCamas = async (filtros, pagina, porPagina) => {
    const whereCama = {};
    if (filtros.codigo) whereCama.codigo = { [Op.iLike]: `%${filtros.codigo}%` };
    if (filtros.estado) whereCama.estado = filtros.estado;
    if (filtros.activo !== '') whereCama.activo = filtros.activo === 'true';

    const whereHabitacion = {};
    if (filtros.habitacion_id) whereHabitacion.id = filtros.habitacion_id;
    if (filtros.ala_id) whereHabitacion.ala_id = filtros.ala_id;

    const { count, rows } = await Cama.findAndCountAll({
        where: whereCama,
        include: [{
            model: Habitacion,
            as: 'habitacion',
            where: Object.keys(whereHabitacion).length > 0 ? whereHabitacion : null,
            required: Object.keys(whereHabitacion).length > 0,
            include: [{
                model: Ala,
                as: 'ala',
                attributes: ['nombre']
            }]
        }],
        limit: porPagina,
        offset: (pagina - 1) * porPagina,
        order: [['codigo', 'ASC']],
        distinct: true
    });

    return {
        camas: rows,
        totalRegistros: count
    };
};

exports.editCama = async(id, datosActualizados) => {
    try {
        const cama = await Cama.findByPk(id);
        if (!cama) {
            throw new Error('Cama no encontrada');
        }

        const codigoUsado = await Cama.findOne({ where: { codigo: datosActualizados.codigo } });
        if (codigoUsado && codigoUsado.id != id) {
            throw new Error('El codigo ya está en uso');
        }

        cama.codigo = datosActualizados.codigo;
        await cama.save();
        return cama;
    } catch (error) {
        throw error;
    }
}

exports.moverCama= async (id, habitacion_id) => {
    try {
        const cama = await Cama.findByPk(id);
        if (!cama) {
            throw new Error('Cama no encontrada');
        }

        if (cama.habitacion_id == habitacion_id) {
            throw new Error('La cama ya se encuentra en esta habitación.');
        }

        const nuevaHabitacion = await Habitacion.findByPk(habitacion_id);
        if (!nuevaHabitacion) {
            throw new Error('La habitación de destino no existe.');
        }

        const countCamas = await Cama.count({
            where: {
                habitacion_id: habitacion_id,
                activo: true
            },
        });

        if (countCamas >= nuevaHabitacion.capacidad) {
            throw new Error('La habitación de destino ya ha alcanzado su capacidad máxima de camas.');
        }

        cama.habitacion_id = habitacion_id;
        await cama.save();
        return cama;
    } catch (error) {
        throw error;
    }
}

exports.setEstado = async (idCama, idUsuario, estado) => {
    try {
        const resultado = await sequelize.transaction(async (t) => {
            const cama = await Cama.findByPk(idCama, { transaction: t });
            if (!cama) {
                throw new Error('Cama no encontrada');
            }

            if (cama.estado === estado) {
                throw new Error('La cama ya se encuentra en ese estado.');
            }

            cama.estado = estado;
            await cama.save({ transaction: t });

            if (estado === 'Higienizando'){
                await HistorialHigienizacion.create({
                    cama_id: idCama,
                    usuario_id: idUsuario,
                    fecha_hora: new Date()
                }, { transaction: t });
            }
            return cama;
        });
        return resultado;
    } catch (error) {
        throw error;
    }
}

exports.setActivo = async (id, activo) => {
    try {
        const cama = await Cama.findByPk(id);
        if (!cama) {
            throw new Error('Cama no encontrada');
        }

        if (cama.activo === activo) {
            throw new Error('La cama ya se encuentra en ese estado');
        }

        if (!activo && cama.estado !== 'Libre') {
            throw new Error('No se puede desactivar una cama que no esta libre.');
        }

        if (activo){
            const habitacion = await Habitacion.findByPk(cama.habitacion_id);
            if (!habitacion) {
                throw new Error('La habitación asociada a esta cama no existe.');
            }
            const countCamas = await Cama.count({
                where: {
                    habitacion_id: cama.habitacion_id,
                    activo: true
                },
            });
    
            if (countCamas >= habitacion.capacidad) {
                throw new Error('No se puede activar la cama. La habitación ya ha alcanzado su capacidad máxima de camas.');
            }
        }
        
        cama.activo = activo;
        await cama.save();
        return cama;
    } catch (error) {
        throw error;
    }
}

exports.getCama = async (id) => {
    const cama = await Cama.findByPk(id, {
        include: [{
            model: Habitacion,
            as: 'habitacion',
            attributes: ['id', 'numero', 'ala_id'],
            include: [{
                model: Ala,
                as: 'ala',
                attributes: ['id', 'nombre']
            }]
        }]
    });

    if (!cama) throw new Error('Cama no encontrada');
    return cama;
}

exports.getCamas = async (habitacion_id = null, estado = null) => {
  const where = {
    activo: true
  };

  if (habitacion_id) where.habitacion_id = habitacion_id;
  if (estado) where.estado = estado;

  const camas = await Cama.findAll({ where: where });
  return camas;
}