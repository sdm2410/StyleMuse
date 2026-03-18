const crypto = require("crypto");
const { Tarjeta } = require("../models/Tarjeta");
const { User } = require("../models/User");
const { getIp } = require("../middlewares/getIp");
const { registrarBitacora } = require("../models/hooks/bitacora");
const { DigitoVerificador } = require("../models/DigitoVerificador");
const transporter = require("../indexmail");
const transporterAlt = require("../indexmail.js");

/* ============================================================
   ACTUALIZAR DV TARJETA (V1)
   ============================================================ */
const actualizarDVTarjeta_v1 = async () => {
  try {
    const tarjetas = await Tarjeta.findAll();
    const sumaDVH = tarjetas.reduce((acc, t) => acc + (t.dvh || 0), 0) % 100000;

    await DigitoVerificador.upsert({
      tabla: "tarjeta",
      dvv: sumaDVH,
    });

    console.log("✅ DVV Tarjeta actualizado (v1)");
    return sumaDVH;
  } catch (err) {
    console.log("❌ Error actualizando DV tarjeta (v1)", err);
    return null;
  }
};

/* ============================================================
   ENVIAR EMAIL CONFIRMACIÓN SUSCRIPCIÓN (V1)
   ============================================================ */
const enviarEmailConfirmacionSuscripcion_v1 = async (email, nombre, paymentId = null) => {
  try {
    await transporter.sendMail({
      from: "STYLE MUSE <stylemusesm@gmail.com>",
      to: email,
      subject: "Confirmación de Suscripción - Style Muse",
      html: `
        <h1>✨ Style Muse</h1>
        <p>Hola <strong>${nombre}</strong>, tu suscripción fue activada correctamente.</p>
        ${paymentId ? `<p>ID de pago: <b>${paymentId}</b></p>` : ""}
      `
    });
    console.log("📩 Email enviado (v1) a", email);
    return true;
  } catch (err) {
    console.log("❌ Error enviando email (v1):", err);
    return false;
  }
};

/* ============================================================
   ENVIAR EMAIL CONFIRMACIÓN SUSCRIPCIÓN (V2)
   ============================================================ */
const enviarEmailConfirmacionSuscripcion_v2 = async (email, nombre, idPago = null) => {
  try {
    const asunto = "🎉 ¡Tu suscripción a Style Muse está activa!";
    const cuerpo = `
      <h2>Hola ${nombre},</h2>
      <p>Gracias por suscribirte a <strong>Style Muse</strong>. Ya tenés acceso exclusivo al contenido editorial.</p>
      ${idPago ? `<p>ID de pago: <strong>${idPago}</strong></p>` : ""}
      <p>¡Esperamos que disfrutes la experiencia!</p>
      <br>
      <p>El equipo de Style Muse 💄✨</p>
    `;

    await transporterAlt.sendMail({
      from: "stylemuse@notificaciones.com",
      to: email,
      subject: asunto,
      html: cuerpo,
    });

    console.log(`📩 Email enviado (v2) a ${email}`);
  } catch (err) {
    console.log("❌ Error enviando email de suscripción (v2):", err);
  }
};

/* ============================================================
   ALIAS PARA COMPATIBILIDAD CON index.js
   ============================================================ */

// 👉 index.js espera llamar a "actualizarDVTarjeta"
const actualizarDVTarjeta = async () => {
  // SOLO V1, porque v2 requiere req,res (rompe)
  await actualizarDVTarjeta_v1();
};

// 👉 index.js espera llamar a "enviarEmailConfirmacionSuscripcion"
const enviarEmailConfirmacionSuscripcion = async (email, nombre, paymentId = null) => {
  await enviarEmailConfirmacionSuscripcion_v2(email, nombre, paymentId);
};

/* ============================================================
   REGISTRAR TARJETA Y ACTIVAR SUSCRIPCIÓN
   ============================================================ */
const registrarTarjeta = async (req, res) => {
  try {
    const { userId, numeroTarjeta, cvv, mesVencimiento, añoVencimiento, nombreTitular } = req.body;

    if (!userId || !numeroTarjeta || !cvv || !mesVencimiento || !añoVencimiento)
      return res.status(400).json({ error: "Faltan datos" });

    const ipUsuario = req.ipUsuario || getIp(req);

    await Tarjeta.create({
      numeroTarjeta: crypto.createHash("sha256").update(numeroTarjeta).digest("hex"),
      nombre_usuario_tarjeta: nombreTitular,
      fecha_vencimiento: `${mesVencimiento}/${añoVencimiento}`,
      codigo_seguridad: crypto.createHash("sha256").update(cvv).digest("hex"),
      estado: 1,
      dvh: 0,
    });

    // SOLO v1
    await actualizarDVTarjeta_v1();

    await registrarBitacora({
      accionRealizada: "REGISTRO TARJETA",
      fechaAccion: new Date(),
      descripcionAccion: `Usuario ${userId} registró una tarjeta`,
      ipUsuario,
      idUsuario: userId,
      nivelCriticidad: 3,
    });

    await User.update(
      { suscripcionActiva: 1 },
      { where: { id: userId } }
    );

    await registrarBitacora({
      accionRealizada: "SUSCRIPCION",
      fechaAccion: new Date(),
      descripcionAccion: `Usuario ${userId} activó su suscripción`,
      ipUsuario,
      idUsuario: userId,
      nivelCriticidad: 3,
    });

    const usuario = await User.findByPk(userId);

    await enviarEmailConfirmacionSuscripcion_v1(usuario.email, usuario.nombre);
    await enviarEmailConfirmacionSuscripcion_v2(usuario.email, usuario.nombre);

    res.json({ success: true, message: "Tarjeta registrada y suscripción activada" });

  } catch (err) {
    console.log("❌ Error registrando tarjeta:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

/* ============================================================
   EXPORTAR TODO
   ============================================================ */
module.exports = {
  registrarTarjeta,

  actualizarDVTarjeta_v1,
  enviarEmailConfirmacionSuscripcion_v1,
  enviarEmailConfirmacionSuscripcion_v2,

  // ALIAS (para que el index.js funcione)
  actualizarDVTarjeta,
  enviarEmailConfirmacionSuscripcion
};
