const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'PropertyInGroups',
  {
    ID_Item: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_Property: {
      type: Sequelize.STRING
    },
    ID_Folder: {
      type: Sequelize.TINYINT
    },
    Status: {
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
