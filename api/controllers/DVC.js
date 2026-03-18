// ✅ api/controllers/DVC.js
const { registrarBitacora, nivelesCriticidad } = require('../models/hooks/bitacora');
const { getIp } = require('../middlewares/getIp');

const recalculateDVHForModel = async (db, Model, keyFields = []) => {
  const rows = await Model.findAll();

  const calcDVH = (obj) => {
    const s = JSON.stringify(obj);
    let sum = 0;
    for (let i = 0; i < s.length; i++) sum = (sum + s.charCodeAt(i)) % 100000;
    return sum;
  };

  for (const r of rows) {
    const dvh = calcDVH(r.toJSON());
    if (r.get('dvh') !== undefined) {
      await r.update({ dvh });
    }
  }
};

const actualizarDV = async (req, res) => {
  try {
    const db = req.app.get('db');

    await recalculateDVHForModel(db, db.User);
    await recalculateDVHForModel(db, db.Tarjeta);
    await recalculateDVHForModel(db, db.Rol);
    await recalculateDVHForModel(db, db.Permiso);
    await recalculateDVHForModel(db, db.Noticia);
    await recalculateDVHForModel(db, db.Bitacora);

    const tablas = ['usuarios', 'tarjeta', 'rols', 'permisos', 'noticia', 'bitacoras'];
    for (const tabla of tablas) {
      const model = {
        usuarios: db.User,
        tarjeta: db.Tarjeta,
        rols: db.Rol,
        permisos: db.Permiso,
        noticia: db.Noticia,
        bitacoras: db.Bitacora,
      }[tabla];

      const rows = await model.findAll();
      const dvv = rows.reduce((acc, r) => acc + (r.get('dvh') || 0), 0) % 100000;
      await db.DigitoVerificador.upsert({ tabla, dvv });
    }

    // 🔹 Obtener IP del usuario (middleware o función)
    const ipUsuario = req.ipUsuario || getIp(req);
    console.log('IP detectada:', ipUsuario);

    // 🔹 Registrar en bitácora
    await registrarBitacora({
      accionRealizada: 'recalcular_dv',
      fechaAccion: new Date(),
      descripcionAccion: 'Recalculo de DVH y DVV en todas las tablas del sistema.',
      ipUsuario,
      idUsuario: req.user?.id ?? null,
      nivelCriticidad: nivelesCriticidad.administracion
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar DV' });
  }
};

module.exports = { actualizarDV };
