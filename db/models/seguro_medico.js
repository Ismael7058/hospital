module.exports = (sequelize, DataTypes) => {
    const SeguroMedico = sequelize.define('SeguroMedico', {
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
        tableName: 'Seguros_Medicos',
        timestamps: false,
    });
    return SeguroMedico;
};
