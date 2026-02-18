const { Admision, SignosVitales } = require('../db/models');

exports.registrarSignosVitales = async (datoSignos) => {
  const { admision_id, frecuencia_cardiaca, presion_arterial, saturacion_oxigeno, temperatura } = datoSignos;
  const admision = await Admision.findByPk(admision_id);
  if (!admision) {
    throw new Error('Admision no encontrado');
  }
  if (!admision.activo)
    {
    throw new Error('La admision no se encuentra disponible');
  }
  if (admision.estado_atencion != 'En Atencion')
    {
    throw new Error('La admision no permite nuevos registros de signos vitales');
  }

  const nuevaMedicacion = await SignosVitales.create({
    frecuencia_cardiaca: frecuencia_cardiaca,
    presion_arterial: presion_arterial,
    saturacion_oxigeno: saturacion_oxigeno,
    temperatura: temperatura,
    fecha_hora: new Date(),
    activo: true,
    admision_id: admision_id
  });

  return nuevaMedicacion;
};

exports.setActivo = async (id, activo) => {
  const signosVitales = await SignosVitales.findByPk(id, {
    include: [
      {
        model: Admision,
        as: 'admision'
      }
    ]
  });
  if (!signosVitales) {
    throw new Error('Signos vitales no encontrados');
  }

  if (signosVitales.activo === activo) {
    throw new Error(`Los signos vitales ya se encuentra ${activo ? 'activos' : 'inactivos'}.`);
  }

  if (signosVitales.admision.estado_atencion != 'En Espera') {
    throw new Error('Los signos vitales no puede cambiar su estado activo');
  }

  signosVitales.activo = activo;
  await signosVitales.save();
}
