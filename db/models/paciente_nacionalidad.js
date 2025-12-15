module.exports = (sequelize, DataTypes) => {
    const PacienteNacionalidad = sequelize.define('PacienteNacionalidad', {
    }, {
        tableName: 'Paciente_Nacionalidad',
        timestamps: false
    });
    return PacienteNacionalidad;
};