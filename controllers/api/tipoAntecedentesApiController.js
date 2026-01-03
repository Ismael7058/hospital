const tipoAntecedentesServices = require('../../services/tipoAntecedentesServices');
const { validationResult } = require('express-validator');

exports.getTipoAntecedentes = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const tipoAntecedente = await tipoAntecedentesServices.getTipoAntecedentes(id);
    res.status(200).json({ tipoAntecedente });
  } catch (error) {
    switch (error.message) {
      case 'Tipo de antecedente no encontrado':
        return res.status(404).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al obtener el tipo de antecedente' });
    }
  }
};

exports.registrarTipoAntecedentes = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tipoAntecedente = await tipoAntecedentesServices.registrarTipoAntecedentes(req.body);

    res.status(201).json({
      message: 'Tipo de antecedente registrado correctamente',
      tipoAntecedenteId: tipoAntecedente.id
    });
  } catch (error) {
    switch (error.message) {
      case 'El tipo de antecedente ya existe':
        return res.status(409).json({ message: error.message });
      default:
        res.status(500).json({ message: 'Error interno del servidor al registrar el tipo de antecedente' });
    }
  }
};

exports.setActivo = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }
  const { activo } = req.body;
  try {
    const { id } = req.params;
    await tipoAntecedentesServices.setActivo(id, activo);
    res.status(200).json({ message: `El tipo de antecedente ${activo ? 'activado' : 'desactivado'} correctamente`});
  } catch (error) {
    switch (error.message) {
      case 'Tipo de antecedente no encontrado':
        return res.status(404).json({ message: error.message });
      case `El tipo de antecedente ya se encuentra ${activo ? 'activo' : 'inactivo'}`:
        return res.status(409).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al cambiar el estado de activo del tipo de antecedente' });
    }
  }
};

exports.editarTipoAntecedentes = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    await tipoAntecedentesServices.editarTipoAntecedentes(id, req.body);
    res.status(200).json({ message: 'Tipo de informacion modificado correctamente'});
  } catch (error) {
    switch (error.message) {
      case 'Tipo de antecedente no encontrado':
        return res.status(404).json({ message: error.message });
      case 'El tipo de antecedente ya existe':
      case 'No se han realizado cambios al tipo de antecente':
        return res.status(409).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al editar el tipo de antecedente' });
    }
  }
};