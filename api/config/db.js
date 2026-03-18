const Sequelize = require('sequelize')

const sequelize = new Sequelize('Style Muse', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});



module.exports = sequelize