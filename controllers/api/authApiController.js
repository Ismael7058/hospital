const authServices = require('../../services/authServices');
const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const { token, usuario } = await authServices.loginUser(email, password);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Usar solo en HTTPS en producción
            sameSite: 'strict', // Mitiga ataques CSRF
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        // Enviar una respuesta de éxito
        res.status(200).json({ 
            message: 'Inicio de sesión exitoso.',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.Rol.nombre
            }
        });

    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
};