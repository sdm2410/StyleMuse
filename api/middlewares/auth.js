//  MIDDLEWARE isAuth
const jwt = require("jsonwebtoken");
const { User } = require("../models/User"); // Ajustá el path si tu modelo está en otro lugar
const SECRET = 'misecreto';

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const token = authHeader.split(" ")[1]; // fix seguro
    const decoded = jwt.verify(token, SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Normalizar suscripción como booleano limpio
    const suscripcionActiva = user.suscripcionActiva === true || user.suscripcionActiva === 1;

    // Inyectar datos en req.user
    req.user = {
      id: user.id,
      email: user.email,
      suscripcionActiva
    };

    next();
  } catch (err) {
    console.error("❌ Error en isAuth:", err);
    return res.status(401).json({ message: "Token inválido o no autorizado" });
  }
};

module.exports = isAuth;
