const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

const Rol = sequelize.define('rol', {
    nombreRol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcionRol: {
        type: DataTypes.STRING,
    },
    jerarquiaRol: {
        type: DataTypes.STRING,
    },
     estado:{
        type: DataTypes.BOOLEAN
    }
}, {
    timestamps: false,
    modelName: 'Rol'
})

module.exports= {
    Rol
}