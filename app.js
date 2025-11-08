const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');


const authRouter = require('./routes/api/authApiRoutes');
const authViewsRouter = require('./routes/views/authViewsRoutes');
 
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de api
app.use('/api/auth', authRouter);

// Rutas de views
app.use('/', authViewsRouter);

module.exports = app;
