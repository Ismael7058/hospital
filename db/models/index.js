const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const RolModel = require('./rol');
const UsuarioModel = require('./usuario');

const Rol = RolModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);

const db = {
    sequelize,
    Rol,
    Usuario
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

module.exports = db;