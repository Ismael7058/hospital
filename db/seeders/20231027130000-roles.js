'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      { nombre: 'Administrador' },
      { nombre: 'Medico' },
      { nombre: 'Recepcionista' },
      { nombre: 'Enfermero' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
