const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
    'Contact',
    {
        ID_Contact: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: Sequelize.STRING
        },
        Email: {
            type: Sequelize.STRING
        },
        Phone: {
            type: Sequelize.STRING
        },
        Line: {
            type: Sequelize.STRING
        },
        CreateOwner: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false
    }
)
