const medicacionServices = require('../../services/medicacionServices');
const { validationResult } = require('express-validator');

exports.registrarMedicacion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const nuevaMedicacion = await medicacionServices.registrarMedicacion(req.body);
    res.status(201).json({
        message: 'Medicacion registrado exitosamente.',
        medicacion: nuevaMedicacion
    });
  } catch (error) {
    switch (error.message) {
      case 'Admision no encontrado':
        return res.status(404).json({ message: error.message });
      case 'La admision no se encuentra disponible':
      case 'La admision no permite nuevos registros de medicaciones':
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al registrar la medicacion' });
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
    await medicacionServices.setActivo(id, activo);
    res.status(200).json({ message: `Medicacion ${activo ? 'activada' : 'desactivada'} exitosamente.` });
  } catch (error) {
    switch (error.message) {
      case 'Medicacion no encontrada':
        return res.status(404).json({ message: error.message });
      case 'La medicacion no puede cambiar su estado activo':
      case `La medicacion ya se encuentra ${activo ? 'activa' : 'inactiva'}.`:
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al cambiar el estado activo de la medicacion' });
    }
  }
}