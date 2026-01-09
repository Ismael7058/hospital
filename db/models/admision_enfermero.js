module.exports = (sequelize, DataTypes) => {
    const AdmisionEnfermero = sequelize.define('AdmisionEnfermero', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        fecha_desde: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        fecha_hasta: {
            type: DataTypes.DATE,
            allowNull: true
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    }, {
        tableName: 'Admision_Enfermeros',
        timestamps: false,
    });
    return AdmisionEnfermero;
};
