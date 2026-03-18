const sequelize = require("./config/db");

// Importar modelos
const { User } = require("./models/User");
const { Noticia } = require("./models/Noticia");
const { Comentario } = require("./models/Comentario");
const { Tarjeta } = require("./models/Tarjeta");
const { Rol } = require("./models/Rol");
const { Permiso } = require("./models/Permiso");
const { Bitacora } = require("./models/Bitacora");

// Importar asociaciones para que funcionen las relaciones
require("./models/asassociations");

async function initDatabase() {
  try {
    console.log("🔄 Iniciando conexión a la base de datos...");

    // Autenticar y sincronizar todas las tablas
    await sequelize.authenticate();
    console.log("✅ Conexión establecida correctamente.");

    // Crear tablas solo si no existen (no forzar eliminación)
    await sequelize.sync({ force: false });
    console.log("✅ Todas las tablas fueron creadas exitosamente.");

    const bcrypt = require("bcrypt");

    // ==========================================================
    // CREAR ROLES POR DEFECTO
    // ==========================================================
    const rolesCreados = await Rol.bulkCreate([
      {
        nombreRol: "admin",
        descripcionRol: "Administrador del sistema - acceso completo",
        jerarquiaRol: "1",
        estado: 1
      },
      {
        nombreRol: "escritor",
        descripcionRol: "Usuario que puede crear y publicar noticias",
        jerarquiaRol: "3",
        estado: 1
      },
      {
        nombreRol: "lector",
        descripcionRol: "Usuario con acceso de lectura básico",
        jerarquiaRol: "5",
        estado: 1
      }
    ]);
    console.log("✅ Roles básicos creados:", rolesCreados.map(r => r.nombreRol));

    // ==========================================================
    // CREAR PERMISOS POR DEFECTO (INMODIFICABLES)
    // ==========================================================
    const permisosCreados = await Permiso.bulkCreate([
      // Permisos de Admin (no modificables)
      { nombrePermiso: "admin_usuarios", descripcionPermiso: "Gestión completa de usuarios", esPorDefecto: true },
      { nombrePermiso: "admin_roles", descripcionPermiso: "Asignar y gestionar roles", esPorDefecto: true },
      { nombrePermiso: "admin_permisos", descripcionPermiso: "Ver permisos (no editar)", esPorDefecto: true },
      { nombrePermiso: "admin_bitacora", descripcionPermiso: "Acceso completo a bitácora", esPorDefecto: true },
      { nombrePermiso: "admin_sistema", descripcionPermiso: "Configuración del sistema", esPorDefecto: true },

      // Permisos de Escritor
      { nombrePermiso: "escribir_noticias", descripcionPermiso: "Crear y publicar noticias", esPorDefecto: true },
      { nombrePermiso: "editar_propias_noticias", descripcionPermiso: "Editar sus propias noticias", esPorDefecto: true },
      { nombrePermiso: "ver_comentarios", descripcionPermiso: "Ver comentarios en noticias", esPorDefecto: true },
      { nombrePermiso: "comentar_suscriptor", descripcionPermiso: "Comentar si está suscrito", esPorDefecto: true },

      // Permisos de Lector
      { nombrePermiso: "leer_noticias", descripcionPermiso: "Leer noticias públicas", esPorDefecto: true },
      { nombrePermiso: "ver_perfil_propio", descripcionPermiso: "Ver y editar su propio perfil", esPorDefecto: true }
    ]);
    console.log("✅ Permisos por defecto creados:", permisosCreados.length, "permisos");

    // ==========================================================
    // ASIGNAR PERMISOS A ROLES POR DEFECTO
    // ==========================================================
    const rolAdmin = rolesCreados.find(r => r.nombreRol === "admin");
    const rolEscritor = rolesCreados.find(r => r.nombreRol === "escritor");
    const rolLector = rolesCreados.find(r => r.nombreRol === "lector");

    console.log("Roles creados:", rolesCreados.map(r => ({ id: r.id, nombre: r.nombreRol })));
    console.log("Permisos creados:", permisosCreados.map(p => ({ id: p.id, nombre: p.nombrePermiso })));

    // Admin obtiene TODOS los permisos
    if (rolAdmin && rolAdmin.setPermisos) {
      await rolAdmin.setPermisos(permisosCreados);
      console.log("✅ Permisos asignados a rol admin");
    }

    // Escritor obtiene permisos específicos (usar índices para evitar errores)
    const permisosEscritorIds = [6, 7, 8, 9, 10, 11]; // IDs de permisos de escritor
    const permisosEscritor = permisosCreados.filter(p => permisosEscritorIds.includes(p.id));
    if (rolEscritor && rolEscritor.setPermisos) {
      await rolEscritor.setPermisos(permisosEscritor);
      console.log("✅ Permisos asignados a rol escritor:", permisosEscritor.length, "permisos");
    }

    // Lector obtiene permisos básicos
    const permisosLectorIds = [10, 11]; // Leer noticias y ver perfil propio
    const permisosLector = permisosCreados.filter(p => permisosLectorIds.includes(p.id));
    if (rolLector && rolLector.setPermisos) {
      await rolLector.setPermisos(permisosLector);
      console.log("✅ Permisos asignados a rol lector:", permisosLector.length, "permisos");
    }

    // ==========================================================
    // CREAR USUARIOS
    // ==========================================================

    // Usuario Administrador
    const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
    const usuarioAdmin = await User.create({
      nombre: "Melina",
      apellido: "Cullari",
      email: "cullari.melinaet36@gmail.com",
      contraseña: hashedPasswordAdmin,
      suscripcionActiva: true, // Admin tiene suscripción activa
      estado: true,
      añoAlta: new Date().toISOString().split("T")[0]
    });

    // Asignar rol de admin
    await usuarioAdmin.addRole(rolAdmin);
    console.log("✅ Usuario Admin creado:", usuarioAdmin.email);

    // Usuario Escritor (con suscripción activa para probar comentarios)
    const hashedPasswordEscritor = await bcrypt.hash("123456", 10);
    const usuarioEscritor = await User.create({
      nombre: "Sabrina",
      apellido: "De Marco",
      email: "sabrinademarcoet36@gmail.com",
      contraseña: hashedPasswordEscritor,
      suscripcionActiva: true, // Ya está suscrito - PUEDE COMENTAR
      estado: true,
      añoAlta: new Date().toISOString().split("T")[0]
    });

    // Asignar rol de escritor
    await usuarioEscritor.addRole(rolEscritor);
    console.log("✅ Usuario Escritor creado:", usuarioEscritor.email, "✅ CON SUSCRIPCIÓN ACTIVA");

    // ==========================================================
    // VERIFICACIÓN FINAL
    // ==========================================================
    console.log("\n🎉 BASE DE DATOS INICIALIZADA CON ÉXITO!");
    console.log("\n📋 CUENTAS CREADAS:");
    console.log("👑 ADMINISTRADOR:");
    console.log("   📧 Email: cullari.melinaet36@gmail.com");
    console.log("   🔑 Contraseña: admin123");
    console.log("   🎯 Rol: admin (todos los permisos)");
    console.log("   💾 Suscripción: ACTIVA");

    console.log("\n✍️ ESCRITOR:");
    console.log("   📧 Email: sabrinademarcoet36@gmail.com");
    console.log("   🔑 Contraseña: 123456");
    console.log("   🎯 Rol: escritor (puede crear noticias)");
    console.log("   💾 Suscripción: ACTIVA (PUEDE COMENTAR)");

    console.log("\n✅ Permisos por defecto creados y asignados");
    console.log("🚀 El sistema está listo para usarse");

  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  } finally {
    await sequelize.close();
  }
}

initDatabase();