const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const RolModel = require('./rol');
const UsuarioModel = require('./usuario');
const MatriculaModel = require('./matricula');
const EspecialidadModel = require('./especialidad');
const MedicoEspecialidadModel = require('./medico_especilidad');


const Rol = RolModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);
const Matricula = MatriculaModel(sequelize, DataTypes);
const Especialidad = EspecialidadModel(sequelize, DataTypes);
const MedicoEspecialidad = MedicoEspecialidadModel(sequelize, DataTypes);

const db = {
    sequelize,
    Rol,
    Usuario,
    Matricula,
    Especialidad,
    MedicoEspecialidad
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

module.exports = db;