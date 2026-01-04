const antecedentePacienteServices = require('../../services/antecedentePacienteServices');
const { validationResult } = require('express-validator');

exports.getAntecedentePaciente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const antecedente = await antecedentePacienteServices.getAntecedentePaciente(id);
    res.status(200).json({ antecedente });
  } catch (error) {
    switch (error.message) {
      case 'Antecedente no encontrado':
        return res.status(404).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al obtener el antecedente' });
    }
  }
};

exports.registrarAntecedentePaciente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const antecedente = await antecedentePacienteServices.registrarAntecedentePaciente(req.body);
    res.status(201).json({
        message: 'Antecedente registrado correctamente',
        antecedentePacienteId: antecedente.id
    });
  } catch (error) {
    switch (error.message) {
      default:
        res.status(500).json({ message: 'Error interno del servidor al registrar el antecedente' });
    }
  }
};

exports.setActivo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { activo } = req.body;
  try {
    const { id } = req.params;
    await antecedentePacienteServices.setActivo(id, activo);
    res.status(200).json({ message: `Antecedente ${activo ? 'activado' : 'desactivado'} correctamente` });
  } catch (error) {
    switch (error.message) {
      case 'Antecedente no encontrado':
        return res.status(404).json({ message: error.message });
      case `El antecedente ya se encuentra ${activo ? 'activo' : 'inactivo'}`:
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al cambiar el estado del antecedente' });
    }
  }
};

exports.setValidacion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { validado } = req.body;
  try {
    const { id } = req.params;
    await antecedentePacienteServices.setValidacion(id, validado);
    res.status(200).json({ message: `Antecedente ${validado ? 'validado' : 'no validado'} correctamente` });
  } catch (error) {
    switch (error.message) {
      case 'Antecedente no encontrado':
        return res.status(404).json({ message: error.message });
      case `El antecedente ya se encuentra ${validado ? 'validado' : 'no validado'}`:
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al validar el antecedente' });
    }
  }
};

exports.editarAntecedentePaciente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    await antecedentePacienteServices.editarAntecedentePaciente(id, req.body);
    res.status(200).json({ message: 'Antecedente modificado correctamente' });
  } catch (error) {
    switch (error.message) {
      case 'Antecedente no encontrado':
        return res.status(404).json({ message: error.message });
      case 'El antecedente no fue modificado':
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al editar el antecedente' });
    }
  }
};