const signosVitalesServices = require('../../services/signosVitalesServices');
const { validationResult } = require('express-validator');

exports.registrarSignosVitales = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const nuevoSignosvitales = await signosVitalesServices.registrarSignosVitales(req.body);
    res.status(201).json({
        message: 'Signos vitales registrados exitosamente.',
        signosVitales: nuevoSignosvitales
    });
  } catch (error) {
    switch (error.message) {
      case 'Admision no encontrado':
        return res.status(404).json({ message: error.message });
      case 'La admision no se encuentra disponible':
      case 'La admision no permite nuevos registros de signos vitales':
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al registrar los signos vitales' });
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
    await signosVitalesServices.setActivo(id, activo);
    res.status(200).json({ message: `Signos vitales ${activo ? 'activados' : 'desactivados'} exitosamente.` });
  } catch (error) {
    switch (error.message) {
      case 'Signos vitales no encontrados':
        return res.status(404).json({ message: error.message });
      case 'Los signos vitales no puede cambiar su estado activo':
      case `Los signos vitales ya se encuentra ${activo ? 'activos' : 'inactivos'}.`:
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al cambiar el estado activo de los signos vitales' });
    }
  }
}
