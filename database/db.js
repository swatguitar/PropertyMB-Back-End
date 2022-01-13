const Sequelize = require('sequelize')
const db = {}
const sequelize = new Sequelize('u534412661_ppmb', 'u534412661_ppmb', 'Tar15234', {
  host: '194.163.35.36',
  dialect: 'mysql',
  operatorsAliases: false,

  timezone: '+07:00',
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