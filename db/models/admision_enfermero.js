module.exports = (sequelize, DataTypes) => {
    const AdmisionEnfermero = sequelize.define('AdmisionEnfermero', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        fecha_hora: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Admision_Enfermeros',
        timestamps: false,
    });
    return AdmisionEnfermero;
};
