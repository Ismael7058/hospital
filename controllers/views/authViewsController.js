const { Usuario, Rol } = require('../../db/models');

exports.getHome = async (req, res, next) => {
    try {
        if (req.usuario) {
            // Si el usuario está logueado, obtenemos las estadísticas para el dashboard
            const [totalUsuarios, usuariosActivos, totalRoles] = await Promise.all([
                Usuario.count(),
                Usuario.count({ where: { activo: true } }),
                Rol.count()
            ]);

            const estadisticas = {
                totalUsuarios,
                usuariosActivos,
                totalRoles
            };

            res.render('./shared/dashboard', {
                title: 'Horizon - Dashboard',
                estadisticas: estadisticas // Pasamos las estadísticas a la vista
            });
        } else {
            res.render('index', { title: 'Bienvenido a Horizon' });
        }
    } catch (error) {
        next(error); // Pasamos el error al manejador de errores 500
    }
};

exports.login = (req, res) => {
    try {

            res.render('index', { title: 'Bienvenido a Horizon' });
            
    } catch (error) {
        console.error('Error al renderizar el index:', error);
        res.status(500).send('Error interno del servidor al cargar la página.');
    }
};

exports.get404 = (req, res) => {
    res.status(404).render('NotFound', {
        title: 'Página no encontrada'
    });
};

exports.get500 = (error, req, res, next) => {
    console.error('ERROR 500:', error.stack); // Log del error para depuración
    res.status(500).render('ServerError', {
        title: 'Error Interno del Servidor',
        message: 'Hemos detectado un problema y nuestro equipo técnico ha sido notificado. Por favor, intenta de nuevo más tarde.',
        statusCode: 500,
        errorStack: error.stack, // Se pasará a la vista
        process: process // Para acceder a NODE_ENV en la vista
    });
};