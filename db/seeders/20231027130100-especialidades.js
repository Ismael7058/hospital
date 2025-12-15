'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Especialidades', [
      { nombre: 'Cardiología' },
      { nombre: 'Pediatría' },
      { nombre: 'Traumatología' },
      { nombre: 'Ginecología y Obstetricia' },
      { nombre: 'Neurología' },
      { nombre: 'Dermatología' },
      { nombre: 'Oncología' },
      { nombre: 'Medicina Interna' },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Especialidades', null, {});
  }
};
