const { Rol, Usuario } = require('../../db/models');

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

exports.getUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        // Usamos Promise.all para cargar el usuario y los roles en paralelo
        const [usuario, roles] = await Promise.all([
            Usuario.findByPk(usuarioId),
            Rol.findAll({ attributes: ['id', 'nombre'], order: [['nombre', 'ASC']] })
        ]);

        if (!usuario) {
            return res.redirect('/usuarios');
        }

        res.render('./Usuario/Gestion.pug', {
            title: `Gestión de ${usuario.nombre} ${usuario.apellido}`,
            usuario: usuario,
            roles: roles
        });
    } catch (error) {
        console.error('Error al renderizar la vista de usuario:', error);
        res.status(500).send('Error interno del servidor al cargar la página.');
    }
}