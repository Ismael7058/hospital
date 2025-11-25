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

    // Eliminamos las contraseñas en texto plano para que no se intenten guardar en la BD
    delete usuarioData.password;
    delete usuarioData.passwordConfirmation;

    const nuevoUsuario = await Usuario.create(usuarioData);

    return nuevoUsuario;
}

exports.infoPersonal = async (id, datosActualizados) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const emailUsuado = await Usuario.findOne({ where: { dni: datosActualizados.dni } });
    if (emailUsuado && emailUsuado.id !== id) {
        throw new Error('El dni ya está en uso');
    }

    const atributosEditables = {
        dni: datosActualizados.dni,
        nombre: datosActualizados.nombre,
        apellido: datosActualizados.apellido,
        telefono: datosActualizados.telefono,
        direccion: datosActualizados.direccion,
        fecha_nacimiento: datosActualizados.fecha_nacimiento,
        sexo: datosActualizados.sexo,
        email: datosActualizados.email
    };

    const [filasActualizadas] = await Usuario.update(atributosEditables, {
        where: { id: id }
    });

    return filasActualizadas;
};

exports.editCuenta = async (id, datosActualizados) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const emailUsuado = await Usuario.findOne({ where: { email: datosActualizados.email } });
    if (emailUsuado && emailUsuado.id !== id) {
        throw new Error('El email ya está en uso');
    }

    const atributosEditables = {
        email: datosActualizados.email,
        rol_id: datosActualizados.rol_id,
    };

    const [filasActualizadas] = await Usuario.update(atributosEditables, {
        where: { id: id }
    });

    return filasActualizadas;
};

exports.editPasswordAdmin = async (id, datosActualizados) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const password_hash = await bcrypt.hash(datosActualizados.password, saltRounds);

    const atributosEditables = {
        password_hash: password_hash,
    };

    const [filasActualizadas] = await Usuario.update(atributosEditables, {
        where: { id: id }
    });

    return filasActualizadas;
};


exports.editPerfil = async (id, datosActualizados) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const atributosEditables = {
        nombre: datosActualizados.nombre,
        apellido: datosActualizados.apellido,
        telefono: datosActualizados.telefono,
        direccion: datosActualizados.direccion,
        fecha_nacimiento: datosActualizados.fecha_nacimiento,
        sexo: datosActualizados.sexo
    };

    const [filasActualizadas] = await Usuario.update(atributosEditables, {
        where: { id: id }
    });

    return filasActualizadas;
};

exports.editPassword = async (id, datosActualizados) =>{
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const passwordAnterior = await bcrypt.compare(datosActualizados.passwordAnterior, usuario.password_hash);
    if (!passwordAnterior) {
        throw new Error('Contraseña anterior incorrecta');
    }

    const password_hash = await bcrypt.hash(datosActualizados.password, saltRounds);
    
    const [filasActualizadas] = await Usuario.update(
        { password_hash: password_hash },
        { where: { id: id } }
    );
    return filasActualizadas;

};

exports.setEstado = async (id, estado) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    if (usuario.activo === estado) {
        throw new Error(`El usuario ya se encuentra ${estado ? 'activo' : 'inactivo'}.`);
    }

    usuario.activo = estado;
    await usuario.save();
    return usuario;
};
