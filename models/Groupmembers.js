const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'Groupmembers',
  {
    ID_member: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_Group: {
      type: Sequelize.TINYINT
    },
    ID_User: {
      type: Sequelize.TINYINT
    }
  },
  {
    timestamps: false
  }
)
