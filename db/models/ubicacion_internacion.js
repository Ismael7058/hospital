module.exports = (sequelize, DataTypes) => {
    const UbicacionInternacion = sequelize.define('UbicacionInternacion', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        fecha_hora_asignacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        fecha_hora_liberacion: {
            type: DataTypes.DATE,
            allowNull: true
        },
        usuario_asignacion: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        cama_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        admision_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        tableName: 'Ubicaciones_Internacion',
        timestamps: false,
    });
    return UbicacionInternacion;
};
