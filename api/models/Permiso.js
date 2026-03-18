const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')
const { registrarBitacora, nivelesCriticidad } = require("./hooks/bitacora");
const { getIp } = require("../middlewares/getIp");

const Permiso = sequelize.define('permisos', {
    tipoDePermisos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcionPermiso: {
        type: DataTypes.STRING,
    },
    estado:{
        type: DataTypes.BOOLEAN
    },
    dvh:{
        type:DataTypes.INTEGER
    }
}, {
    timestamps: false,
    modelName: 'Permiso',

    hooks: {
       beforeCreate: async (permiso) => {
      const { calcularDV } = require("./DV");
      const dvh = calcularDV(permiso.dataValues);
      permiso.dvh = dvh; 
    },

   afterCreate: async (permiso, options) => {
  const { actualizarDV } = require("./DV");
  await actualizarDV(Permiso, "permisos");
},
    beforeUpdate: async (permiso) => {
      const { calcularDV } = require("./DV");
      const dvh = calcularDV(permiso.dataValues);
      permiso.dvh = dvh;
    },

    afterUpdate: async (permiso, options) => {
      const { actualizarDV } = require("./DV");

      await actualizarDV(Permiso, "permisos");
    },
  },
});

module.exports= {
    Permiso
}