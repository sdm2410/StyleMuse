const { User } = require("../models/User");
const { Noticia } = require("../models/Noticia");
const { Tarjeta } = require("../models/Tarjeta");
const { Rol } = require("../models/Rol");
const { Permiso } = require("../models/Permiso");

// ==========================================================
// 🟦 USUARIO ↔ NOTICIA (N:M) — LecturasNoticia
// ==========================================================
User.belongsToMany(Noticia, {
  through: 'LecturasNoticia',
  as: 'noticiasLeidas',
  foreignKey: 'idUsuario',   // referencia a User.id
  otherKey: 'idNoticia',
  timestamps: false,      // referencia a Noticia.id
});

Noticia.belongsToMany(User, {
  through: 'LecturasNoticia',
  as: 'lectores',
  foreignKey: 'idNoticia',   // referencia a Noticia.id
  otherKey: 'idUsuario',
  timestamps: false,      // referencia a User.id
});
// ==========================================================
// 🟨 USUARIO ↔ TARJETA (1:1)
// ==========================================================
User.hasOne(Tarjeta, {
  as: 'tarjeta',
  foreignKey: 'idUsuario'    // FK en Tarjeta → User.id
});

Tarjeta.belongsTo(User, {
  as: 'usuario',
  foreignKey: 'idUsuario'
});
// ==========================================================
// 🟥 USUARIO ↔ ROL (N:M) — RolDelUsuario
// ==========================================================
User.belongsToMany(Rol, {
  through: 'RolDelUsuario',
  as: 'roles',
  foreignKey: 'idUsuario',   // referencia a User.id
  otherKey: 'idRol'          // referencia a Rol.id
});

Rol.belongsToMany(User, {
  through: 'RolDelUsuario',
  as: 'usuarios',
  foreignKey: 'idRol',       // referencia a Rol.id
  otherKey: 'idUsuario'      // referencia a User.id
});
// ==========================================================
// 🟫 ROL ↔ PERMISO (N:M) — PermisoDelRol
// ==========================================================
Rol.belongsToMany(Permiso, {
  through: 'PermisoDelRol',
  as: 'permisos',
  foreignKey: 'idRol',       // referencia a Rol.id
  otherKey: 'idPermiso'      // referencia a Permiso.id
});

Permiso.belongsToMany(Rol, {
  through: 'PermisoDelRol',
  as: 'roles',
  foreignKey: 'idPermiso',   // referencia a Permiso.id
  otherKey: 'idRol'          // referencia a Rol.id
});
// ==========================================================
// ⬛ USUARIO ↔ PERMISO (N:M) — PermisoDelUsuario
// ==========================================================
User.belongsToMany(Permiso, {
  through: 'PermisoDelUsuario',
  as: 'permisos',
  foreignKey: 'idUsuario',   // referencia a User.id
  otherKey: 'idPermiso'      // referencia a Permiso.id
});

Permiso.belongsToMany(User, {
  through: 'PermisoDelUsuario',
  as: 'usuarios',
  foreignKey: 'idPermiso',   // referencia a Permiso.id
  otherKey: 'idUsuario'      // referencia a User.id
});