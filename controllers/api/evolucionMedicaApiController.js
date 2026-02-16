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

exports.setActivo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  const { activo } = req.body;
  try {
    const { id } = req.params;
    await evolucionMedicaServices.setActivo(id, activo);
    res.status(200).json({ message: `Evolucion medica ${activo ? 'activada' : 'desactivada'} exitosamente.` });
  } catch (error) {
    switch (error.message) {
      case 'Evolucion medica no encontrada':
        return res.status(404).json({ message: error.message });
      case 'La evolucion medica no puede cambiar su estado activo':
      case `La evolucion medica ya se encuentra ${activo ? 'activa' : 'inactiva'}.`:
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al cambiar el estado activo de la evolucion medica' });
    }
  }
}