'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Camas', [
      // --- Ala Norte - Piso 1 (IDs: 1-8) ---
      { codigo: 'N1-101-A', estado: 'Libre', activo: true, habitacion_id: 1 },
      { codigo: 'N1-102-A', estado: 'Libre', activo: true, habitacion_id: 2 },
      { codigo: 'N1-102-B', estado: 'Libre', activo: true, habitacion_id: 2 },
      { codigo: 'N1-103-A', estado: 'Libre', activo: true, habitacion_id: 3 },
      { codigo: 'N1-104-A', estado: 'Libre', activo: true, habitacion_id: 4 },
      { codigo: 'N1-104-B', estado: 'Libre', activo: true, habitacion_id: 4 },
      { codigo: 'N1-105-A', estado: 'Libre', activo: true, habitacion_id: 5 },
      { codigo: 'N1-105-B', estado: 'Libre', activo: true, habitacion_id: 5 },
      { codigo: 'N1-106-A', estado: 'Libre', activo: true, habitacion_id: 6 },
      { codigo: 'N1-107-A', estado: 'Libre', activo: true, habitacion_id: 7 },
      { codigo: 'N1-107-B', estado: 'Libre', activo: true, habitacion_id: 7 },
      { codigo: 'N1-108-A', estado: 'Libre', activo: true, habitacion_id: 8 },
      { codigo: 'N1-108-B', estado: 'Libre', activo: true, habitacion_id: 8 },

      // --- Ala Sur - Piso 1 (IDs: 9-13) ---
      { codigo: 'S1-151-A', estado: 'Libre', activo: true, habitacion_id: 9 },
      { codigo: 'S1-152-A', estado: 'Libre', activo: true, habitacion_id: 10 },
      { codigo: 'S1-153-A', estado: 'Libre', activo: true, habitacion_id: 11 },
      { codigo: 'S1-154-A', estado: 'Libre', activo: true, habitacion_id: 12 },
      { codigo: 'S1-155-A', estado: 'Libre', activo: true, habitacion_id: 13 },
      { codigo: 'S1-155-B', estado: 'Libre', activo: true, habitacion_id: 13 },

      // --- Ala Este - Piso 2 (IDs: 14-20) ---
      { codigo: 'E2-201-A', estado: 'Libre', activo: true, habitacion_id: 14 },
      { codigo: 'E2-202-A', estado: 'Libre', activo: true, habitacion_id: 15 },
      { codigo: 'E2-202-B', estado: 'Libre', activo: true, habitacion_id: 15 },
      { codigo: 'E2-203-A', estado: 'Libre', activo: true, habitacion_id: 16 },
      { codigo: 'E2-204-A', estado: 'Libre', activo: true, habitacion_id: 17 },
      { codigo: 'E2-204-B', estado: 'Libre', activo: true, habitacion_id: 17 },
      { codigo: 'E2-205-A', estado: 'Libre', activo: true, habitacion_id: 18 },
      { codigo: 'E2-206-A', estado: 'Libre', activo: true, habitacion_id: 19 },
      { codigo: 'E2-206-B', estado: 'Libre', activo: true, habitacion_id: 19 },
      { codigo: 'E2-207-A', estado: 'Libre', activo: true, habitacion_id: 20 },
      { codigo: 'E2-207-B', estado: 'Libre', activo: true, habitacion_id: 20 },

      // --- Ala Oeste - Piso 2 (IDs: 21-26) ---
      { codigo: 'O2-251-A', estado: 'Libre', activo: true, habitacion_id: 21 },
      { codigo: 'O2-252-A', estado: 'Libre', activo: true, habitacion_id: 22 },
      { codigo: 'O2-252-B', estado: 'Libre', activo: true, habitacion_id: 22 },
      { codigo: 'O2-253-A', estado: 'Libre', activo: true, habitacion_id: 23 },
      { codigo: 'O2-254-A', estado: 'Libre', activo: true, habitacion_id: 24 },
      { codigo: 'O2-254-B', estado: 'Libre', activo: true, habitacion_id: 24 },
      { codigo: 'O2-255-A', estado: 'Libre', activo: true, habitacion_id: 25 },
      { codigo: 'O2-256-A', estado: 'Libre', activo: true, habitacion_id: 26 },
      { codigo: 'O2-256-B', estado: 'Libre', activo: true, habitacion_id: 26 },

      // --- Ala Norte - Piso 3 (IDs: 27-31) ---
      { codigo: 'N3-301-A', estado: 'Libre', activo: true, habitacion_id: 27 },
      { codigo: 'N3-302-A', estado: 'Libre', activo: true, habitacion_id: 28 },
      { codigo: 'N3-302-B', estado: 'Libre', activo: true, habitacion_id: 28 },
      { codigo: 'N3-303-A', estado: 'Libre', activo: true, habitacion_id: 29 },
      { codigo: 'N3-304-A', estado: 'Libre', activo: true, habitacion_id: 30 },
      { codigo: 'N3-304-B', estado: 'Libre', activo: true, habitacion_id: 30 },
      { codigo: 'N3-305-A', estado: 'Libre', activo: true, habitacion_id: 31 },
      { codigo: 'N3-305-B', estado: 'Libre', activo: true, habitacion_id: 31 },

      // --- Ala Sur - Piso 3 (IDs: 32-36) ---
      { codigo: 'S3-351-A', estado: 'Libre', activo: true, habitacion_id: 32 },
      { codigo: 'S3-352-A', estado: 'Libre', activo: true, habitacion_id: 33 },
      { codigo: 'S3-352-B', estado: 'Libre', activo: true, habitacion_id: 33 },
      { codigo: 'S3-353-A', estado: 'Libre', activo: true, habitacion_id: 34 },
      { codigo: 'S3-354-A', estado: 'Libre', activo: true, habitacion_id: 35 },
      { codigo: 'S3-354-B', estado: 'Libre', activo: true, habitacion_id: 35 },
      { codigo: 'S3-355-A', estado: 'Libre', activo: true, habitacion_id: 36 },
      { codigo: 'S3-355-B', estado: 'Libre', activo: true, habitacion_id: 36 },

      // --- UCI y Unidad Coronaria (IDs: 37-46) ---
      ...Array.from({ length: 6 }, (_, i) => ({ codigo: `UCI-${i + 1}-A`, estado: 'Libre', activo: true, habitacion_id: 37 + i })),
      ...Array.from({ length: 4 }, (_, i) => ({ codigo: `UC-${i + 1}-A`, estado: 'Libre', activo: true, habitacion_id: 43 + i })),
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Camas', null, {});
  }
};
