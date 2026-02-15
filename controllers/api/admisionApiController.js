const admisionServices = require('../../services/admisionServices')
const { validationResult } = require('express-validator');

exports.registrarAdmision = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const admisionData = {
      ...req.body,
      usuario_agenda: req.usuario.id,
      modo: req.query.modo
    };

    const nuevaAmision = await admisionServices.registrarAdmision(admisionData);
    res.status(201).json({
        message: 'Admision registrada exitosamente.',
        admision: nuevaAmision
    });
  } catch (error) {
    switch (error.message) {
      case 'Paciente no encontrado':
      case 'Medico no encontrado':
      case 'Turno no encontrado':
        return res.status(404).json({ message: error.message });
      case 'El paciente ya se encuentra admitido':
      case 'El turno ya fue utilizado':
      case 'El turno esta cancelado':
      case 'El turno esta vencido por la fecha y hora':
      case 'El turno no era para la fecha de hoy':
      case 'La identificacion ya se encuentra registrada':
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
    await admisionServices.setActivo(id, activo);
    res.status(200).json({ message: `Admision ${activo ? 'activado' : 'desactivado'} exitosamente.` });
  } catch (error) {
    switch (error.message) {
      case 'Admision no encontrada':
        return res.status(404).json({ message: error.message });
      case 'La admision no puede cambiar su estado activo':
      case `La admision ya se encuentra ${activo ? 'activa' : 'inactiva'}.`:
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al cambiar el estado activo de la admision' });
    }
  }
}

exports.setEstado = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  const { estado } = req.body;
  try {
    const { id } = req.params;
    await admisionServices.setEstado(id, estado);
    res.status(200).json({ message: `El estado de la admision admision cambio a ${estado} exitosamente` });
  } catch (error) {
    switch (error.message) {
      case 'Admision no encontrada':
        return res.status(404).json({ message: error.message });
        case 'La admision no puede cambiar su estado':
        case 'La admision no puede recibir un alta medica':
        case 'La admision no puede ser cancelada':
        case `La admision ya se encuentra con el estado ${estado}`:
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al cambiar el estado de la admision' });
    }
  }
}