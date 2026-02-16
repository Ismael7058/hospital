const evolucionMedicaServices = require('../../services/evolucionMedicaServices')
const { validationResult } = require('express-validator');

exports.registrarEvolucionMedica = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { admision_id, diagnostico, tratamiento_ajuste} = req.body;

    const nuevaEvolucion = await evolucionMedicaServices.registrarEvolucionMedica(admision_id, diagnostico, tratamiento_ajuste);
    res.status(201).json({
        message: 'Evolucion medica registrada exitosamente.',
        evolucion: nuevaEvolucion
    });
  } catch (error) {
    switch (error.message) {
      case 'Admision no encontrado':
        return res.status(404).json({ message: error.message });
      case 'La admision no se encuentra disponible':
      case 'La admision no permite nuevos registros de evolucion medica':
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al registrar la admisión' });
    }
  }
}