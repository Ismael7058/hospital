module.exports = (sequelize, DataTypes) => {
    const Medicacion = sequelize.define('Medicacion', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        medicamento: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        intervalo_horas : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_hora: {
            type: DataTypes.DATE,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Suministrar'
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Medicaciones',
        timestamps: false
    });
    return Medicacion;
};
