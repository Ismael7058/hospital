const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');


const authRouter = require('./routes/api/authApiRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRouter);

module.exports = app;
