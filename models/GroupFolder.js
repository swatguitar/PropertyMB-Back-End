const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'GroupFolder',
  {
    ID_Folder: {
      type: Sequelize.TINYINT,
      primaryKey: true,
      autoIncrement: true
    },
    NameF: {
      type: Sequelize.STRING
    },
    ID_Group: {
      type: Sequelize.TINYINT
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
