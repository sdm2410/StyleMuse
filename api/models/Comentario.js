const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./User");
const { Noticia } = require("./Noticia");

const Comentario = sequelize.define("comentarios", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  noticiaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: "comentarios",
  timestamps: false,
});

// Relaciones
Comentario.belongsTo(User, { foreignKey: "usuarioId", as: "usuario" });
Comentario.belongsTo(Noticia, { foreignKey: "noticiaId" });

User.hasMany(Comentario, { foreignKey: "usuarioId" });
Noticia.hasMany(Comentario, { foreignKey: "noticiaId" });

module.exports = { Comentario };
