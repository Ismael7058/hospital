module.exports = (sequelize, DataTypes) => {
    const Cama = sequelize.define('Cama', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Camas',
        timestamps: false
    });
    return Cama;
};
