const usuarioServices = require('../../services/usuarioServices');
const { validationResult } = require('express-validator');

exports.registerUsario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevoUsuario = await usuarioServices.registerUsuario(req.body);

        res.status(201).json({ message: 'Usuario registrado exitosamente.' });

    } catch (error) {
        if (error.message === 'El email ya está en uso' || error.message === 'El DNI ya está en uso') {
            return res.status(409).json({ message: error.message });
        }
        console.error('Error al registrar usuario:', error);
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

        res.status(201).json({ message: 'Perfil editado exitosamente.' });

    } catch (error) {
        if (error.message === 'Usuario no encontrado' ) {
            return res.status(409).json({ message: error.message });
        }
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' }); 
    }
};

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