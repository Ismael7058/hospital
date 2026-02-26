const authService = require('../../services/authServices');

exports.getHome = async (req, res, next) => {
    try {
        if (req.usuario) {
          switch (req.usuario.Rol.nombre) {
            case "Administrador":
              const estadisticas = await authService.getDashboardAdministrador();
              return  res.render('./Personal/DashboardAdministrador.pug', {
                    title: 'Horizon - Dashboard',
                    estadisticas: estadisticas
                });
            case "Recepcion":
              const estadistica = await authService.getDashboardRecepcion();
              return  res.render('./Personal/DashboardRecepcion.pug', {
                    title: 'Horizon - Dashboard',
                    estadisticas: estadistica
                });
            case "Medico":
              const estadisticasMedico = await authService.getDashboardMedico(req.usuario);
              return  res.render('./Personal/DashboardMedico.pug', {
                    title: 'Horizon - Dashboard',
                    kpis: estadisticasMedico.kpis,
                    turnosHoyList: estadisticasMedico.turnosHoyList,
                    pacientesInternadosList: estadisticasMedico.pacientesInternadosList,
                });
            case "Enfermero":
              const estadisticasEnfermero = await authService.getDashboardEnfermero(req.usuario);
              return  res.render('./Personal/DashboardEnfermero.pug', {
                    title: 'Horizon - Dashboard',
                    kpis: estadisticasEnfermero.kpis,
                    pacientesAsignadosList: estadisticasEnfermero.pacientesAsignadosList
                });
            case "Limpieza":
              const estadisticasLimpieza = await authService.getDashboardLimpieza();
              return  res.render('./Personal/DashboardLimpieza.pug', {
                    title: 'Dashboard de Limpieza',
                    stats: estadisticasLimpieza.stats,
                    camasHigienizarList: estadisticasLimpieza.camasHigienizarList
                });
          }
        } else {
            res.render('./Shared/Login', { title: 'Bienvenido a Horizon' });
        }
    } catch (error) {
        next(error); // Pasamos el error al manejador de errores 500
    }
};

exports.login = (req, res, next) => {
    try {

            res.render('index', { title: 'Bienvenido a Horizon' });
            
    } catch (error) {
        next(error);
    }
};

exports.get404 = (req, res) => {
    res.status(404).render('NotFound', {
        title: 'Página no encontrada'
    });
};

exports.get403 = (req, res) => {
    res.status(403).render('Forbidden', {
        title: 'Acceso Denegado',
        message: 'No tienes los permisos necesarios para acceder a esta sección.'
    });
};

exports.get500 = (error, req, res, next) => {
    console.error('ERROR 500:', error.stack);
    res.status(500).render('ServerError', {
        title: 'Error Interno del Servidor',
        message: 'Hemos detectado un problema y nuestro equipo técnico ha sido notificado. Por favor, intenta de nuevo más tarde.',
        statusCode: 500,
        errorStack: error.stack,
        process: process
    });
};