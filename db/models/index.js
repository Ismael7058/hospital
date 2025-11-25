const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const RolModel = require('./rol');
const UsuarioModel = require('./usuario');
const MatriculaModel = require('./matricula');


const Rol = RolModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);
const Matricula = MatriculaModel(sequelize, DataTypes);

const db = {
    sequelize,
    Rol,
    Usuario,
    Matricula
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

module.exports = db;