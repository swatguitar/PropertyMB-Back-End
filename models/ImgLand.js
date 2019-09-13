const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'Photolands',
  {
    ID_Photo: {
      type: Sequelize.TINYINT,
      primaryKey: true,
      autoIncrement: true
    },
    URL: {
      type: Sequelize.STRING
    },
    ID_land: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
)
