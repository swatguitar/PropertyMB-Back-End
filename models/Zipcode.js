const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
    'zipcodes',
    {
        ZIPCODE_ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        DISTRICT_CODE: {
            type: Sequelize.STRING
        },
        PROVINCE_ID: {
            type: Sequelize.STRING
        },
        AMPHUR_ID: {
            type: Sequelize.STRING
        },
        DISTRICT_ID: {
            type: Sequelize.STRING
        },
        ZIPCODE: {
            type: Sequelize.STRING
        },
    },
    {
        timestamps: false
    }
)
