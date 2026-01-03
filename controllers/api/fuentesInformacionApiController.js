const fuentesInformacionServices = require('../../services/fuentesInformacionServices');
const { validationResult, body } = require('express-validator');

exports.getFuente = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const fuente = await fuentesInformacionServices.getFuente(id);
    res.status(200).json({ fuente });
  } catch (error) {
    switch (error.message) {
      case 'Fuente de Informacion no encontrada':
        return res.status(404).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al obtener la fuente de informacion' });
    }
  }
};

exports.registrarFuente = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }

  try {
    const fuente = await fuentesInformacionServices.registrarFuente(req.body);

    res.status(201).json({
        message: 'Fuente de informacion registrada correctamente',
        fuenteId: fuente.id
    });
  } catch (error) {
    switch (error.message) {
      case 'La fuente de informacion ya existe':
        return res.status(409).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al registrar la fuente de informacion' });
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
    await fuentesInformacionServices.setActivo(id, activo);
    res.status(200).json({ message: `La Fuente de informacion ${activo ? 'activada' : 'desactivada'} correctamente`});
  } catch (error) {
    switch (error.message) {
      case 'Fuente de Informacion no encontrada':
        return res.status(404).json({ message: error.message });
      case `La Fuente de informacion ya se encuentra ${activo ? 'activa' : 'inactiva'}`:
        return res.status(409).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al cambiar el estado de activo de la fuente de informacion' });
    }
  }
};

exports.editarFuente = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    await fuentesInformacionServices.editarFuente(id, req.body);
    res.status(200).json({ message: 'La Fuente de informacion modificada correctamente'});
  } catch (error) {
    switch (error.message) {
      case 'Fuente de Informacion no encontrada':
        return res.status(404).json({ message: error.message });
      case 'La fuente de informacion ya existe':
      case 'No se han realizado cambios a la fuente de informacion':
        return res.status(409).json({ message: error.message });
      default:
          res.status(500).json({ message: 'Error interno del servidor al editar la fuente de informacion' });
    }
  }
};