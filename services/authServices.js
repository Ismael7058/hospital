const bcrypt = require('bcrypt');
const { Usuario } = require('../db/models');
const jwt = require('jsonwebtoken');


exports.loginUser = async (email, password) => {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        throw new Error('Credenciales inválidas');
    }

    const esPasswordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!esPasswordValida) {
        throw new Error('Credenciales inválidas');
    }

    const payload = {
        usuario: {
            id: usuario.id,
            rol_id: usuario.rol_id
        }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    return token;
};
