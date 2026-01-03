module.exports = (sequelize, DataTypes) => {
    const TiposAtencedentes = sequelize.define('TiposAtencedentes', {
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
        tableName: 'Tipos_Antecedentes',
        timestamps: false
    });
    return TiposAtencedentes;
};
