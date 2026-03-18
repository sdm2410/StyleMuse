const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const { nivelesCriticidad } = require("./hooks/bitacora");

const Bitacora = sequelize.define("Bitacora", {
  accionRealizada: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaAccion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  descripcionAccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ipUsuario: {
    type: DataTypes.STRING,
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nivelCriticidad: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, {
  timestamps: false,
  tableName: "bitacoras",
});

module.exports = { Bitacora };
