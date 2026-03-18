const { User } = require("../models/User");
const { Rol } = require("../models/Rol");
const { Bitacora } = require("../models/Bitacora");
const sequelize = require("../config/db"); // instancia de Sequelize
const bcrypt = require("bcrypt");

// Listar todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "nombre", "apellido", "email", "estado", "suscripcionActiva", "añoAlta"],
      include: [{ model: Rol, as: "roles" }]
    });
    res.json(users);
  } catch (err) {
    console.error("❌ Error obteniendo usuarios:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Ver perfil de un usuario específico
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "nombre", "apellido", "email", "estado", "suscripcionActiva", "añoAlta"],
      include: [{ model: Rol, as: "roles" }]
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error obteniendo usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Desbloquear usuario
const desbloquearUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.update({ estado: 1 });

    await Bitacora.create({
      accionRealizada: "DESBLOQUEAR USUARIO",
      descripcionAccion: `Usuario ${user.email} desbloqueado`,
      ipUsuario: req.ip,
      idUsuario: user.id,
      nivelCriticidad: 2
    });

    res.json({ message: `Usuario ${user.email} desbloqueado correctamente` });
  } catch (err) {
    console.error("❌ Error desbloqueando usuario:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.destroy();

    await Bitacora.create({
      accionRealizada: "ELIMINAR USUARIO",
      descripcionAccion: `Usuario ${user.email} eliminado`,
      ipUsuario: req.ip,
      idUsuario: user.id,
      nivelCriticidad: 3
    });

    res.json({ message: `Usuario ${id} eliminado definitivamente` });
  } catch (err) {
    console.error("❌ Error eliminando usuario:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Asignar rol
const asignarRol = async (req, res) => {
  try {
    const { email, rol } = req.body;
    if (!email || !rol) return res.status(400).json({ error: "Email y rol son requeridos" });

    let rolObj = await Rol.findOne({ where: { nombreRol: rol } });
    if (!rolObj) {
      rolObj = await Rol.create({ nombreRol: rol, descripcionRol: `Rol ${rol}`, estado: 1 });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.addRole(rolObj);

    await Bitacora.create({
      accionRealizada: "ASIGNAR ROL",
      descripcionAccion: `Rol ${rol} asignado a ${user.email}`,
      ipUsuario: req.ip,
      idUsuario: user.id,
      nivelCriticidad: 2
    });

    res.json({ message: `Rol ${rol} asignado a ${email}` });
  } catch (err) {
    console.error("❌ Error asignando rol:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Quitar rol
const quitarRol = async (req, res) => {
  try {
    const { email, rol } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const rolObj = await Rol.findOne({ where: { nombreRol: rol } });
    if (!rolObj) return res.status(404).json({ error: "Rol no encontrado" });

    await user.removeRole(rolObj);

    await Bitacora.create({
      accionRealizada: "QUITAR ROL",
      descripcionAccion: `Rol ${rol} quitado a ${user.email}`,
      ipUsuario: req.ip,
      idUsuario: user.id,
      nivelCriticidad: 2
    });

    res.json({ message: `Rol ${rol} quitado a ${email}` });
  } catch (err) {
    console.error("❌ Error quitando rol:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Resetear contraseña
const resetearPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevaPassword = "temporal1234"; // Podés generar aleatoria
    const hashed = await bcrypt.hash(nuevaPassword, 10);

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.update({ contraseña: hashed });

    await Bitacora.create({
      accionRealizada: "RESETEAR CONTRASEÑA",
      descripcionAccion: `Contraseña reseteada para ${user.email}`,
      ipUsuario: req.ip,
      idUsuario: user.id,
      nivelCriticidad: 4
    });

    res.json({ message: `Contraseña reseteada para ${user.email}`, nuevaPassword });
  } catch (err) {
    console.error("❌ Error reseteando contraseña:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Verificar BD
const verificarBD = async (req, res) => {
  try {
    const usuarios = await User.count();
    const roles = await Rol.count();

    await Bitacora.create({
      accionRealizada: "VERIFICAR BD",
      descripcionAccion: `Usuarios: ${usuarios}, Roles: ${roles}`,
      ipUsuario: req.ip,
      idUsuario: req.user?.id || 0,
      nivelCriticidad: 1
    });

    res.json({ message: `Usuarios: ${usuarios}, Roles: ${roles}` });
  } catch (err) {
    res.status(500).json({ error: "Error verificando BD" });
  }
};

// Rectificar BD
const rectificarBD = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    for (const u of usuarios) {
      if (![0, 1].includes(u.estado)) {
        u.estado = 1; // activo por defecto
      }
      if (![0, 1].includes(u.suscripcionActiva)) {
        u.suscripcionActiva = 0; // inactiva por defecto
      }
      await u.save();
    }

    const roles = ["usuario", "escritor", "administrador"];
    for (const r of roles) {
      const existe = await Rol.findOne({ where: { nombreRol: r } });
      if (!existe) {
        await Rol.create({ nombreRol: r, descripcionRol: `Rol ${r}`, estado: 1 });
      }
    }

    await Bitacora.create({
      accionRealizada: "RECTIFICAR BD",
      descripcionAccion: "Usuarios normalizados y roles asegurados",
      ipUsuario: req.ip,
      idUsuario: req.user?.id || 0,
      nivelCriticidad: 5
    });

    res.json({ message: "Rectificación completada: usuarios normalizados y roles asegurados" });
  } catch (err) {
    console.error("❌ Error rectificando BD:", err);
    res.status(500).json({ error: "Error rectificando BD" });
  }
};


// Cambiar suscripción
const cambiarSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    let { activa } = req.body; // puede venir como booleano o número

    // Normalizar valor recibido
    if (activa === true || activa === "true" || activa === 1 || activa === "1") {
      activa = 1;
    } else if (activa === false || activa === "false" || activa === 0 || activa === "0") {
      activa = 0;
    } else {
      return res.status(400).json({ error: "Valor inválido para suscripción" });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Actualizar en BD
    user.suscripcionActiva = activa;
    await user.save();

    // Registrar en bitácora
    await Bitacora.create({
      accionRealizada: "Cambiar suscripción",
      descripcionAccion: `Suscripción de ${user.email} actualizada a ${activa === 1 ? "activa" : "inactiva"}`,
      ipUsuario: req.ip,
      idUsuario: user.id,
      nivelCriticidad: 2
    });

    res.json({ message: `Suscripción de ${user.email} actualizada a ${activa === 1 ? "activa" : "inactiva"}` });
  } catch (err) {
    console.error("❌ Error cambiando suscripción:", err);
    res.status(500).json({ error: "Error interno" });
  }
};


// Bitácora general
const verBitacoraGeneral = async (req, res) => {
  try {
    const registros = await Bitacora.findAll({
      order: [["fechaAccion", "DESC"]] // usar el campo correcto del modelo
    });
    res.json(registros);
  } catch (err) {
    console.error("❌ Error obteniendo bitácora general:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  desbloquearUsuario,
  eliminarUsuario,
  asignarRol,
  quitarRol,
  resetearPassword,
  verificarBD,
  rectificarBD,
  cambiarSuscripcion,
  verBitacoraGeneral
};
