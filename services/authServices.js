const bcrypt = require('bcrypt');
const { Usuario, Rol } = require('../db/models');
const jwt = require('jsonwebtoken');


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
