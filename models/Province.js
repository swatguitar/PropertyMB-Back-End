const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'province',
  {
    PROVINCE_ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PROVINCE_CODE: {
      type: Sequelize.STRING
    },
    PROVINCE_NAME: {
      type: Sequelize.STRING
    },
    GEO_ID: {
      type: Sequelize.INTEGER
    },
  },
  {
    timestamps: false
  }
)
