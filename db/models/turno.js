module.exports = (sequelize, DataTypes) => {
    const Turno = sequelize.define('Turno', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        fecha: {
            type: DataTypes.DATEONLY,
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
        motivo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Turnos',
        timestamps: false,
    });
    return Turno;
};
