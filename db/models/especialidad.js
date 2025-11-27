module.exports = (sequelize, DataTypes) => {
    const Especialidad = sequelize.define('Especialidad', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Especialidades',
        timestamps: false
    });
    return Especialidad;
};
