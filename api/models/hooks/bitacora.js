const nivelesCriticidad = {
  seguridad: 1,      // Operaciones críticas de seguridad
  administracion: 2, // Operaciones administrativas
  contenido: 3       // Operaciones de contenido
}

const registrarBitacora = async ({
  accionRealizada = null,
  fechaAccion = null,
  descripcionAccion = null,
  ipUsuario = null,
  idUsuario = null,
  nivelCriticidad= nivelesCriticidad.contenido,
}) => {
  try {
    const { Bitacora } = require('../Bitacora');

    await Bitacora.create({
      accionRealizada,
      fechaAccion,
      descripcionAccion,
      ipUsuario,
      idUsuario,
      nivelCriticidad
    });
      return true;
  } catch (err) {
    console.error('Error al registrar bitácora:', err);
    return false;
  }
};

module.exports = {
  registrarBitacora,
  nivelesCriticidad
}