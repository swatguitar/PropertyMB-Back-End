const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'Users',
  {
    ID_User: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Firstname: {
      type: Sequelize.STRING
    },
    Lastname: {
      type: Sequelize.STRING
    },
    Email: {
      type: Sequelize.STRING
    },
    Password: {
      type: Sequelize.STRING
    },
    Birthday: {
      type: Sequelize.STRING
    },
    LocationU: {
      type: Sequelize.STRING
    },
    Phone:{
      type: Sequelize.STRING
    },
    ProfileImg: {
      type: Sequelize.STRING
    },
    Age: {
      type: Sequelize.STRING
    },
    Gender: {
      type: Sequelize.STRING
    },
    Occupation:{
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
