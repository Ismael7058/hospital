module.exports = (sequelize, DataTypes) => {
    const Identificacion = sequelize.define('Identificacion', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        tipo_doc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nro_doc: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'Identificaciones',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['tipo_doc', 'nro_doc']
            }
        ]
    });
    return Identificacion;
};
