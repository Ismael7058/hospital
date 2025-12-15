module.exports = (sequelize, DataTypes) => {
    const Nacionalidad = sequelize.define('Nacionalidad', {
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
        tableName: 'Nacionalidades',
        timestamps: false
    });
    return Nacionalidad;
};
