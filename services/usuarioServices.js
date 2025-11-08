const bcrypt = require('bcrypt');
const { Usuario } = require('../db/models');

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

exports.registerUsuario = async (usuarioData) => {
    const { email, dni, password } = usuarioData;

    const emailUsuado = await Usuario.findOne({ where: { email } });
    if (emailUsuado) {
        throw new Error('El email ya está en uso');
    }

    const dniUsado = await Usuario.findOne({ where: { dni } });
    if (dniUsado){
        throw new Error('El DNI ya está en uso');
    }

    const password_hash = await bcrypt.hash(password, saltRounds);
    usuarioData.password_hash = password_hash;

    const nuevoUsuario = await Usuario.create({ usuarioData });

    return nuevoUsuario;
}