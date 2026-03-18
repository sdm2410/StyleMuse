const { Comentario } = require("../models/Comentario");
const { User } = require("../models/User");
const { Bitacora } = require("../models/Bitacora");
const { getIp } = require("../middlewares/getIp");

async function crearComentario(req, res) {
  try {
    console.log("📌 LLEGÓ AL CONTROLADOR crearComentario");
    console.log("📌 TOKEN DECODIFICADO:", req.user);

    const { contenido, noticiaId } = req.body;

    // 📌 El token SIEMPRE debe venir porque isAuth ya lo valida
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "Token inválido — no se encontró ID" });
    }

    // 📌 Traemos usuario real de la BD
    const usuarioDb = await User.findByPk(userId);

    if (!usuarioDb) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log("📌 SUSCRIPCIÓN EN BD:", usuarioDb.suscripcionActiva);

    // 📌 Validación REAL de suscripción
    if (
      usuarioDb.suscripcionActiva != 1 &&
      usuarioDb.suscripcionActiva != true &&
      usuarioDb.suscripcionActiva != "1" &&
      usuarioDb.suscripcionActiva != "true"
    ) {
      return res.status(403).json({ error: "Solo los suscriptores pueden comentar" });
    }

    // 📌 Crear comentario
    const nuevoComentario = await Comentario.create({
      contenido,
      usuarioId: userId,
      noticiaId
    });

    // 📌 Bitácora
    await Bitacora.create({
      accionRealizada: "COMENTARIO",
      fechaAccion: new Date(),
      descripcionAccion: `Usuario ${usuarioDb.nombre} comentó en noticia ${noticiaId}`,
      ipUsuario: req.ipUsuario || getIp(req),
      idUsuario: userId,
      nivelCriticidad: 1
    });

    console.log("✅ COMENTARIO GUARDADO:", nuevoComentario.id);

    return res.json(nuevoComentario);

  } catch (err) {
    console.log("❌ ERROR COMPLETO:", err);
    return res.status(500).json({ error: "Error interno en comentarios" });
  }
}

async function obtenerComentarios(req, res) {
  try {
    const { noticiaId } = req.params;

    const comentarios = await Comentario.findAll({
      where: { noticiaId },
      include: [
        {
          model: User,
          as: "usuario",
          attributes: ["nombre", "apellido"],
        },
      ],
      order: [["fecha", "ASC"]],
    });

    return res.json(comentarios);
  } catch (err) {
    console.log("❌ Error obteniendo comentarios:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}

module.exports = { crearComentario, obtenerComentarios };
