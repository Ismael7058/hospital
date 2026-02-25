const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const RolModel = require('./rol');
const UsuarioModel = require('./usuario');
const MatriculaModel = require('./matricula');
const EspecialidadModel = require('./especialidad');
const MedicoEspecialidadModel = require('./medico_especilidad');
const AlaModel = require('./ala');
const HabitacionModel = require('./habitacion');
const CamaModel = require('./cama');
const HistorialHigienizacionModel = require('./historial_higienizacion');
const PacienteModel = require('./paciente');
const IdentificacionModel = require('./indentificacion');
const NacionalidadModel = require('./nacionalidad');
const PacienteNacionalidadModel = require('./paciente_nacionalidad');
const AgendaModel = require('./agenda');
const PacienteSeguroModel = require('./paciente_seguro');
const SeguroMedicoModel = require('./seguro_medico');
const HorarioModel = require('./horario');
const TurnoModel = require('./turno');
const TiposAtencedentesModel = require('./tipo_antecedente');
const AntecedentePacienteModel = require('./antecedente_paciente');
const FuentesInformacionModel = require('./fuente_informacion');
const AdmisionModel = require('./admision');
const AdmisionEnfermeroModel = require('./admision_enfermero');
const ViaIngresoModel = require('./via_ingreso');
const UbicacionInternacionModel = require('./ubicacion_internacion');
const EvolucionMedicaModel = require('./evolucion_medica');
const EstudioSolicitadoModel = require('./estudio_solicitado');
const SignosVitalesModel = require('./signos_vitales');
const CuidadoPreliminarModel = require('./cuidado');
const MedicacionModel = require('./medicacion');
const ViaAdministracionModel = require('./via_administracion');

const Rol = RolModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);
const Matricula = MatriculaModel(sequelize, DataTypes);
const Especialidad = EspecialidadModel(sequelize, DataTypes);
const MedicoEspecialidad = MedicoEspecialidadModel(sequelize, DataTypes);
const Ala = AlaModel(sequelize, DataTypes);
const Habitacion = HabitacionModel(sequelize, DataTypes);
const Cama = CamaModel(sequelize, DataTypes);
const HistorialHigienizacion = HistorialHigienizacionModel(sequelize, DataTypes);
const Paciente = PacienteModel(sequelize, DataTypes);
const Identificacion = IdentificacionModel(sequelize, DataTypes);
const Nacionalidad = NacionalidadModel(sequelize, DataTypes);
const PacienteNacionalidad = PacienteNacionalidadModel(sequelize, DataTypes);
const Agenda = AgendaModel(sequelize, DataTypes);
const SeguroMedico = SeguroMedicoModel(sequelize, DataTypes);
const PacienteSeguro = PacienteSeguroModel(sequelize, DataTypes);
const Horario = HorarioModel(sequelize,DataTypes);
const Turno = TurnoModel(sequelize, DataTypes);
const TiposAtencedentes = TiposAtencedentesModel(sequelize, DataTypes);
const AntecedentePaciente = AntecedentePacienteModel(sequelize, DataTypes);
const FuentesInformacion = FuentesInformacionModel(sequelize,DataTypes);
const Admision = AdmisionModel(sequelize, DataTypes);
const AdmisionEnfermero = AdmisionEnfermeroModel(sequelize, DataTypes);
const ViaIngreso = ViaIngresoModel(sequelize, DataTypes);
const UbicacionInternacion = UbicacionInternacionModel(sequelize, DataTypes);
const EvolucionMedica = EvolucionMedicaModel(sequelize, DataTypes);
const EstudioSolicitado = EstudioSolicitadoModel(sequelize, DataTypes);
const SignosVitales = SignosVitalesModel(sequelize, DataTypes);
const CuidadoPreliminar = CuidadoPreliminarModel(sequelize, DataTypes);
const Medicacion = MedicacionModel(sequelize, DataTypes);
const ViaAdministracion = ViaAdministracionModel(sequelize, DataTypes);

const db = {
    sequelize,
    Rol,
    Usuario,
    Matricula,
    Especialidad,
    MedicoEspecialidad,
    Ala,
    Habitacion,
    Cama,
    HistorialHigienizacion,
    Paciente,
    Identificacion,
    Nacionalidad,
    PacienteNacionalidad,
    Agenda,
    SeguroMedico,
    Horario,
    PacienteSeguro,
    Turno,
    TiposAtencedentes,
    FuentesInformacion,
    AntecedentePaciente,
    Admision,
    AdmisionEnfermero,
    ViaIngreso,
    UbicacionInternacion,
    EvolucionMedica,
    EstudioSolicitado,
    SignosVitales,
    CuidadoPreliminar,
    ViaAdministracion,
    Medicacion
};

// Un Rol tiene muchos Usuarios
db.Rol.hasMany(db.Usuario, {
    foreignKey: {
        name: 'rol_id',
        allowNull: false // Un usuario debe tener un rol
    }
});

// Un Usuario pertenece a un Rol
db.Usuario.belongsTo(db.Rol, {
    foreignKey: {
        name: 'rol_id',
        allowNull: false // Un usuario debe tener un rol
    }
});

// Un Usuario tiene muchas Matriculas
db.Usuario.hasMany(db.Matricula, {
    foreignKey: {
        name: 'usuario_id',
        allowNull: false // Una matrícula debe pertenecer a un usuario
    }
})

// Una Matricula pertenece a un Usuario
db.Matricula.belongsTo(db.Usuario, {
    foreignKey: {
        name: 'usuario_id',
        allowNull: false
    }
})

// Un Usuario puede tener muchas Especialidades
db.Usuario.belongsToMany(db.Especialidad, {
    through: db.MedicoEspecialidad,
    foreignKey: 'usuario_id',
    otherKey: 'especialidad_id',
    timestamps: false
});

// Una Especialidad puede pertenecer a muchos Usuarios
db.Especialidad.belongsToMany(db.Usuario, {
    through: db.MedicoEspecialidad,
    foreignKey: 'especialidad_id',
    otherKey: 'usuario_id',
    timestamps: false
});

// Una Ala tiene muchas Habitaciones
db.Ala.hasMany(db.Habitacion, {
    foreignKey: {
        name: 'ala_id',
        allowNull: false
    },
    as: 'habitaciones'
});

// Una Habitacion pertenece a una Ala
db.Habitacion.belongsTo(db.Ala, {
    foreignKey: {
        name: 'ala_id',
        allowNull: false
    },
    as: 'ala'
});

// Una Habitacion tiene muchas Camas
 db.Habitacion.hasMany(db.Cama, {
    foreignKey: {
        name: 'habitacion_id',
        allowNull: false
    },
    as: 'camas'
});

// Una Cama pertenece a una Habitacion
 db.Cama.belongsTo(db.Habitacion, {
    foreignKey: {
        name: 'habitacion_id',
        allowNull: false
    },
    as: 'habitacion'
});

// Una Cama tiene muchos Historiales de Higienizacion
db.Cama.hasMany(db.HistorialHigienizacion, {
    foreignKey: 'cama_id'
});

// Un Usuario tiene muchos Historiales de Higienizacion
db.Usuario.hasMany(db.HistorialHigienizacion, {
    foreignKey: 'usuario_id'
});

// Un Historial de Higienizacion pertenece a una Cama
db.HistorialHigienizacion.belongsTo(db.Cama, {
    foreignKey: 'cama_id',
});

// Un Historial de Higienizacion pertenece a un Usuario
db.HistorialHigienizacion.belongsTo(db.Usuario, {
    foreignKey: 'usuario_id'
});

// Un Paciente tiene muchas Identificaciones
db.Paciente.hasMany(db.Identificacion, {
    foreignKey: {
        name: 'paciente_id',
        allowNull: false
    },
    as: 'identificaciones'
});

// Una Identificacion pertenece a un Paciente
db.Identificacion.belongsTo(db.Paciente, {
    foreignKey: {
        name: 'paciente_id',
        allowNull: false
    },
    as: 'paciente'
});

// Un Paciente puede tener muchas Nacionalidades
db.Paciente.belongsToMany(db.Nacionalidad, {
    through: db.PacienteNacionalidad,
    foreignKey: 'paciente_id',
    otherKey: 'nacionalidad_id',
    timestamps: false,
    as: 'nacionalidades'
});

// Una Nacionalidad puede pertenecer a muchos Pacientes
db.Nacionalidad.belongsToMany(db.Paciente,{
    through: db.PacienteNacionalidad,
    foreignKey: 'nacionalidad_id',
    otherKey: 'paciente_id',
    timestamps: false,
    as: 'pacientes'
});

// Una Usuario tiene muchas Agendas
db.Usuario.hasMany(db.Agenda, {
    foreignKey: {
        name: 'usuario_id',
        allowNull: false
    },
    as: 'agendas'
});

// Una Agenda pertenece a un Usuario
db.Agenda.belongsTo(db.Usuario, {
    foreignKey: {
        name: 'usuario_id',
        allowNull: false
    },
    as: 'usuario'
});


// Un PacienteSeguro pertenece a un SeguroMedico
db.PacienteSeguro.belongsTo(db.SeguroMedico, {
    foreignKey: 'seguro_medico_id'
});

// Un PacienteSeguro pertenece a un Paciente
db.PacienteSeguro.belongsTo(db.Paciente, {
    foreignKey: 'paciente_id'
});

// Un Paciente tiene muchos PacienteSeguro
db.Paciente.hasMany(db.PacienteSeguro, {
    foreignKey: 'paciente_id',
    as: 'seguros'
});

// Un SeguroMedico tiene muchos PacienteSeguro
db.SeguroMedico.hasMany(db.PacienteSeguro, {
    foreignKey: 'seguro_medico_id',
    as: 'seguros'
});

// Un Usuario tiene muchos Horarios
db.Usuario.hasMany(db.Horario, {
    foreignKey: {
        name: 'usuario_id',
        allowNull: false
    },
    as: 'horarios'
});

// Un Horario pertenece a un Usuario
db.Horario.belongsTo(db.Usuario, {
    foreignKey: {
        name: 'usuario_id',
        allowNull: false
    },
    as: 'usuario'
});

// Un Usuario (Medico) tiene muchos Turnos
db.Usuario.hasMany(db.Turno, {
    foreignKey: {
        name: 'medico_id',
        allowNull: false
    },
    as: 'turnos_medico'
});

// Un Turno pertenece a un Usuario (Medico)
db.Turno.belongsTo(db.Usuario, {
    foreignKey: {
        name: 'medico_id',
        allowNull: false
    },
    as: 'medico'
});

// Un Usuario (Agenda Turno) tiene muchos Turnos
db.Usuario.hasMany(db.Turno, {
    foreignKey: {
        name: 'usuario_agenda',
        allowNull: false
    },
    as: 'turnos_agendados'
});

// Un Turno pertenece a un Usuario (Agenda)
db.Turno.belongsTo(db.Usuario, {
    foreignKey: {
        name: 'usuario_agenda',
        allowNull: false
    },
    as: 'usuario_creador'
});

// Un Paciente tiene muchos Turnos
db.Paciente.hasMany(db.Turno, {
    foreignKey: {
        name: 'paciente_id',
        allowNull: false
    },
    as: 'turnos'
});

// Un Turno pertenece a un Paciente
db.Turno.belongsTo(db.Paciente, {
    foreignKey: {
        name: 'paciente_id',
        allowNull: false
    },
    as: 'paciente'
});

// Un Paciente puede tener muchos Antecedentes
db.Paciente.belongsToMany(db.TiposAtencedentes, {
    through: {
        model: db.AntecedentePaciente,
        unique: false
    },
    foreignKey: 'paciente_id',
    otherKey: 'tipo_antecedente_id',
    timestamps: false
});

// Un Paciente tiene muchos AntecedentePaciente (Relación directa)
db.Paciente.hasMany(db.AntecedentePaciente, {
    foreignKey: 'paciente_id'
});

// Un Antecedente puede pertenecer a muchos Paciente
db.TiposAtencedentes.belongsToMany(db.Paciente, {
    through: {
        model: db.AntecedentePaciente,
        unique: false
    },
    foreignKey: 'tipo_antecedente_id',
    otherKey: 'paciente_id',
    timestamps: false
});

// Un Tipo de Antecedente tiene muchos AntecedentePaciente (Relación directa)
db.TiposAtencedentes.hasMany(db.AntecedentePaciente, {
    foreignKey: 'tipo_antecedente_id'
});

// Una Fuente de Informacion tiene muchos Antecedentes de Pacientes
db.FuentesInformacion.hasMany(db.AntecedentePaciente, {
    foreignKey: {
        name: 'fuente_informacion_id',
        allowNull: false
    }
});

// Un AntecedentePaciente pertenece a un Paciente
db.AntecedentePaciente.belongsTo(db.Paciente, {
    foreignKey: {
        name: 'paciente_id',
        allowNull: false
    }
});

// Un AntecedentePaciente pertenece a un Tipo de Antecedente
db.AntecedentePaciente.belongsTo(db.TiposAtencedentes, {
    foreignKey: {
        name: 'tipo_antecedente_id',
        allowNull: false
    }
});

// Un Antedecente de un Paciente pertenece a una unica Fuente de Informacion
db.AntecedentePaciente.belongsTo(db.FuentesInformacion, {
    foreignKey: {
        name: 'fuente_informacion_id',
        allowNull: false
    },
});

// Un Turno puede pertenecer a una Admision
db.Turno.belongsTo(db.Admision, {
  foreignKey: {
      name: 'admision_id',
      allowNull: true
  }
});

// Una Admision tiene un Turno asociado (opcional)
db.Admision.hasOne(db.Turno, {
    foreignKey: 'admision_id'
});

// Una Admision pertenece a un paciente
db.Admision.belongsTo(db.Paciente, {
  foreignKey: {
      name: 'paciente_id',
      allowNull: false
  },
  as: 'paciente'
});

// Un Paciente tiene muchas Admisiones
db.Paciente.hasMany(db.Admision, {
    foreignKey: 'paciente_id',
    as: 'admisiones'
});

// Una Admision pertenece a un Usuario (Registra)
db.Admision.belongsTo(db.Usuario, {
  foreignKey: {
      name: 'usuario_registro_id',
      allowNull: false
  },
  as: 'usuario_registro'
});

// Una Admision pertenece a un Usuario (Medico)
db.Admision.belongsTo(db.Usuario, {
  foreignKey: {
      name: 'medico_atencion_id',
      allowNull: true
  },
  as: 'medico_atencion'
});

// Una Admision pertenece a una Via de Ingreso
db.Admision.belongsTo(db.ViaIngreso, {
  foreignKey: {
      name: 'via_ingreso_id',
      allowNull: false
  },
  as: 'via_ingreso'
});

// Una Admision tiene muchos AdmisionEnfermero
db.Admision.hasMany(db.AdmisionEnfermero, {
  foreignKey: {
      name: 'admision_id',
      allowNull: false
  },
  as: 'enfermeros'
});

// Una AdmisionEnfermero pertenece a una Admision
db.AdmisionEnfermero.belongsTo(db.Admision, {
  foreignKey: {
      name: 'admision_id',
      allowNull: false
  },
  as: 'admision'
});

// Un Usuario (Enfermero) tiene muchos AdmisionEnfermero
db.Usuario.hasMany(AdmisionEnfermero, {
    foreignKey: {
        name: 'enfermero_id',
        allowNull: false
    },
    as: 'admisiones_enfermero'
});

// Una AdmisionEnfermero pertenece a un Usuario (Enfermero)
db.AdmisionEnfermero.belongsTo(db.Usuario, {
    foreignKey: {
        name: 'enfermero_id',
        allowNull: false
    },
    as: 'enfermero'
});

// Un Usuario (Rol Enfermero) tiene muchas Admisiones (Relacion directa)
db.Usuario.hasMany(db.AdmisionEnfermero, {
  foreignKey: 'enfermero_id'
});


// Una Admision tiene muchas Ubicaciones de Internacion
db.Admision.hasMany(db.UbicacionInternacion, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'ubicaciones'
});

// Una Ubicacion de Internacion pertenece a una Admision
db.UbicacionInternacion.belongsTo(db.Admision, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'admision'
});

// Una Cama tiene muchas Ubicaciones de Internacion (Historial)
db.Cama.hasMany(db.UbicacionInternacion, {
    foreignKey: {
        name: 'cama_id',
        allowNull: false
    },
    as: 'ubicaciones'
});

// Una Ubicacion de Internacion pertenece a una Cama
db.UbicacionInternacion.belongsTo(db.Cama, {
    foreignKey: {
        name: 'cama_id',
        allowNull: false
    },
    as: 'cama'
});

// Un Usuario (quien asigna) tiene muchas Ubicaciones de Internacion
db.Usuario.hasMany(db.UbicacionInternacion, {
    foreignKey: {
        name: 'usuario_asignacion',
        allowNull: false
    },
    as: 'asignaciones_ubicacion'
});

// Una Ubicacion de Internacion pertenece a un Usuario (quien asigna)
db.UbicacionInternacion.belongsTo(db.Usuario, {
    foreignKey: {
        name: 'usuario_asignacion',
        allowNull: false
    },
    as: 'usuario_asignador'
});

// Una Admision tiene muchas Evoluciones Medicas
db.Admision.hasMany(db.EvolucionMedica, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'evoluciones_medicas'
});

// Una Evolucion Medica pertenece a una Admision
db.EvolucionMedica.belongsTo(db.Admision, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'admision'
});

// Una Admision tiene muchos Estudios Solicitados
db.Admision.hasMany(db.EstudioSolicitado, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'estudios_solicitados'
});

// Un Estudio Solicitado pertenece a una Admision
db.EstudioSolicitado.belongsTo(db.Admision, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'admision'
});

// Una Admision tiene muchos Signos Vitales
db.Admision.hasMany(db.SignosVitales, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'signos_vitales'
});

// Un Signo Vitale pertenece a una Admision
db.SignosVitales.belongsTo(db.Admision, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'admision'
});

// Una Admision tiene muchos Cuidados Preliminares
db.Admision.hasMany(db.CuidadoPreliminar, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'cuidados_preliminares'
});

// Un Cuidado Preliminar pertenece a una Admision
db.CuidadoPreliminar.belongsTo(db.Admision, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'admision'
});

// Una Admision tiene muchas Medicaciones
db.Admision.hasMany(db.Medicacion, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'medicaciones'
});

// Una Medicacion pertenece a una Admision
db.Medicacion.belongsTo(db.Admision, {
    foreignKey: {
        name: 'admision_id',
        allowNull: false
    },
    as: 'admision'
});

// Una Medicacion pertenece a una Via de Admistracion
db.Medicacion.belongsTo(db.ViaAdministracion, {
  foreignKey: {
      name: 'via_administracion_id',
      allowNull: false
  },
  as: 'via_administracion'
});

module.exports = db;