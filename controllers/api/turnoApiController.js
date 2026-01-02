const turnoServices = require('../../services/turnoServices');
const { validationResult } = require('express-validator');

exports.registrarTurno = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const turnoData = {
      ...req.body,
      usuario_agenda: req.usuario.id
    };
    const nuevoTurno = await turnoServices.registrarTurno(turnoData);
    res.status(201).json({
        message: 'Turno registrado exitosamente.',
        turno: nuevoTurno
    });
  } catch (error) {
    switch (error.message) {
      case 'Medico no encontrado':
      case 'Paciente no encontrado':
          return res.status(404).json({ message: error.message });
      case 'El medico no atiende en ese horario':
      case 'El medico no se encuentra disponible en esa fecha':
      case 'El turno se superpone con otro turno vigente':
      case 'El paciente ya tiene un turno en ese horario':
          return res.status(409).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al registrar el turno' });
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
    await turnoServices.setActivo(id, activo);

    res.status(200).json({ message: `Turno ${activo ? 'activado' : 'desactivado'} exitosamente.` });
  } catch (error) {
    switch (error.message) {
      case 'Turno no encontrado':
      case 'Medico no encontrado':
      case 'Paciente no encontrado':
          return res.status(404).json({ message: error.message });
      case `El turno ya se encuentra ${activo ? 'activo' : 'inactivo'}.`:
      case 'El medico no atiende en ese horario':
      case 'El medico no se encuentra disponible en esa fecha':
      case 'El turno se superpone con otro turno vigente':
      case 'El paciente ya tiene un turno en ese horario':
          return res.status(409).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al cambiar el estado activo el turno' });
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
    await turnoServices.setEstado(id, estado);
    
    res.status(200).json({ message: `Estado del turno cambiado a ${estado} exitosamente.` });
  } catch (error) {
    switch (error.message) {
      case 'Turno no encontrado':
        return res.status(404).json({ message: error.message });
      case `El estado del turno ya era: ${estado}`:
          return res.status(409).json({ message: error.message });
      default:
          res.status(500).json({ message: `Error interno del servidor al cambiar el estado del turno` });
    }
  }
}

exports.editarTurno = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    await turnoServices.editarTurno(id, req.body);
    res.status(200).json({ message: 'Turno modificado exitosamente'})
  } catch (error) {
    switch (error.message) {
      case 'Turno no encontrado':
      case 'Medico no encontrado':
      case 'Paciente no encontrado':
          return res.status(404).json({ message: error.message });
      case 'El medico no atiende en ese horario':
      case 'El medico no se encuentra disponible en esa fecha':
      case 'El turno se superpone con otro turno vigente':
      case 'El paciente ya tiene un turno en ese horario':
          return res.status(409).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al registrar el turno' });
    }
  }
}



exports.getTurno = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const turno = await turnoServices.getTurno(id);
    res.status(200).json({ turno });
  } catch (error) {
    switch (error.message) {
      case 'Turno no encontrado':
        return res.status(404).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al obtener el turno' });
    }
  }
}

exports.eliminarTurno = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    await turnoServices.eliminarTurno(id);
    res.status(200).json({ message: 'Turno eliminado correctamente.' });
  } catch (error) {
    switch (error.message) {
      case 'Turno no encontrado':
        return res.status(404).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al eliminar el turno' });
    }
  }
}
