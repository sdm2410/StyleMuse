const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const { agregarHooksDV } = require("./hooks/UpdateDV");

const Noticia = sequelize.define(
  "Noticia",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    tituloNoticia: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fechaPublicacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    escritorAsignado: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },

    dvh: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "noticias",
    timestamps: false,

    hooks: {
      beforeUpdate: async (noticia) => {
        const { calcularDV } = require("./DV");
        const dvh = calcularDV(noticia.dataValues);
        noticia.dvh = dvh;
      },

      afterUpdate: async (noticia) => {
        const { actualizarDV } = require("./DV");
        await actualizarDV(Noticia, "noticias");
      },

      beforeCreate: async (noticia) => {
        const { calcularDV } = require("./DV");
        const dvh = calcularDV(noticia.dataValues);
        noticia.dvh = dvh;
      },

      afterCreate: async () => {
        const { actualizarDV } = require("./DV");
        await actualizarDV(Noticia, "noticias");
      },
    },
  }
);

agregarHooksDV(Noticia, "noticia");

module.exports = { Noticia };
