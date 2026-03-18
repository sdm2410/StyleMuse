const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const { registrarBitacora, nivelesCriticidad } = require("./hooks/bitacora");
const { getIp } = require("../middlewares/getIp");

const User = sequelize.define("usuarios", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  contraseña: { type: DataTypes.STRING, allowNull: false },
  suscripcionActiva: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  estado: { type: DataTypes.BOOLEAN },
  añoAlta: { type: DataTypes.DATEONLY },
  dvh: { type: DataTypes.INTEGER },

  // 👇 Campos para recuperación de contraseña
  resetToken: { type: DataTypes.STRING },
  resetTokenExp: { type: DataTypes.DATE },
}, {
  timestamps: false,
  modelName: "User",
  hooks: {
    beforeCreate: async (user) => {
      const { calcularDV } = require("./DV");
      const dvh = calcularDV(user.dataValues);
      user.dvh = dvh; 
    },
    afterCreate: async (user, options) => {
      const { actualizarDV } = require("./DV");
      await actualizarDV(User, "usuarios");
    },
    beforeUpdate: async (user) => {
      const { calcularDV } = require("./DV");
      const dvh = calcularDV(user.dataValues);
      user.dvh = dvh;
    },
    afterUpdate: async (user, options) => {
      const { actualizarDV } = require("./DV");
      await actualizarDV(User, "usuarios");
    },
  },
});

module.exports = { User };
