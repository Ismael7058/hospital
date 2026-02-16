module.exports = (sequelize, DataTypes) => {
    const SignosVitales = sequelize.define('SignosVitales', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        frecuencia_cardiaca: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        presion_arterial: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        saturacion_oxigeno: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        temperatura: {
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
        tableName: 'Signos_Vitales',
        timestamps: false
    });
    return SignosVitales;
};
