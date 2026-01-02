const { validationResult } = require('express-validator');
const pacienteServices = require('../../services/pacienteServices');

exports.postRegistrar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const nuevoPaciente = await pacienteServices.registerPaciente(req.body);

    res.status(201).json({
      message: 'Paciente registrado exitosamente.',
      paciente: {
        id: nuevoPaciente.id
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor al registrar el paciente.' });
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
        
        await pacienteServices.setActivo(id, activo);

        const message = `Paciente ${activo ? 'dado de alta' : 'eliminado'} exitosamente.`;
        res.status(200).json({ message });
    } catch (error) {
        switch (error.message) {
            case 'Paciente no encontrado':
                return res.status(404).json({ message: error.message });
            case 'No se puede desactivar el ala porque tiene camas ocupadas.':
            case `El paciente ya se encuentra ${activo ? 'activo' : 'inactivo'}.`:
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor.' });
        }
    }
}

exports.editInformacion = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;

    await pacienteServices.editInformacion(id, req.body);

    res.status(200).json({ message: "Informacion del paciente modificada correctamente" });
  } catch (error) {
      switch (error.message) {
          case 'Paciente no encontrado':
          case 'Error al intentar modificar al paciente':
              return res.status(404).json({ message: error.message });
          default:
              res.status(500).json({ message: 'Error interno del servidor al registrar el paciente.' });
      }
  }
}

exports.editIdentificacion = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { identificaciones } = req.body;

    await pacienteServices.editIdentificacion(id, identificaciones);

    res.status(200).json({ message: "Identificaciones modificadas correctamente" });
  } catch (error) {
      switch (error.message) {
          case 'Paciente no encontrado':
              return res.status(404).json({ message: error.message });
          default:
              res.status(500).json({ message: 'Error interno del servidor.' });
      }
  }
}


exports.buscarPacientes = async (req, res) => {
    try {
        const searchTerm = req.query.q || '';

        const pacientes = await pacienteServices.buscarPacientes(searchTerm);

        res.status(200).json(pacientes);
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor al realizar la búsqueda.' });
    }
};