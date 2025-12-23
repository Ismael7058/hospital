module.exports = (sequelize, DataTypes) => {
    const PacienteSeguro = sequelize.define('PacienteSeguro', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        nro_afiliado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_vigencia: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_expiracion: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Paciente_Seguro',
        timestamps: false,
    });
    return PacienteSeguro;
};
