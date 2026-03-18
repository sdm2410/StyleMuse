const { Noticia } = require("../models/Noticia.js");
const { registrarBitacora, nivelesCriticidad } = require("../models/hooks/bitacora");
const { getIp } = require("../middlewares/getIp");
const { calcularDV } = require("../models/DV");


const registrarNoticia = async (req, res) => {
  try {
    const { tituloNoticia, escritorAsignado, categoria } = req.body;

    // Crear noticia sin imagen y contenido (no existen en la tabla)
    const noticia = await Noticia.create({
      tituloNoticia,
      fechaPublicacion: new Date().toISOString().split("T")[0],
      escritorAsignado,
      categoria,
      estado: 1,
    });

    // IP del usuario
    const ipUsuario = req.ipUsuario || getIp(req);

    // Registrar bitácora
    await registrarBitacora({
      accionRealizada: "ESCRITURA NOTICIA",
      fechaAccion: new Date(),
      descripcionAccion: `El usuario ${escritorAsignado} publicó una noticia: ${tituloNoticia}`,
      ipUsuario,
      idUsuario: req.user.id, // Usar el ID del usuario desde el token
      nivelCriticidad: nivelesCriticidad.contenido,
    });

    res.json({ message: "Noticia creada con éxito.", noticia });
  } catch (error) {
    console.error("Error al registrar noticia:", error);
    res.status(500).json({ error: "Error interno al registrar noticia" });
  }
};

const deleteLogicalNoticia = async (req, res) => {
  try {
    const { id } = req.params;

    const noticia = await Noticia.findByPk(id);
    if (!noticia) {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }

    // Estado en 0 = eliminado
    await noticia.update({ estado: 0 });

    const ipUsuario = req.ipUsuario || getIp(req);

    // Registrar bitácora
    await registrarBitacora(req.app.get("db"), {
      accionRealizada: "BORRADO LÓGICO",
      fechaAccion: new Date(),
      descripcionAccion: `La noticia con ID ${id} fue marcada como eliminada (estado = 0).`,
      ipUsuario,
      idUsuario: id,
      nivelCriticidad: nivelesCriticidad.administracion,
    });

    res.json({ message: "Noticia eliminada lógicamente con éxito." });
  } catch (error) {
    console.error("Error en eliminación lógica:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerNoticias = async (req, res) => {
  try {
    const noticias = await Noticia.findAll({
      where: {
        estado: 1 // Solo mostrar noticias activas
      },
      order: [
        ['fechaPublicacion', 'DESC'] // Más recientes primero
      ]
    });

    res.json({ noticias });
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    res.status(500).json({ error: "Error interno al obtener noticias" });
  }
};

module.exports = {
  registrarNoticia,
  deleteLogicalNoticia,
  obtenerNoticias,
};
