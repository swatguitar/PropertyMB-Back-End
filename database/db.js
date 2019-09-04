const Sequelize = require('sequelize')
const db = {}
const sequelize = new Sequelize('u656477047_ppmb', 'u656477047_user', 'tar15234', {
  host: '156.67.222.148',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
