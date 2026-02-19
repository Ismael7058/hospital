const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { verificarAutenticacion, protegerRuta, restringirRol } = require('./middlewares/authMiddleware');
const { get403, get404, get500 } = require('./controllers/views/authViewsController');

const authApiRouter = require('./routes/api/authApiRouter');
const usuarioApiRouter = require('./routes/api/usuarioApiRouter');
const MatriculaApiRouter = require('./routes/api/matriculaApiRouter');
const especialidadApiRouter = require('./routes/api/especialidadApiRouter')
const infraestructuraApiRouter = require('./routes/api/infraestructuraApiRouter');
const pacientesApiRouter = require('./routes/api/pacienteApiRouter');
const agendaApiRouter= require('./routes/api/agendaApiRouter');
const seguroApiRouter = require('./routes/api/seguroApiRouter');
const seguroPacienteApiRouter = require('./routes/api/pacienteSeguroApiRouter');
const horarioApiRouter = require('./routes/api/horarioApiRouter');
const turnoApiRouter = require('./routes/api/turnosApiRouter');
const fuentesInformacionApiRouter = require('./routes/api/fuentesInformacionApiRouter');
const tipoAntecedentesApiRouter = require('./routes/api/tipoAntecedentesApiRouter');
const antecedentePacienteApiRouter = require('./routes/api/antecedentePacienteApiRouter');
const admisionApiRouter = require('./routes/api/admisionApiRouter');
const evolucionMedicaApiRouter = require('./routes/api/evolucionMedicaApiRouter');
const cuidadoApiRouter = require('./routes/api/cuidadoApiRouter');
const estudioApiRouter = require('./routes/api/estudioApiRouter');
const medicacionApiRouter = require('./routes/api/medicacionApiRouter');
const signosVitalesApiRouter = require('./routes/api/signosVitalesApiRouter');

const authViewsRouter = require('./routes/views/authViewsRouter');
const userViewsRouter = require('./routes/views/usuariosViewsRouter');
const matriculaViewsRouter = require('./routes/views/matriculaViewsRouter');
const especialidadViewsRouter = require('./routes/views/especialidadViewsRouter')
const infraestructuraViewsRouter = require('./routes/views/infraestructuraViewsRouter');
const pacienteViewsRouter = require('./routes/views/pacienteViewsRouter');
const seguroViewsRouter = require('./routes/views/seguroViewsRouter');
const turnoViewsRouter = require('./routes/views/turnosViewsRouter');
const tipoAntecedentesViewsRouter = require('./routes/views/tipoAntecendentesViewsRouter');
const fuentesInformacionViewsRouter = require('./routes/views/fuentesInformacionViewsRouter');
const admisionViewsRouter = require('./routes/views/admisionViewsRouter');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar la autenticación
app.use(verificarAutenticacion);

// Rutas de api
app.use('/api/auth', authApiRouter);
app.use('/api/usuarios', protegerRuta, usuarioApiRouter);
app.use('/api/matriculas', protegerRuta, restringirRol('Administrador'), MatriculaApiRouter);
app.use('/api/especialidades', protegerRuta, restringirRol('Administrador'),especialidadApiRouter);
app.use('/api/infraestructura', protegerRuta, infraestructuraApiRouter);
app.use('/api/pacientes', protegerRuta, pacientesApiRouter);
app.use('/api/agendas', protegerRuta, restringirRol('Administrador'), agendaApiRouter);
app.use('/api/seguros', protegerRuta, restringirRol('Administrador'), seguroApiRouter);
app.use('/api/paciente-seguros', protegerRuta, seguroPacienteApiRouter);
app.use('/api/horarios', protegerRuta, restringirRol('Administrador'), horarioApiRouter);
app.use('/api/turnos', protegerRuta, turnoApiRouter);
app.use('/api/fuentes', protegerRuta, restringirRol('Administrador'), fuentesInformacionApiRouter);
app.use('/api/tipo-antecedente', protegerRuta, restringirRol('Administrador'), tipoAntecedentesApiRouter);
app.use('/api/antecentes-paciente', protegerRuta, antecedentePacienteApiRouter);
app.use('/api/admisiones', protegerRuta, admisionApiRouter);
app.use('/api/evoluciones-medicas', protegerRuta, restringirRol('Medico'), evolucionMedicaApiRouter);
app.use('/api/cuidados-preeliminares', protegerRuta, restringirRol('Medico'), cuidadoApiRouter);
app.use('/api/estudios-solicitados', protegerRuta, restringirRol('Medico'), estudioApiRouter);
app.use('/api/medicaciones', protegerRuta, restringirRol('Medico'), medicacionApiRouter);
app.use('/api/signos-vitales', protegerRuta, restringirRol('Administrador'), signosVitalesApiRouter);

// Rutas de views
app.use('/', authViewsRouter);
app.use('/usuarios', protegerRuta, restringirRol('Administrador'), userViewsRouter);
app.use('/matriculas', protegerRuta, restringirRol('Administrador'), matriculaViewsRouter);
app.use('/especialidades', protegerRuta, restringirRol('Administrador'), especialidadViewsRouter);
app.use('/infraestructura', protegerRuta, infraestructuraViewsRouter);
app.use('/pacientes', protegerRuta, pacienteViewsRouter);
app.use('/seguros', protegerRuta, restringirRol('Administrador'),seguroViewsRouter);
app.use('/turnos', protegerRuta, restringirRol('Administrador', 'Recepcion'), turnoViewsRouter);
app.use('/tipos-antecedentes', protegerRuta, restringirRol('Administrador'), tipoAntecedentesViewsRouter);
app.use('/funtes-informacion', protegerRuta, restringirRol('Administrador'), fuentesInformacionViewsRouter);
app.use('/admisiones', protegerRuta, admisionViewsRouter);


// Rutas no encontrada (403)
app.use(get403);

// Rutas no encontrada (404)
app.use(get404);

// Errores del servidor (500)
app.use(get500);

module.exports = app;
