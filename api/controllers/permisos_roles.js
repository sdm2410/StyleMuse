const { DigitoVerificador } = require("../models/DigitoVerificador");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registrarBitacora, nivelesCriticidad } = require("../models/hooks/bitacora");
const { getIp } = require("../middlewares/getIp");
const { calcularDV } = require("../models/DV");
const { Permiso } = require("../models/Permiso");
const { actualizarDV } = require("./DVC");

const SECRET = 'misecreto'

const registrarPermiso = async (req, res) => {
  try {
    const { tipoDePermisos, descripcionPermiso} = req.body;
    const ipUsuario = req.ipUsuario || getIp(req);

    const permiso = await Permiso.create({
      tipoDePermisos,
      descripcionPermiso,
      estado: 1
    });

    // 🔹 Registrar en bitácora manualmente (además del hook si querés doble control)
    await registrarBitacora({
      accionRealizada: "INSERTAR",
      fechaAccion: new Date(),
      descripcionAccion: `Se insertó permiso ${permiso.tipoDePermisos}`,
      ipUsuario,
      idUsuario: permiso.id,
      nivelCriticidad: nivelesCriticidad.contenido,
    });
    res.json({ message: "Permiso creado con éxito." });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
    registrarPermiso, 
}
