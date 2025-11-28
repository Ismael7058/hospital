module.exports = (sequelize, DataTypes) => {
    const Ala = sequelize.define('Ala', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Alas',
        timestamps: false
    });
    return Ala;
};
