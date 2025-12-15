'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Alas', [
      { nombre: 'Ala Norte - Piso 1', descripcion: 'Área de hospitalización general.'},
      { nombre: 'Ala Sur - Piso 1', descripcion: 'Área de pediatría y maternidad.'},
      { nombre: 'Ala Este - Piso 2', descripcion: 'Área de especialidades y cirugía.'},
      { nombre: 'Ala Oeste - Piso 2', descripcion: 'Área de traumatología y rehabilitación.'},
      { nombre: 'Ala Norte - Piso 3', descripcion: 'Área de cardiología.'},
      { nombre: 'Ala Sur - Piso 3', descripcion: 'Área de neurología.'},
      { nombre: 'Unidad de Cuidados Intensivos (UCI)', descripcion: 'Área para pacientes en estado crítico.'},
      { nombre: 'Unidad Coronaria', descripcion: 'Cuidados intensivos para pacientes cardiológicos.'},
      { nombre: 'Emergencias', descripcion: 'Recepción y atención de urgencias médicas.'},
      { nombre: 'Consultorios Externos', descripcion: 'Atención ambulatoria y consultas programadas.'},
      { nombre: 'Laboratorio Clínico', descripcion: 'Análisis de muestras biológicas.'},
      { nombre: 'Diagnóstico por Imágenes', descripcion: 'Radiología, tomografías y resonancias.'},
      { nombre: 'Quirófanos Centrales', descripcion: 'Salas de operaciones para cirugías mayores.'},
      { nombre: 'Administración', descripcion: 'Oficinas administrativas y de gestión.'},
      { nombre: 'Farmacia', descripcion: 'Dispensación de medicamentos.'},
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Alas', null, {});
  }
};
