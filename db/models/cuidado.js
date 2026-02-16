module.exports = (sequelize, DataTypes) => {
    const CuidadoPreliminar = sequelize.define('CuidadoPreliminar', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
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
        tableName: 'Cuidados_Preliminares',
        timestamps: false
    });
    return CuidadoPreliminar;
};
