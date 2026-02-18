module.exports = (sequelize, DataTypes) => {
    const HistorialHigienizacion = sequelize.define('HistorialHigienizacion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        fecha_hora: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'Historial_Higienizacion',
        timestamps: false
    });
    return HistorialHigienizacion;
};
