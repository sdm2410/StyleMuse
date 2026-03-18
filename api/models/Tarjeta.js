const sequelize = require("../config/db");
const { DataTypes } = require('sequelize')

const Tarjeta = sequelize.define('tarjeta', {
    numeroTarjeta: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nombre_usuario_tarjeta: {
        type: DataTypes.STRING,
    },
    fecha_vencimiento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    codigo_seguridad: {
        type: DataTypes.STRING,
        allowNull: false,

    },
     estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    dvh:{
        type:DataTypes.INTEGER
    },
    }, {
    timestamps: false,
    modelName: 'Tarjeta'
})

module.exports= {
    Tarjeta
}