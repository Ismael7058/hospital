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
const AntecedentePacienteModel = require('./antencedente_paciente');
const FuentesInformacionModel = require('./fuente_informacion');


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
    AntecedentePaciente,
    FuentesInformacion
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

// Una Cama puede tener muchos Historial de Higienizacion
db.Cama.belongsToMany(db.Usuario, {
    through: db.HistorialHigienizacion,
    foreignKey: 'cama_id',
    otherKey: 'usuario_id',
    timestamps: false
});

// Un Usuaio puede tener muchos Historiales de Higienizacion
db.Usuario.belongsToMany(db.Cama, {
    through: db.HistorialHigienizacion,
    foreignKey: 'usuario_id',
    otherKey: 'cama_id',
    timestamps: false
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

// Un Paciente puede tener muchos Seguros Medicos
db.Paciente.belongsToMany(db.SeguroMedico, {
    through: db.PacienteSeguro,
    foreignKey: 'paciente_id',
    otherKey: 'seguro_medico_id',
    timestamps: false,
    as: 'seguros'
});

// Un SeguroMedico puede pertenecer a muchos Pacientes
db.SeguroMedico.belongsToMany(db.Paciente,{
    through: db.PacienteSeguro,
    foreignKey: 'seguro_medico_id',
    otherKey: 'paciente_id',
    timestamps: false,
    as: 'pacientes'
});

// Un PacienteSeguro pertenece a un SeguroMedico
db.PacienteSeguro.belongsTo(db.SeguroMedico, {
    foreignKey: 'seguro_medico_id'
});

// Un PacienteSeguro pertenece a un Paciente
db.PacienteSeguro.belongsTo(db.Paciente, {
    foreignKey: 'paciente_id'
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
    through: db.AntecedentePaciente,
    foreignKey: 'paciente_id',
    otherKey: 'tipo_antecedente_id',
    timestamps: false
});

// Un Antecedente puede pertenecer a muchos Paciente
db.TiposAtencedentes.belongsToMany(db.Paciente, {
    through: db.AntecedentePaciente,
    foreignKey: 'tipo_antecedente_id',
    otherKey: 'paciente_id',
    timestamps: false
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



module.exports = db;