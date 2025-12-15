'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Nacionalidades', [
      { nombre: 'Alemana' },
      { nombre: 'Argentina' },
      { nombre: 'Boliviana' },
      { nombre: 'Brasileña' },
      { nombre: 'Británica' },
      { nombre: 'Canadiense' },
      { nombre: 'Chilena' },
      { nombre: 'China' },
      { nombre: 'Colombiana' },
      { nombre: 'Costarricense' },
      { nombre: 'Cubana' },
      { nombre: 'Dominicana' },
      { nombre: 'Ecuatoriana' },
      { nombre: 'Española' },
      { nombre: 'Estadounidense' },
      { nombre: 'Francesa' },
      { nombre: 'Guatemalteca' },
      { nombre: 'Hondureña' },
      { nombre: 'Italiana' },
      { nombre: 'Japonesa' },
      { nombre: 'Mexicana' },
      { nombre: 'Nicaragüense' },
      { nombre: 'Panameña' },
      { nombre: 'Paraguaya' },
      { nombre: 'Peruana' },
      { nombre: 'Portuguesa' },
      { nombre: 'Rusa' },
      { nombre: 'Salvadoreña' },
      { nombre: 'Uruguaya' },
      { nombre: 'Venezolana' },
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Nacionalidades', null, {});
  }
};
