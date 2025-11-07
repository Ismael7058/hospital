const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

module.exports = async function(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }

    try {
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const usuario = await Usuario.findOne({
            where: { id: decoded.usuario.id, activo: true },
            attributes: ['id', 'nombre', 'apellido', 'email', 'rol_id']
        });

        if (!usuario) {
            return res.status(401).json({ message: 'Token no es válido (usuario no encontrado o inactivo)' });
        }

        req.usuario = usuario;
        next();
    } catch (err) {
        res.status(401).json({ message: 'El token no es válido' });
    }
};
