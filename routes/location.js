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

location.get('/Amphur', (req, res, next) => {

    Amphur.findAll()
        .then(amphur => {
            res.json(amphur)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

location.get('/District', (req, res, next) => {

    District.findAll()
        .then(district => {
            res.json(district)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

location.get('/Zipcode', (req, res, next) => {

    Zipcode.findAll()
        .then(zipcode => {
            res.json(zipcode)
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


module.exports = location