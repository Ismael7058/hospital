'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Seguro_Medico', [
      { nombre: 'OSDE' },
      { nombre: 'Swiss Medical' },
      { nombre: 'Galeno Argentina' },
      { nombre: 'Medicus' },
      { nombre: 'Medifé' },
      { nombre: 'Federada Salud' },
      { nombre: 'Sancor Salud' },
      { nombre: 'Red de Seguros Médicos' },
      { nombre: 'OMINT' },
      { nombre: 'OSDEPYM' },
      { nombre: 'OSDIPP' },
      { nombre: 'OSPE' },
      { nombre: 'Unión Personal' },
      { nombre: 'Boreal Cobertura de Salud' },
      { nombre: 'Higea Salud' },
      { nombre: 'Nobis' },
      { nombre: 'Iter Medicina' },
      { nombre: 'Jerárquicos Salud' },
      { nombre: 'Luis Pasteur' },
      { nombre: 'Apsot' },
      { nombre: 'Avalian' },
      { nombre: 'Emasalud' },
      { nombre: 'Iosfa' },
      { nombre: 'Opdea' },
      { nombre: 'Osseg' },
      { nombre: 'Unimed' },
      { nombre: 'O.S.P.I.S.' },
      { nombre: 'O.S.P.S.A.' },
      { nombre: 'Plan Materno' },
      { nombre: 'Poder Judicial' },
      { nombre: 'Prevención Salud' },
      { nombre: 'Activa Salud' },
      { nombre: 'Accord Salud' },
      { nombre: 'AMFFA Salud' },
      { nombre: 'ASSPE Salud' },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Seguro_Medico', null, {});
  }
};
