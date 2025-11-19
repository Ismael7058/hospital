const { Rol } = require('../../db/models');

exports.getRegistrar = async (req, res) => {
    try {
        const roles = await Rol.findAll({
            attributes: ['id', 'nombre'],
            order: [['nombre', 'ASC']]
        });

        res.render('./Usuario/Registrar.pug', {
            title: 'Registrar Usuario',
            roles: roles,
            old: {},
            errors: []
        });
    } catch (error) {
        console.error('Error al renderizar la vista de registro de usuarios:', error);
        res.status(500).send('Error interno del servidor al cargar la página.');
    }
};

exports.getUsuario = (req, res) => {
    try {
        res.render('./Usuario/Gestion.pug', {
            title: 'Ver Usuario'
        });
    } catch (error) {
        console.error('Error al renderizar la vista de usuario:', error);
        res.status(500).send('Error interno del servidor al cargar la página.');
    }
}