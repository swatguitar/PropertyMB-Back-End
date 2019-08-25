const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
    'district',
    {
        DISTRICT_ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        DISTRICT_CODE: {
            type: Sequelize.STRING
        },
        DISTRICT_NAME: {
            type: Sequelize.STRING
        },
        GEO_ID: {
            type: Sequelize.INTEGER
        },
        AMPHUR_ID: {
            type: Sequelize.INTEGER
        },
        PROVINCE_ID: {
            type: Sequelize.INTEGER
        },
    },
    {
        timestamps: false
    }
)
