const cuidadoServices = require('../../services/cuidadoServices.js')
const { validationResult } = require('express-validator');

exports.registrarCuidado = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { admision_id, descripcion } = req.body;

    const nuevoCuidado = await cuidadoServices.registrarCuidado(admision_id, descripcion);
    res.status(201).json({
        message: 'Cuidado preeliminar registrado exitosamente.',
        cuidado: nuevoCuidado
    });
  } catch (error) {
    switch (error.message) {
      case 'Admision no encontrado':
        return res.status(404).json({ message: error.message });
      case 'La admision no se encuentra disponible':
      case 'La admision no permite nuevos registros de cuidados preeliminares':
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al registrar el cuidado preeliminar' });
    }
  }
}