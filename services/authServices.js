const bcrypt = require('bcrypt');
const { Usuario, Rol, Matricula, Especialidad } = require('../db/models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.loginUser = async (email, password) => {
    const usuario = await Usuario.findOne({ 
        where: { email },
        include: [{ model: Rol, attributes: ['nombre'] }]
    });

    if (!usuario) {
        throw new Error('Credenciales inválidas');
    }

    const esPasswordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!esPasswordValida) {
        throw new Error('Credenciales inválidas');
    }

    if (!usuario.activo) {
        throw new Error('Esta cuenta de usuario ha sido desactivada.');
    }

    const payload = {
        id: usuario.id,
        rol: usuario.Rol.nombre
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    return { token, usuario };
};


exports.getEstadisticasDashboard = async () => {
    // Definir el rango de fechas para matrículas próximas a vencer (próximos 30 días)
    const hoy = new Date();
    const proximoMes = new Date();
    proximoMes.setDate(hoy.getDate() + 30);

    const [
        totalUsuarios,
        usuariosActivos,
        totalRoles,
        totalMatriculas,
        matriculasActivas,
        matriculasPorVencer,
        totalEspecialidades,
        especialidadesActivas
    ] = await Promise.all([
        Usuario.count(),
        Usuario.count({ where: { activo: true } }),
        Rol.count(),
        Matricula.count(),
        Matricula.count({ where: { activo: true } }),
        Matricula.count({ where: { activo: true, fecha_vencimiento: { [Op.between]: [hoy, proximoMes] } } }),
        Especialidad.count(),
        Especialidad.count({ where: { activo: true } })
    ]);

    return {
        totalUsuarios, usuariosActivos, totalRoles,
        totalMatriculas, matriculasActivas, matriculasPorVencer,
        totalEspecialidades, especialidadesActivas
    };
};
