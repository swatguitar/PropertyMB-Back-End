const Sequelize = require('sequelize')
const db = {}
const sequelize = new Sequelize('u534477618_ppmb', 'u534477618_ppmb', 'Tar15234', {
  host: '162.159.24.201',
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