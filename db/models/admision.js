module.exports = (sequelize, DataTypes) => {
    const Admision = sequelize.define('Admision', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        fecha_hora_ingreso: {
            type: DataTypes.DATE,
            allowNull: false
        },
        motivo_internacion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estado_atencion: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'En Espera'
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Activa'
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    }, {
        tableName: 'Admisiones',
        timestamps: false,
    });
    return Admision;
};
