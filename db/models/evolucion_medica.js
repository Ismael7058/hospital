module.exports = (sequelize, DataTypes) => {
    const EvolucionMedica = sequelize.define('EvolucionMedica', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        diagnostico: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tratamiento_ajuste: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fecha_hora: {
            type: DataTypes.DATE,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Evoluciones_Medicas',
        timestamps: false
    });
    return EvolucionMedica;
};
