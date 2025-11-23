const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../db/models');

exports.verificarAutenticacion = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Buscamos al usuario en la BD sin su contraseña
            const usuario = await Usuario.findByPk(decoded.id, {
                attributes: { exclude: ['password_hash'] },
                include: [{ model: Rol, attributes: ['nombre'] }]
            });

            if (usuario) {
                // Adjuntamos el usuario al objeto 'req' para rutas de API
                req.usuario = usuario;
                // Adjuntamos el usuario a 'res.locals' para que esté disponible en todas las vistas Pug
                res.locals.usuarioAutenticado = usuario;
            }
        } catch (error) {
            console.error('Error de autenticación:', error.message);
            // Si el token es inválido, no hacemos nada y el usuario no estará autenticado
        }
    }
    next();
};

exports.protegerRuta = (req, res, next) => {
    if (req.usuario) {
        return next(); // Si el usuario está autenticado, continuar
    }
    // Si no está autenticado, redirigir al login
    res.redirect('/login');
};

