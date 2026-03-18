const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const transporter = require("./indexmail.js");

// MODELOS
const { User } = require("./models/User");
const { Tarjeta } = require("./models/Tarjeta");
const { Comentario } = require("./models/Comentario.js");
const { Noticia } = require("./models/Noticia.js");
const { Bitacora } = require("./models/Bitacora.js");

// CONTROLADORES
const {
  registerUser,
  login,
  me,
  deleteLogicalUser,
  updateUser,
  asignarRolEscritor,
  verificarEscritores,
} = require("./controllers/user");

const { getAllUsers, getUserById } = require("./controllers/admin");
const {
  desbloquearUsuario,
  eliminarUsuario,
  asignarRol,
  resetearPassword,
  rectificarBD,
  verificarBD,
  cambiarSuscripcion,
  quitarRol,
  verBitacoraGeneral,
} = require("./controllers/admin");

const {
  registrarNoticia,
  deleteLogicalNoticia,
  obtenerNoticias,
} = require("./controllers/noticia.js");

const { registrarPermiso } = require("./controllers/permisos_roles.js");
const { actualizarDV } = require("./controllers/DVC");

// TARJETA CONTROLLERS
const {
  actualizarDVTarjeta,
  enviarEmailConfirmacionSuscripcion,
} = require("./controllers/tarjeta");

// CONTROLADORES DE COMENTARIOS
const { crearComentario, obtenerComentarios } = require("./controllers/comentarios.js");

// MIDDLEWARES
const isAuth = require("./middlewares/auth");
const { detectarIP, getIp } = require("./middlewares/getIp");
const { registrarBitacora } = require("./models/hooks/bitacora");
const isAdmin = require("./middlewares/isAdmin");

// MERCADO PAGO
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");

// DB
const sequelize = require("./config/db");
const { QueryTypes } = require("sequelize"); // 🔥 NECESARIO PARA ASEGURAR ROL (si lo usás en otro lado)

const mpClient = new MercadoPagoConfig({
  accessToken:
    "APP_USR-6290216121285602-111720-4b15d37f6310f14b19f5b92c37f73917-2999278168",
});
const preference = new Preference(mpClient);
const payment = new Payment(mpClient);

console.log("✅ Mercado Pago configurado correctamente");

const server = express();
server.use(express.json());
server.set("trust proxy", true);
server.use(detectarIP);

// CORS
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

// =====================================================
// 🔵 MERCADO PAGO – CREAR PREFERENCIA
// =====================================================
server.post("/subscribirse", async (req, res) => {
  try {
    const { userId } = req.body;

    const preferenceData = {
      items: [
        {
          title: "Suscripción Style Muse",
          description: "Acceso exclusivo a contenido editorial",
          quantity: 1,
          currency_id: "ARS",
          unit_price: 10.0,
        },
      ],
      back_urls: {
        success: "http://localhost:5173/mercadopago/success",
        failure: "http://localhost:5173/failure",
        pending: "http://localhost:5173/pending",
      },
      external_reference: String(userId),
    };

    const response = await preference.create({ body: preferenceData });
    res.json({ init_point: response.init_point });
  } catch (err) {
    console.log("❌ Error creando preferencia MP:", err?.response?.data || err);
    res.status(500).json({ error: "Error creando preferencia MP" });
  }
});

// =====================================================
// 🔵 MERCADO PAGO – PAGO CON TARJETA
// =====================================================
server.post("/pagar-tarjeta", async (req, res) => {
  try {
    const {
      token,
      paymentMethodId,
      installments,
      userId,
      email,
      cardholderName,
      cardNumber,
      expiryMonth,
      expiryYear,
      securityCode,
    } = req.body;

    if (!token || !paymentMethodId || !userId) {
      return res.status(400).json({ error: "Faltan datos del pago" });
    }

    const paymentData = {
      transaction_amount: 10,
      token,
      description: "Suscripción Style Muse",
      installments: Number(installments) || 1,
      payment_method_id: paymentMethodId,
      payer: {
        email,
        first_name: cardholderName,
      },
      external_reference: String(userId),
    };

    const response = await payment.create(paymentData);

    // Si se aprobó
    if (response.status === "approved") {
      // Guardar tarjeta
      await Tarjeta.create({
        numeroTarjeta: crypto
          .createHash("sha256")
          .update(cardNumber)
          .digest("hex"),
        nombre_usuario_tarjeta: cardholderName,
        fecha_vencimiento: `${expiryMonth}/${expiryYear.slice(-2)}`,
        codigo_seguridad: crypto
          .createHash("sha256")
          .update(securityCode)
          .digest("hex"),
        estado: 1,
        dvh: 0,
        id_usuario: userId,
      });

      // Actualizar DVV
      await actualizarDVTarjeta();

      // Activar suscripción
      await User.update({ suscripcionActiva: 1 }, { where: { id: userId } });

      const usuario = await User.findByPk(userId);
      await enviarEmailConfirmacionSuscripcion(
        usuario.email,
        usuario.nombre
      );

      await registrarBitacora({
        accionRealizada: "SUSCRIPCION",
        fechaAccion: new Date(),
        descripcionAccion: `Usuario ${userId} pagó con MP (Pago ID: ${response.id})`,
        ipUsuario: req.ipUsuario || getIp(req),
        idUsuario: userId,
        nivelCriticidad: 3,
      });
    }

    res.json({
      success: response.status === "approved",
      status: response.status,
      payment_id: response.id,
    });
  } catch (err) {
    console.log("❌ Error en pago MP:", err);
    res.status(500).json({ error: "No se pudo procesar el pago" });
  }
});

// =====================================================
// 🔵 ACTIVAR SUSCRIPCIÓN DESPUÉS DE PAGO MERCADOPAGO
// =====================================================
server.post("/activar-suscripcion", isAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Actualizar suscripción a activa
    await User.update({ suscripcionActiva: 1 }, { where: { id: userId } });

    const usuario = await User.findByPk(userId);

    if (usuario) {
      await enviarEmailConfirmacionSuscripcion(
        usuario.email,
        usuario.nombre
      );

      await registrarBitacora({
        accionRealizada: "SUSCRIPCIÓN ACTIVADA - MERCADOPAGO",
        fechaAccion: new Date(),
        descripcionAccion: `Usuario ${usuario.email} activó suscripción mediante MercadoPago`,
        ipUsuario: req.ipUsuario || getIp(req),
        idUsuario: userId,
        nivelCriticidad: 3,
      });
    }

    res.json({
      success: true,
      message: "Suscripción activada correctamente",
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        suscripcionActiva: true,
      },
    });
  } catch (err) {
    console.log("❌ Error activando suscripción:", err);
    res.status(500).json({ error: "Error al activar suscripción" });
  }
});

// =====================================================
// 🔵 SUSCRIPCIÓN SIMPLE
// =====================================================
server.post("/suscripcion-simple", isAuth, async (req, res) => {
  try {
    const {
      numeroTarjeta,
      cvv,
      mesVencimiento,
      añoVencimiento,
      nombreTitular,
    } = req.body;
    const userId = req.user.id;

    await Tarjeta.create({
      numeroTarjeta: crypto
        .createHash("sha256")
        .update(numeroTarjeta)
        .digest("hex"),
      nombre_usuario_tarjeta: nombreTitular,
      fecha_vencimiento: `${mesVencimiento}/${añoVencimiento}`,
      codigo_seguridad: crypto
        .createHash("sha256")
        .update(cvv)
        .digest("hex"),
      estado: 1,
      dvh: 0,
      id_usuario: userId,
    });

    await User.update({ suscripcionActiva: 1 }, { where: { id: userId } });
    await actualizarDVTarjeta();

    const usuario = await User.findByPk(userId);
    await enviarEmailConfirmacionSuscripcion(
      usuario.email,
      usuario.nombre
    );

    res.json({ success: true, message: "Suscripción activada correctamente" });
  } catch (err) {
    console.log("❌ Error suscripción simple:", err);
    res.status(500).json({ error: "Error interno", details: err.message });
  }
});

// ========================
// RUTAS ADMIN
// ========================
server.put("/user/unblock/:id", isAuth, isAdmin, desbloquearUsuario);
server.delete("/user/:id", isAuth, isAdmin, eliminarUsuario);
server.post("/user/asignar-rol", isAuth, isAdmin, asignarRol);
server.put("/user/reset-password/:id", isAuth, isAdmin, resetearPassword);
server.get("/verificar-bd", isAuth, isAdmin, verificarBD);
server.post("/rectificar-bd", isAuth, isAdmin, rectificarBD);
server.put("/user/suscripcion/:id", isAuth, isAdmin, cambiarSuscripcion);
server.post("/user/quitar-rol", isAuth, isAdmin, quitarRol);
server.get("/bitacora", isAuth, isAdmin, verBitacoraGeneral);

// =====================================================
// 🔵 RUTAS PRINCIPALES
// =====================================================
server.post("/users", registerUser);
server.post("/login", login);
server.get("/me", isAuth, me);
server.put("/user", isAuth, updateUser);
server.put("/delete/:id", deleteLogicalUser);

// Noticias
server.post("/noticia", isAuth, registrarNoticia);
server.get("/noticias", obtenerNoticias);
server.put("/delete/noticia/:id", isAuth, deleteLogicalNoticia);

// Roles / Permisos
server.post("/permiso", isAuth, registrarPermiso);
server.post("/asignar-escritor", asignarRolEscritor);
server.get("/verificar-escritores", verificarEscritores);

// Comentarios
server.post("/comentario", isAuth, crearComentario);
server.get("/comentarios/:noticiaId", obtenerComentarios);

// Panel administrador
server.get("/users", isAuth, isAdmin, getAllUsers);
server.get("/user/:id", isAuth, isAdmin, getUserById);

// 🔥 CARGA ASOCIACIONES (IMPORTANTE)
require("./models/asassociations.js");
require("./models/DigitoVerificador.js");
require("./models/Bitacora.js");

// =============================================
//    ASEGURAR USUARIO ESCRITOR POR DEFECTO
// =============================================
const asegurarUsuarioEscritor = async () => {
  try {
    const { Rol } = require("./models/Rol"); // ✅ CORREGIDO

    // 🔹 Buscar o crear rol escritor
    let rolEscritor = await Rol.findOne({ where: { nombreRol: "escritor" } });
    if (!rolEscritor) {
      rolEscritor = await Rol.create({
        nombreRol: "escritor",
        descripcionRol: "Puede escribir",
        jerarquiaRol: "3",
        estado: true,
      });
    }

    // 🔹 Buscar o crear usuario escritor
    let escritor = await User.findOne({
      where: { email: "sabrinademarcoet36@gmail.com" },
    });
    if (!escritor) {
      const hashedPassword = await bcrypt.hash("sabrina1", 10);
      escritor = await User.create({
        nombre: "Sabrina",
        apellido: "De Marco",
        email: "sabrinademarcoet36@gmail.com",
        contraseña: hashedPassword,
        suscripcionActiva: 1,
        estado: 1,
        añoAlta: new Date().toISOString().split("T")[0],
      });
      console.log("✅ Usuario escritor creado");
    }

    // 🔹 Asignar rol si no lo tiene
    const tieneRol = await escritor.hasRole(rolEscritor);
    if (!tieneRol) {
      await escritor.addRole(rolEscritor);
      console.log("✅ Rol escritor asignado al usuario escritor");
    }
  } catch (err) {
    console.error("❌ Error creando usuario escritor:", err);
  }
};

// =============================================
//    ASEGURAR USUARIO ADMIN POR DEFECTO
// =============================================
const asegurarUsuarioAdmin = async () => {
  try {
    const { Rol } = require("./models/Rol");

    // 🔹 Buscar o crear rol administrador
    let rolAdmin = await Rol.findOne({
      where: { nombreRol: "administrador" },
    });
    if (!rolAdmin) {
      rolAdmin = await Rol.create({
        nombreRol: "administrador",
        descripcionRol: "Acceso total al panel de administración",
        jerarquiaRol: "1",
        estado: true,
      });
    }

    // 🔹 Buscar o crear usuario admin
    let admin = await User.findOne({
      where: { email: "admin@stylemuse.com" },
    });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin1234", 10);
      admin = await User.create({
        nombre: "Admin",
        apellido: "Principal",
        email: "admin@stylemuse.com",
        contraseña: hashedPassword,
        suscripcionActiva: 1,
        estado: 1,
        añoAlta: new Date().toISOString().split("T")[0],
      });
      console.log("✅ Usuario administrador creado");
    }

    // 🔹 Asignar rol si no lo tiene
    const tieneRol = await admin.hasRole(rolAdmin);
    if (!tieneRol) {
      await admin.addRole(rolAdmin);
      console.log("✅ Rol administrador asignado al usuario admin");
    }
  } catch (err) {
    console.error("❌ Error creando usuario admin:", err);
  }
};

// =============================================
//                START SERVER
// =============================================
server.listen(3000, async () => {
  await sequelize.sync();

  // ✅ CORREGIDO: antes llamabas asegurarRolEscritor()
  await asegurarUsuarioEscritor();
  await asegurarUsuarioAdmin();

  const countNoticias = await Noticia.count();
  if (countNoticias === 0) {
    await Noticia.bulkCreate([
      {
        tituloNoticia: "Rutinas de noche que transforman tu piel en 7 días",
        fechaPublicacion: new Date(),
        escritorAsignado: "Valentina Ríos",
        categoria: "Belleza",
        estado: true,
      },
      {
        tituloNoticia:
          "Belleza circular: marcas que reinventan el skincare sostenible",
        fechaPublicacion: new Date(),
        escritorAsignado: "Camila Torres",
        categoria: "Belleza",
        estado: true,
      },
    ]);
    console.log("✅ Noticias iniciales insertadas en la BD");
  }

  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
