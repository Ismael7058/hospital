module.exports = (sequelize, DataTypes) => {
    const MedicoEspecialidad = sequelize.define('MedicoEspecialidad', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        tableName: 'Medico_Especialidad',
        timestamps: false
    });
    return MedicoEspecialidad;
};
