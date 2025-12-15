'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Habitaciones', [
      // --- Ala Norte - Piso 1 (ID: 1) - Hospitalización General ---
      { numero: '101', capacidad: 1, descripcion: 'Habitación Individual', ala_id: 1 },
      { numero: '102', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 1 },
      { numero: '103', capacidad: 1, descripcion: 'Habitación Individual', ala_id: 1 },
      { numero: '104', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 1 },
      { numero: '105', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 1 },
      { numero: '106', capacidad: 1, descripcion: 'Habitación Individual', ala_id: 1 },
      { numero: '107', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 1 },
      { numero: '108', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 1 },

      // --- Ala Sur - Piso 1 (ID: 2) - Pediatría y Maternidad ---
      { numero: '151', capacidad: 1, descripcion: 'Habitación de Pediatría', ala_id: 2 },
      { numero: '152', capacidad: 1, descripcion: 'Habitación de Maternidad', ala_id: 2 },
      { numero: '153', capacidad: 1, descripcion: 'Habitación de Pediatría', ala_id: 2 },
      { numero: '154', capacidad: 1, descripcion: 'Habitación de Maternidad', ala_id: 2 },
      { numero: '155', capacidad: 2, descripcion: 'Habitación de Pediatría Doble', ala_id: 2 },

      // --- Ala Este - Piso 2 (ID: 3) - Especialidades y Cirugía ---
      { numero: '201', capacidad: 1, descripcion: 'Habitación Post-operatorio', ala_id: 3 },
      { numero: '202', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 3 },
      { numero: '203', capacidad: 1, descripcion: 'Habitación Post-operatorio', ala_id: 3 },
      { numero: '204', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 3 },
      { numero: '205', capacidad: 1, descripcion: 'Habitación Individual', ala_id: 3 },
      { numero: '206', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 3 },
      { numero: '207', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 3 },

      // --- Ala Oeste - Piso 2 (ID: 4) - Traumatología y Rehabilitación ---
      { numero: '251', capacidad: 1, descripcion: 'Habitación de Rehabilitación', ala_id: 4 },
      { numero: '252', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 4 },
      { numero: '253', capacidad: 1, descripcion: 'Habitación de Rehabilitación', ala_id: 4 },
      { numero: '254', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 4 },
      { numero: '255', capacidad: 1, descripcion: 'Habitación Individual', ala_id: 4 },
      { numero: '256', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 4 },

      // --- Ala Norte - Piso 3 (ID: 5) - Cardiología ---
      { numero: '301', capacidad: 1, descripcion: 'Habitación Individual', ala_id: 5 },
      { numero: '302', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 5 },
      { numero: '303', capacidad: 1, descripcion: 'Habitación Individual', ala_id: 5 },
      { numero: '304', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 5 },
      { numero: '305', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 5 },

      // --- Ala Sur - Piso 3 (ID: 6) - Neurología ---
      { numero: '351', capacidad: 1, descripcion: 'Habitación Individual', ala_id: 6 },
      { numero: '352', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 6 },
      { numero: '353', capacidad: 1, descripcion: 'Habitación Individual', ala_id: 6 },
      { numero: '354', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 6 },
      { numero: '355', capacidad: 2, descripcion: 'Habitación Doble', ala_id: 6 },

      // --- Unidad de Cuidados Intensivos (UCI) (ID: 7) ---
      { numero: 'UCI-01', capacidad: 1, descripcion: 'Box de UCI', ala_id: 7 },
      { numero: 'UCI-02', capacidad: 1, descripcion: 'Box de UCI', ala_id: 7 },
      { numero: 'UCI-03', capacidad: 1, descripcion: 'Box de UCI', ala_id: 7 },
      { numero: 'UCI-04', capacidad: 1, descripcion: 'Box de UCI', ala_id: 7 },
      { numero: 'UCI-05', capacidad: 1, descripcion: 'Box de UCI', ala_id: 7 },
      { numero: 'UCI-06', capacidad: 1, descripcion: 'Box de UCI', ala_id: 7 },

      // --- Unidad Coronaria (ID: 8) ---
      { numero: 'UC-01', capacidad: 1, descripcion: 'Box de Unidad Coronaria', ala_id: 8 },
      { numero: 'UC-02', capacidad: 1, descripcion: 'Box de Unidad Coronaria', ala_id: 8 },
      { numero: 'UC-03', capacidad: 1, descripcion: 'Box de Unidad Coronaria', ala_id: 8 },
      { numero: 'UC-04', capacidad: 1, descripcion: 'Box de Unidad Coronaria', ala_id: 8 },

      // --- Consultorios Externos (ID: 10) ---
      ...Array.from({ length: 20 }, (_, i) => ({
        numero: `C-${101 + i}`,
        capacidad: 0,
        descripcion: 'Consultorio de atención ambulatoria',
        ala_id: 10
      })),

      // --- Quirófanos Centrales (ID: 13) ---
      ...Array.from({ length: 5 }, (_, i) => ({
        numero: `Q-${1 + i}`,
        capacidad: 0,
        descripcion: 'Sala de operaciones',
        ala_id: 13
      })),
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Habitaciones', null, {});
  }
};
