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
