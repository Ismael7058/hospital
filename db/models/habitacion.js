module.exports = (sequelize, DataTypes) => {
    const Habitacion = sequelize.define('Habitacion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numero: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capasidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Habitaciones',
        timestamps: false
    });
    return Habitacion;
};
