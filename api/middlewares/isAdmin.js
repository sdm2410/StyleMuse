const { User } = require("../models/User");
const { Rol } = require("../models/Rol");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Rol, as: "roles" }]
    });

    const tieneRolAdmin = user.roles?.some(r => r.nombreRol === "administrador");
    if (!tieneRolAdmin) {
      return res.status(403).json({ message: "Acceso denegado: se requiere rol administrador" });
    }

    next();
  } catch (err) {
    console.error("❌ Error en isAdmin:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = isAdmin;
