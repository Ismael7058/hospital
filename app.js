const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');


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

// Rutas de api
app.use('/api/auth', authApiRouter);
app.use('/api/usuarios', usuarioApiRouter);

// Rutas de views
app.use('/', authViewsRouter);
app.use('/usuarios', userViewsRouter);


module.exports = app;
