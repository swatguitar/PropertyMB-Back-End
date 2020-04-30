var express = require('express')
var location = express.Router()
const Province = require('../models/Province')
const Amphur = require('../models/Amphur')
const District = require('../models/District')
const Zipcode = require('../models/Zipcode')
process.env.SECRET_KEY = 'secret'
// Get All province
location.get('/Province', (req, res, next) => {

    Province.findAll()
        .then(province => {
            res.json(province)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

location.post('/Amphur', (req, res, next) => {

    Amphur.findAll({
        where: {
            PROVINCE_ID: req.body.PROVINCE_ID
        }
      })
        .then(amphur => {
            res.json(amphur)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

location.post('/District', (req, res, next) => {

    District.findAll({
        where: {
            AMPHUR_ID: req.body.AMPHUR_ID,
            PROVINCE_ID: req.body.PROVINCE_ID
        }
      })
        .then(district => {
            res.json(district)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

location.post('/Zipcode', (req, res, next) => {

    Zipcode.findAll({
        where: {
            AMPHUR_ID: req.body.AMPHUR_ID,
            PROVINCE_ID: req.body.PROVINCE_ID,
            DISTRICT_ID: req.body.DISTRICT_ID
        }
      })
        .then(zipcode => {
            res.json(zipcode)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


module.exports = location