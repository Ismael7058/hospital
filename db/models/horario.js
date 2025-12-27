module.exports = (sequelize, DataTypes) => {
    const Horario = sequelize.define('Horario', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        fecha: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        hora_inicio: {
            type: DataTypes.TIME,
            allowNull: false
        },
        hora_fin: {
            type: DataTypes.TIME,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Horarios',
        timestamps: false,
    });
    return Horario;
};
