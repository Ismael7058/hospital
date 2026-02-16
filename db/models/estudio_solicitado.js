module.exports = (sequelize, DataTypes) => {
    const EstudioSolicitado = sequelize.define('EstudioSolicitado', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        estudio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
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
        tableName: 'Estudios_Solicitados',
        timestamps: false
    });
    return EstudioSolicitado;
};
