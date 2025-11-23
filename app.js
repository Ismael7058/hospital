const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { verificarAutenticacion, protegerRuta } = require('./middlewares/authMiddleware');
const { get404, get500 } = require('./controllers/views/authViewsController');

const authApiRouter = require('./routes/api/authApiRouter');
const usuarioApiRouter = require('./routes/api/usuarioApiRouter');
const authViewsRouter = require('./routes/views/authViewsRouter');
const userViewsRouter = require('./routes/views/usuariosViewsRouter');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware global para verificar la autenticación en cada petición
app.use(verificarAutenticacion);

// Rutas de api
app.use('/api/auth', authApiRouter);
app.use('/api/usuarios', protegerRuta, usuarioApiRouter);

// Rutas de views
app.use('/', authViewsRouter);
app.use('/usuarios', protegerRuta, userViewsRouter);


// --- MANEJO DE ERRORES ---
// Middleware para capturar rutas no encontradas (404)
app.use(get404);
// Middleware para manejar errores del servidor (500)
app.use(get500);

module.exports = app;
