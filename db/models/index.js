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


const Rol = RolModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);
const Matricula = MatriculaModel(sequelize, DataTypes);
const Especialidad = EspecialidadModel(sequelize, DataTypes);
const MedicoEspecialidad = MedicoEspecialidadModel(sequelize, DataTypes);
const Ala = AlaModel(sequelize, DataTypes);
const Habitacion = HabitacionModel(sequelize, DataTypes);
const Cama = CamaModel(sequelize, DataTypes);
const HistorialHigienizacion = HistorialHigienizacionModel(sequelize, DataTypes);

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
    HistorialHigienizacion
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
    }
});

// Una Habitacion pertenece a una Ala
db.Habitacion.belongsTo(db.Ala, {
    foreignKey: {
        name: 'ala_id',
        allowNull: false
    }
});

// Una Habitacion tiene muchas Camas
 db.Habitacion.hasMany(db.Cama, {
    foreignKey: {
        name: 'habitacion_id',
        allowNull: false
    }
});

// Una Cama pertenece a una Habitacion
 db.Cama.belongsTo(db.Habitacion, {
    foreignKey: {
        name: 'habitacion_id',
        allowNull: false
    }
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

module.exports = db;