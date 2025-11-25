module.exports = (sequelize, DataTypes) => {
    const Matricula = sequelize.define('Matricula', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numero: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        entidad_emisora: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_emision: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_vencimiento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        es_principal:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Matriculas',
        timestamps: false
    });
    return Matricula;
};
