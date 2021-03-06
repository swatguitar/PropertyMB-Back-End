const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'Groups',
  {
    ID_Group: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    NameG: {
      type: Sequelize.STRING
    },
    Img: {
      type: Sequelize.STRING
    },
    Owner: {
      type: Sequelize.STRING
    },
    Created: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  },
  {
    timestamps: false
  }
)
