module.exports = (sequelize, DataTypes) => {
    const FuentesInformacion = sequelize.define('FuentesInformacion', {
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
        tableName: 'Fuestes_Informacion',
        timestamps: false
    });
    return FuentesInformacion;
};
