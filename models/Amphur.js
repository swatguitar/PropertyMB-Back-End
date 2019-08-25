const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'amphur',
  {
    AMPHUR_ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    AMPHUR_CODE: {
      type: Sequelize.STRING
    },
    AMPHUR_NAME: {
      type: Sequelize.STRING
    },
    PROVINCE_ID: {
        type: Sequelize.INTEGER
      },
    GEO_ID: {
      type: Sequelize.INTEGER
    },
  },
  {
    timestamps: false
  }
)
