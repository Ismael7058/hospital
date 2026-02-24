const { Admision, Paciente, ViaIngreso, Turno, Usuario, Rol, Identificacion, Ala, UbicacionInternacion, Cama, Habitacion, Especialidad, EvolucionMedica, EstudioSolicitado, SignosVitales, CuidadoPreliminar, Medicacion, ViaAdministracion } = require('../../db/models');
const { Op } = require('sequelize');

exports.admisionesAdministrador = async (req) => {
  const { fecha, estado_atencion, estado, activo, medico_id, paciente_id, via_ingreso_id, pagina = 1 } = req.query;
  const registrosPorPagina = 10;
  const offset = (pagina - 1) * registrosPorPagina;

  const whereClause = {};

  if (fecha) {
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1);
    whereClause.fecha_hora_ingreso = {
      [Op.gte]: fechaInicio,
      [Op.lt]: fechaFin
    };
  }

  if (estado_atencion) whereClause.estado_atencion = estado_atencion;
  if (estado) whereClause.estado = estado;
  if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

  const includeOptions = [
    { model: Usuario, as: 'medico_atencion', attributes: ['id', 'nombre', 'apellido'] },
    {
      model: Paciente,
      as: 'paciente',
      attributes: ['id', 'nombre', 'apellido'],
      include: [{ model: Identificacion, as: 'identificaciones', attributes: ['tipo_doc', 'nro_doc'] }]
    },
    { model: ViaIngreso, as: 'via_ingreso', attributes: ['id', 'nombre'] }
  ]

  if (medico_id) {
    includeOptions[0].where = { id: medico_id };
    includeOptions[0].required = true;
  }

  if (paciente_id) {
    includeOptions[1].where = { id: paciente_id };
    includeOptions[1].required = true;
  }

  if (via_ingreso_id) {
    includeOptions[2].where = {
      [Op.or]: [
        { id: via_ingreso_id }
      ]
    };
    includeOptions[2].required = true;
  }

  const { count, rows: admisiones } = await Admision.findAndCountAll({
    where: whereClause,
    include: includeOptions,
    order: [['fecha_hora_ingreso', 'DESC']],
    limit: registrosPorPagina,
    offset: offset,
    distinct: true
  });


  const medicoFiltro = obtenerMedicoFiltro(medico_id);

  const pacienteFiltro = await obtenerPacienteFiltro(paciente_id);

  // Via de Ingreso 
  let viaIngresoGD = await ViaIngreso.findOne({ where: { nombre: 'Guardia' } })

  let viaIngresoFiltro = await ViaIngreso.findAll();

  const totalPaginas = Math.ceil(count / registrosPorPagina);
  const filtros = { fecha, estado_atencion, estado, activo, medico_id, paciente_id, via_ingreso_id };

  Object.keys(filtros).forEach(key => {
    if (filtros[key] === undefined || filtros[key] === '') {
      delete filtros[key];
    }
  });

  const filtrosQuery = new URLSearchParams(filtros).toString();

  return {
    title: 'Listado de Admisiones',
    admisiones: admisiones,
    medicoFiltro: medicoFiltro,
    pacienteFiltro: pacienteFiltro,
    viaIngresoFiltro: viaIngresoFiltro,
    viaIngresoModal: viaIngresoGD,
    paginacion: {
      totalRegistros: count,
      totalPaginas: totalPaginas,
      paginaActual: parseInt(pagina),
    },
    filtros: filtros,
    filtrosQuery: filtrosQuery
  };
};

exports.admisionesRecepcion = async (req) => {
  const { fecha, estado_atencion, estado, medico_id, paciente_id, via_ingreso_id, pagina = 1 } = req.query;
  const registrosPorPagina = 10;
  const offset = (pagina - 1) * registrosPorPagina;

  const whereClause = { activo: true };

  if (fecha) {
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1);
    whereClause.fecha_hora_ingreso = {
      [Op.gte]: fechaInicio,
      [Op.lt]: fechaFin
    };
  }

  if (estado_atencion) whereClause.estado_atencion = estado_atencion;
  if (estado) whereClause.estado = estado;

  const includeOptions = [
    { model: Usuario, as: 'medico_atencion', attributes: ['id', 'nombre', 'apellido'] },
    {
      model: Paciente,
      as: 'paciente',
      attributes: ['id', 'nombre', 'apellido'],
      include: [{ model: Identificacion, as: 'identificaciones', attributes: ['tipo_doc', 'nro_doc'] }]
    },
    { model: ViaIngreso, as: 'via_ingreso', attributes: ['id', 'nombre'] }
  ]

  if (medico_id) {
    includeOptions[0].where = { id: medico_id };
    includeOptions[0].required = true;
  }

  if (paciente_id) {
    includeOptions[1].where = { id: paciente_id };
    includeOptions[1].required = true;
  }

  if (via_ingreso_id) {
    includeOptions[2].where = {
      [Op.or]: [
        { id: via_ingreso_id }
      ]
    };
    includeOptions[2].required = true;
  }

  const { count, rows: admisiones } = await Admision.findAndCountAll({
    where: whereClause,
    include: includeOptions,
    order: [['fecha_hora_ingreso', 'DESC']],
    limit: registrosPorPagina,
    offset: offset,
    distinct: true
  });


  const medicoFiltro = obtenerMedicoFiltro(medico_id);

  const pacienteFiltro = await obtenerPacienteFiltro(paciente_id);

  // Via de Ingreso 
  let viaIngresoGD = await ViaIngreso.findOne({ where: { nombre: 'Guardia' } })

  let viaIngresoFiltro = await ViaIngreso.findAll();

  const totalPaginas = Math.ceil(count / registrosPorPagina);
  const filtros = { fecha, estado_atencion, estado, medico_id, paciente_id, via_ingreso_id };

  Object.keys(filtros).forEach(key => {
    if (filtros[key] === undefined || filtros[key] === '') {
      delete filtros[key];
    }
  });

  const filtrosQuery = new URLSearchParams(filtros).toString();

  return {
    title: 'Listado de Admisiones',
    admisiones: admisiones,
    medicoFiltro: medicoFiltro,
    pacienteFiltro: pacienteFiltro,
    viaIngresoFiltro: viaIngresoFiltro,
    viaIngresoModal: viaIngresoGD,
    paginacion: {
      totalRegistros: count,
      totalPaginas: totalPaginas,
      paginaActual: parseInt(pagina),
    },
    filtros: filtros,
    filtrosQuery: filtrosQuery
  };
};

exports.admisionesMedico = async (req) => {
  const { fecha, estado_atencion, estado, mis_admisiones, paciente_id, via_ingreso_id, pagina = 1 } = req.query;
  const registrosPorPagina = 10;
  const offset = (pagina - 1) * registrosPorPagina;

  const whereClause = { activo: true };

  if (mis_admisiones === 'true') {
    whereClause.medico_atencion_id = req.usuario.id;
  } else {
    whereClause.medico_atencion_id = { [Op.or]: [req.usuario.id, null] };
  }

  if (fecha) {
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1);
    whereClause.fecha_hora_ingreso = {
      [Op.gte]: fechaInicio,
      [Op.lt]: fechaFin
    };
  }

  if (estado_atencion) whereClause.estado_atencion = estado_atencion;
  if (estado) whereClause.estado = estado;

  const includeOptions = [
    { model: Usuario, as: 'medico_atencion', attributes: ['id', 'nombre', 'apellido'] },
    {
      model: Paciente,
      as: 'paciente',
      attributes: ['id', 'nombre', 'apellido'],
      include: [{ model: Identificacion, as: 'identificaciones', attributes: ['tipo_doc', 'nro_doc'] }]
    },
    { model: ViaIngreso, as: 'via_ingreso', attributes: ['id', 'nombre'] }
  ]

  if (paciente_id) {
    includeOptions[1].where = { id: paciente_id };
    includeOptions[1].required = true;
  }

  if (via_ingreso_id) {
    includeOptions[2].where = {
      [Op.or]: [
        { id: via_ingreso_id }
      ]
    };
    includeOptions[2].required = true;
  }

  const { count, rows: admisiones } = await Admision.findAndCountAll({
    where: whereClause,
    include: includeOptions,
    order: [['fecha_hora_ingreso', 'DESC']],
    limit: registrosPorPagina,
    offset: offset,
    distinct: true
  });

  const pacienteFiltro = await obtenerPacienteFiltro(paciente_id);

  // Via de Ingreso 
  let viaIngresoGD = await ViaIngreso.findOne({ where: { nombre: 'Guardia' } })

  let viaIngresoFiltro = await ViaIngreso.findAll();

  const totalPaginas = Math.ceil(count / registrosPorPagina);
  const filtros = { fecha, estado_atencion, estado, mis_admisiones, paciente_id, via_ingreso_id };

  Object.keys(filtros).forEach(key => {
    if (filtros[key] === undefined || filtros[key] === '') {
      delete filtros[key];
    }
  });

  const filtrosQuery = new URLSearchParams(filtros).toString();

  return {
    title: 'Listado de Admisiones',
    admisiones: admisiones,
    pacienteFiltro: pacienteFiltro,
    viaIngresoFiltro: viaIngresoFiltro,
    viaIngresoModal: viaIngresoGD,
    paginacion: {
      totalRegistros: count,
      totalPaginas: totalPaginas,
      paginaActual: parseInt(pagina),
    },
    filtros: filtros,
    filtrosQuery: filtrosQuery
  };
};

exports.admisionesEnfermero = async (req) => {
  const { fecha, estado_atencion, estado, medico_id, paciente_id, via_ingreso_id, mis_admisiones, pagina = 1 } = req.query;
  const registrosPorPagina = 10;
  const offset = (pagina - 1) * registrosPorPagina;

  const whereClause = { activo: true };

  if (fecha) {
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1);
    whereClause.fecha_hora_ingreso = {
      [Op.gte]: fechaInicio,
      [Op.lt]: fechaFin
    };
  }

  if (estado_atencion) whereClause.estado_atencion = estado_atencion;
  if (estado) whereClause.estado = estado;

  const includeOptions = [
    { model: Usuario, as: 'medico_atencion', attributes: ['id', 'nombre', 'apellido'] },
    {
      model: Paciente,
      as: 'paciente',
      attributes: ['id', 'nombre', 'apellido'],
      include: [{ model: Identificacion, as: 'identificaciones', attributes: ['tipo_doc', 'nro_doc'] }]
    },
    { model: ViaIngreso, as: 'via_ingreso', attributes: ['id', 'nombre'] },
    { model: Usuario, as: 'enfermeros', attributes: ['id', 'nombre', 'apellido'], through: { attributes: [] } }
  ];

  if (medico_id) {
    includeOptions[0].where = { id: medico_id };
    includeOptions[0].required = true;
  }

  if (mis_admisiones === 'true') {
    includeOptions[3].where = { id: req.usuario.id };
    includeOptions[3].required = true;
  }

  if (paciente_id) {
    includeOptions[1].where = { id: paciente_id };
    includeOptions[1].required = true;
  }

  if (via_ingreso_id) {
    includeOptions[2].where = {
      [Op.or]: [
        { id: via_ingreso_id }
      ]
    };
    includeOptions[2].required = true;
  }

  const { count, rows: admisiones } = await Admision.findAndCountAll({
    where: whereClause,
    include: includeOptions,
    order: [['fecha_hora_ingreso', 'DESC']],
    limit: registrosPorPagina,
    offset: offset,
    distinct: true
  });


  const medicoFiltro = obtenerMedicoFiltro(medico_id);

  const pacienteFiltro = await obtenerPacienteFiltro(paciente_id);


  let viaIngresoFiltro = await ViaIngreso.findAll();

  const totalPaginas = Math.ceil(count / registrosPorPagina);
  const filtros = { fecha, estado_atencion, estado, medico_id, paciente_id, via_ingreso_id, mis_admisiones };

  Object.keys(filtros).forEach(key => {
    if (filtros[key] === undefined || filtros[key] === '') {
      delete filtros[key];
    }
  });

  const filtrosQuery = new URLSearchParams(filtros).toString();

  return {
    title: 'Listado de Admisiones',
    admisiones: admisiones,
    medicoFiltro: medicoFiltro,
    pacienteFiltro: pacienteFiltro,
    viaIngresoFiltro: viaIngresoFiltro,
    paginacion: {
      totalRegistros: count,
      totalPaginas: totalPaginas,
      paginaActual: parseInt(pagina),
    },
    filtros: filtros,
    filtrosQuery: filtrosQuery
  };
};

const obtenerPacienteFiltro = async (paciente_id) => {
  let pacienteFiltro = null;
  if (paciente_id) {
    pacienteFiltro = await Paciente.findByPk(paciente_id, {
      attributes: ['id', 'nombre', 'apellido'],
      include: {
        model: Identificacion, as: 'identificaciones', attributes: ['tipo_doc', 'nro_doc']
      }
    });
  }

  return pacienteFiltro
};

const obtenerMedicoFiltro = async (medico_id) => {
  let medicoFiltro = null;
  if (medico_id) {
    const rolMedico = await Rol.findOne({ where: { nombre: 'Medico' } });
    medicoFiltro = await Usuario.findOne({
      where: {
        id: medico_id,
        rol_id: rolMedico.id,
        activo: true
      }
    });
  }
  return medicoFiltro;
};
