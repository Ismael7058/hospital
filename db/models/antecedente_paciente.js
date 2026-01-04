module.exports = (sequelize, DataTypes) => {
    const AntecedentePaciente = sequelize.define('AntecedentePaciente', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fecha_registro: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        observaciones: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fuente_informacion_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        paciente_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        tipo_antecedente_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        validado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Antecedente_Paciente',
        timestamps: false
    });
    return AntecedentePaciente;
};
