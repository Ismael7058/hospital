require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // force: tru` elimina y recrea las tablas
    // await sequelize.sync({ force: false });
    // console.log('🔄 Modelos sincronizados con la base de datos.');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
