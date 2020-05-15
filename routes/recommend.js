const express = require('express')
const recommend = express.Router()
const jwt = require('jsonwebtoken')
const cors = require('cors')
const House = require('../models/House')
const Land = require('../models/Land')
recommend.use(cors())


process.env.SECRET_KEY = 'secret'

//************* get house by UserType *************
recommend.put('/HouseRecommend', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    House.findAll({
            where: {
                Owner: decoded.ID_User,
                UserType: req.body.UserType
            } //,offset: 5, limit: 12
        })
        .then(house => {
            if (house) {
                res.json(house)
            } else {
                res.json({
                    error: "ไม่พบข้อมูล"
                })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

//************* get land by UserType *************
recommend.put('/LandRecommend', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    Land.findAll({
            where: {
                Owner: decoded.ID_User,
                UserType: req.body.UserType
            } //,offset: 5, limit: 12
        })
        .then(land => {
            if (land) {
                res.json(land)
            } else {
                res.json({
                    error: "ไม่พบข้อมูล"
                })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


module.exports = recommend