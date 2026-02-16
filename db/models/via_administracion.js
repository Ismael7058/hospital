module.exports = (sequelize, DataTypes) => {
    const ViaAdministracion = sequelize.define('ViaAdministracion', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Vias_Admistraciones',
        timestamps: false
    });
    return ViaAdministracion;
};
