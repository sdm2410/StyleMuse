const sequelize = require("../config/db");
const { DataTypes } = require('sequelize');
const { agregarHooksDV } = require('./hooks/UpdateDV');
const DigitoVerificador = sequelize.define('DigitoVerificador', {
  tabla: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  dvv: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: false
});

agregarHooksDV(DigitoVerificador, 'DigitoVerificador');
module.exports = {
  DigitoVerificador
};