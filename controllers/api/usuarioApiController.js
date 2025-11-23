const usuarioServices = require('../../services/usuarioServices');
const { validationResult } = require('express-validator');

exports.registerUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevoUsuario = await usuarioServices.registerUsuario(req.body);

        res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            usuarioId: nuevoUsuario.id
        });

    } catch (error) {
        if (error.message === 'El email ya está en uso' || error.message === 'El DNI ya está en uso') {
            return res.status(409).json({ message: error.message });
        }
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

exports.infoPersonal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const usuarioId = req.params.idUsuario;
        const datosParaActualizar = req.body;

        const filasActualizadas = await usuarioServices.infoPersonal(usuarioId, datosParaActualizar);

        res.status(200).json({ message: 'Perfil editado exitosamente.' });

    } catch (error) {
        if (error.message === 'Usuario no encontrado' ) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'El dni ya está en uso') {
            return res.status(409).json({ message: error.message });
        }
        console.error('Error al editar el perfil del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' }); 
    }
};

exports.editCuenta = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const usuarioId = req.params.idUsuario;
        const datosParaActualizar = req.body;

        const filasActualizadas = await usuarioServices.editCuenta(usuarioId, datosParaActualizar);

        res.status(200).json({ message: 'Perfil editado exitosamente.' });

    } catch (error) {
        if (error.message === 'Usuario no encontrado' ) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'El email ya está en uso') {
            return res.status(409).json({ message: error.message });
        }
        console.error('Error al editar la cuenta del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' }); 
    }
};

exports.editPasswordAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const usuarioId = req.params.idUsuario;
        const datosParaActualizar = req.body;

        const filasActualizadas = await usuarioServices.editPasswordAdmin(usuarioId, datosParaActualizar);

        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });

    } catch (error) {
        if (error.message === 'Usuario no encontrado' ) {
            return res.status(404).json({ message: error.message });
        }
        console.error('Error al editar la contraseña del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' }); 
    }
};

exports.editPerfil = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const usuarioId = req.usuario.id; 
        const datosPerfil = req.body;

        const filasActualizadas = await usuarioServices.editPerfil(usuarioId, datosPerfil);

        res.status(200).json({ message: 'Perfil editado exitosamente.' });

    } catch (error) {
        if (error.message === 'Usuario no encontrado' ) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'El email ya está en uso') {
            return res.status(409).json({ message: error.message });
        }
        console.error('Error al editar el perfil del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' }); 
    }
};

exports.modifyUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const filasActualizadas = await usuarioServices.modifyUsuario(req.body);

        res.status(200).json({ message: 'Usuario modificado exitosamente.' });
    } catch (error) {
        if (error.message === 'Usuario no encontrado' ) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'El email ya está en uso' || error.message === 'El DNI ya está en uso') {
            return res.status(409).json({ message: error.message });
        }
        console.error('Error al modificar al usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

exports.editPassword = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const usuarioId = req.usuario.id; 
        const datosPasswords = req.body;

    await usuarioServices.editPassword(usuarioId, datosPasswords);

    res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'La contraseña anterior es incorrecta') {
      return res.status(401).json({ message: error.message });
    }
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

exports.setEstado = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const { activo } = req.body;

        if (typeof activo !== 'boolean') {
            return res.status(400).json({ message: 'El estado debe ser un valor booleano (true o false).' });
        }

        await usuarioServices.setEstado(idUsuario, activo);

        const message = `Usuario ${activo ? 'dado de alta' : 'dado de baja'} exitosamente.`;
        res.status(200).json({ message });
    } catch (error) {
        console.error('Error al cambiar el estado del usuario:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor.' });
    }
};
