const { User } = require("../models/User");
const { DigitoVerificador } = require("../models/DigitoVerificador");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registrarBitacora, nivelesCriticidad } = require("../models/hooks/bitacora");
const { getIp } = require("../middlewares/getIp");
const { calcularDV } = require("../models/DV");

const SECRET = 'misecreto';

// ======================================================
// 🔹 REGISTRO DE USUARIO
// ======================================================
const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, email, contraseña } = req.body;

    if (!nombre || !apellido || !email || !contraseña) {
      return res.status(400).json({
        error: "Todos los campos son requeridos",
        received: { nombre, apellido, email, hasPassword: !!contraseña },
      });
    }

    // Validación de longitud mínima
    if (contraseña.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: "El email ya está registrado",
        message: "Ya existe un usuario registrado con este email"
      });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const ipUsuario = req.ipUsuario || getIp(req);

    const user = await User.create({
      nombre,
      apellido,
      email,
      contraseña: hashedPassword,
      suscripcionActiva: 0,
      estado: 1,
      añoAlta: new Date().toISOString().split("T")[0],
    });

    await registrarBitacora({
      accionRealizada: "INSERTAR",
      fechaAccion: new Date(),
      descripcionAccion: `Usuario creado: ${user.email}`,
      ipUsuario,
      idUsuario: user.id,
      nivelCriticidad: nivelesCriticidad.contenido,
    });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "8h" });
    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Error en registro:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: "El email ya está registrado",
        message: "Ya existe un usuario registrado con este email"
      });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ======================================================
// 🔹 LOGIN
// ======================================================
const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Validación de longitud mínima
    if (!contraseña || contraseña.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const compare = await bcrypt.compare(contraseña, user.contraseña);
    if (!compare) return res.status(400).json({ message: "Contraseña incorrecta" });

    const ipUsuario = req.ipUsuario || getIp(req);

    if (user.estado === 0) {
      await registrarBitacora({
        accionRealizada: "INICIO DE SESIÓN ERRONEOS",
        fechaAccion: new Date(),
        descripcionAccion: `No pudo iniciar sesión porque la cuenta está desactivada (estado = 0)`,
        ipUsuario,
        idUsuario: user.id,
        nivelCriticidad: nivelesCriticidad.administracion,
      });
      return res.status(403).json({
        message: "No puede iniciar sesión porque su cuenta está desactivada.",
        errorType: "ACCOUNT_DISABLED"
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "8h" });

    await registrarBitacora({
      accionRealizada: "INICIO SESIÓN",
      fechaAccion: new Date(),
      descripcionAccion: `El usuario ${user.email} inició sesión.`,
      ipUsuario,
      idUsuario: user.id,
      nivelCriticidad: nivelesCriticidad.seguridad,
    });

    return res.json({
      token,
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        suscripcionActiva: user.suscripcionActiva === true || user.suscripcionActiva === 1
      }
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ======================================================
// 🔹 ACTUALIZAR USUARIO
// ======================================================
const updateUser = async (req, res) => {
  try {
    const { nombre, apellido, email, contraseñaActual, contraseñaNueva } = req.body;
    const ipUsuario = req.ipUsuario || getIp(req);

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const updates = {};
    const camposModificados = [];

    if (nombre && nombre !== user.nombre) {
      updates.nombre = nombre;
      camposModificados.push('nombre');
    }
    if (apellido && apellido !== user.apellido) {
      updates.apellido = apellido;
      camposModificados.push('apellido');
    }
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(409).json({ error: "El email ya está siendo usado por otro usuario" });
      }
      updates.email = email;
      camposModificados.push('email');
    }

    if (contraseñaNueva) {
      if (!contraseñaActual) {
        return res.status(400).json({ error: "Debes ingresar tu contraseña actual para cambiarla" });
      }
      const match = await bcrypt.compare(contraseñaActual, user.contraseña);
      if (!match) return res.status(400).json({ error: "La contraseña actual es incorrecta" });

      // Validación de longitud mínima
      if (contraseñaNueva.length < 8) {
        return res.status(400).json({ error: "La nueva contraseña debe tener al menos 8 caracteres" });
      }

      const hashedPassword = await bcrypt.hash(contraseñaNueva, 10);
      updates.contraseña = hashedPassword;
      camposModificados.push('contraseña');
    }

    await user.update(updates);

    await registrarBitacora({
      accionRealizada: "ACTUALIZAR PERFIL",
      fechaAccion: new Date(),
      descripcionAccion: `El usuario ${user.email} actualizó los siguientes campos: ${camposModificados.join(', ')}`,
      ipUsuario,
      idUsuario: user.id,
      nivelCriticidad: nivelesCriticidad.administracion
    });

    res.json({ message: "Perfil actualizado con éxito", camposActualizados: camposModificados, user });
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ======================================================
// 🔹 PERFIL /me
// ======================================================
const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: require("../models/Rol").Rol,
        as: 'roles',
        through: { attributes: [] }
      }]
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      suscripcionActiva: user.suscripcionActiva === true || user.suscripcionActiva === 1,
      roles: user.roles?.map(r => r.nombreRol) || []
    });
  } catch (error) {
    console.error("Error en /me:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

// ======================================================
// 🔹 ELIMINACIÓN LÓGICA
// ======================================================
const deleteLogicalUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    await user.update({ estado: 0 });
    const ipUsuario = req.ipUsuario || getIp(req);

    await registrarBitacora({
      accionRealizada: "BORRADO LÓGICO",
      fechaAccion: new Date(),
      descripcionAccion: `El usuario con email ${user.email} fue marcado como eliminado (estado = 0).`,
      ipUsuario,
      idUsuario: id,
      nivelCriticidad: nivelesCriticidad.contenido,
    });

    res.json({ message: "Usuario eliminado lógicamente con éxito." });
  } catch (error) {
    console.error("Error en eliminación lógica:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ======================================================
// 🔹 ASIGNAR ROL ESCRITOR
// ======================================================
const asignarRolEscritor = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email es requerido" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { Rol } = require("../models/Rol");
    let rolEscritor = await Rol.findOne({ where: { nombreRol: 'escritor' } });

    if (!rolEscritor) {
      rolEscritor = await Rol.create({
        nombreRol: 'escritor',
        descripcionRol: 'Usuario que puede crear y publicar noticias',
        jerarquiaRol: '3',
        estado: 1
      });
    }

    const tieneRol = await user.hasRole(rolEscritor);
    if (tieneRol) {
      return res.json({ message: "El usuario ya tiene rol de escritor" });
    }

    await user.addRole(rolEscritor);

    res.json({
      message: `Rol de escritor asignado exitosamente a ${email}`,
      usuario: user.email,
      rol: rolEscritor.nombreRol
    });
  } catch (error) {
    console.error("Error asignando rol de escritor:", error);
    res.status(500).json({ error: "Error al asignar rol de escritor" });
  }
};

// ======================================================
// 🔹 VERIFICAR ESCRITORES
// ======================================================
const verificarEscritores = async (req, res) => {
  try {
    const { Rol } = require("../models/Rol");

    const escritorRol = await Rol.findOne({ where: { nombreRol: 'escritor' } });
    if (!escritorRol) {
      return res.json({ message: "No existe rol de escritor", escritores: [] });
    }

    const escritores = await escritorRol.getUsers({
      attributes: ['id', 'email', 'nombre', 'apellido'],
      through: { attributes: [] }
    });

    const userSpecific = await User.findOne({
      where: { email: 'sabrinademarcoet36@gmail.com' }
    });

    const tieneRolEspecifico = userSpecific ? await userSpecific.hasRole(escritorRol) : false;

    res.json({
      message: "Verificación completada",
      totalEscritores: escritores.length,
      escritores,
      verificacionEspecifica: {
        email: 'sabrinademarcoet36@gmail.com',
        usuarioExiste: !!userSpecific,
        tieneRolEscritor: tieneRolEspecifico
      }
    });
  } catch (error) {
    console.error("Error verificando escritores:", error);
    res.status(500).json({ error: "Error al verificar escritores" });
  }
};

const rectificarBD = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    let rectificados = 0;

    for (let usuario of usuarios) {
      const nuevoDV = calcularDV(usuario.email);

      // Solo actualiza el dígito verificador, no toca suscripción ni estado
      if (usuario.digitoVerificador !== nuevoDV) {
        usuario.digitoVerificador = nuevoDV;
        await usuario.save();
        rectificados++;
      }
    }

    // Registrar en bitácora
    const ipUsuario = req.ipUsuario || getIp(req);
    await registrarBitacora({
      accionRealizada: "RECTIFICAR BD",
      fechaAccion: new Date(),
      descripcionAccion: `Se recalcularon dígitos verificadores de ${rectificados} usuarios.`,
      ipUsuario,
      idUsuario: req.user.id,
      nivelCriticidad: nivelesCriticidad.administracion,
    });

    res.json({
      message: `Se rectificaron ${rectificados} usuarios. Dígitos verificadores actualizados correctamente.`
    });
  } catch (error) {
    console.error("❌ Error al rectificar BD:", error);
    res.status(500).json({ error: "Error al rectificar la base de datos" });
  }
};

// ======================================================
// 🔹 EXPORTS
// ======================================================
module.exports = {
  registerUser,
  login,
  me,
  deleteLogicalUser,
  updateUser,
  asignarRolEscritor,
  verificarEscritores,
  rectificarBD
};
