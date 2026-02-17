const estudioSolicitadoServices = require('../../services/estudioSolicitadoServices')
const { validationResult } = require('express-validator');

exports.registrarEstudioSolicitado = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { admision_id, estudio, descripcion} = req.body;

    const nuevoEstudio = await estudioSolicitadoServices.registrarEstudioSolicitado(admision_id, estudio, descripcion);
    res.status(201).json({
        message: 'Estudio solicitado registrada exitosamente.',
        estudio: nuevoEstudio
    });
  } catch (error) {
    switch (error.message) {
      case 'Admision no encontrado':
        return res.status(404).json({ message: error.message });
      case 'La admision no se encuentra disponible':
      case 'La admision no permite nuevos registros de estudios solicitados':
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al registrar el estudio solicitado' });
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
    await estudioSolicitadoServices.setActivo(id, activo);
    res.status(200).json({ message: `Estudio solicitado ${activo ? 'activado' : 'desactivado'} exitosamente.` });
  } catch (error) {
    switch (error.message) {
      case 'Estudio solicitado no encontrada':
        return res.status(404).json({ message: error.message });
      case 'El estudio solicitado no puede cambiar su estado activo':
      case `El estudio solicitado ya se encuentra ${activo ? 'activo' : 'inactivo'}.`:
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al cambiar el estado activo del estudio solicitado' });
    }
  }
}