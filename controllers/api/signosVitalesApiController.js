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
