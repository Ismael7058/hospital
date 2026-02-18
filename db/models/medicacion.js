module.exports = (sequelize, DataTypes) => {
    const Medicacion = sequelize.define('Medicacion', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        medicamento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dosis: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        intervalo_horas : {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_inicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        fecha_hora: {
            type: DataTypes.DATE,
            allowNull: false
        },
        indicaciones: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Suministrar'
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Medicaciones',
        timestamps: false
    });
    return Medicacion;
};
