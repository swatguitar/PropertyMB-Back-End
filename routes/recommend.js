const express = require('express')
const recommend = express.Router()
const jwt = require('jsonwebtoken')
const cors = require('cors')
const db = require('../database/db.js')
const {
    Op
  } = require("sequelize");
const House = require('../models/House')
const Land = require('../models/Land')
recommend.use(cors())


process.env.SECRET_KEY = 'secret'

//************* get house by UserType *************
recommend.put('/HouseRecommend', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    condition = ''
    if (req.body != null) {
      if (req.body.LProvince != '' && req.body.LProvince != null) {
        condition += " AND LProvince = '" + req.body.LProvince + "'"
      }
      if (req.body.UserType != '' && req.body.UserType != null) {
        condition += " AND UserType = '" + req.body.UserType + "'"
      }
      if (req.body.PriceMax != null) {
        condition += " AND SellPrice <= '" + req.body.PriceMax + "'"
      }
      if (req.body.PriceMin != null) {
        condition += " AND SellPrice >= '" + req.body.PriceMin + "'"
      }
    }
    db.sequelize.query(
        "SELECT * FROM propertys WHERE Owner ='" + decoded.ID_User + "' " + condition, {
          type: Op.SELECT
        }
      ).then(house => {
            if (house) {
                res.json(house[0])
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
//************* get house by UserType Mobile *************
recommend.put('/HouseRecommendMobile', (req, res) => {
  //  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    House.findAll({
            where: {
                Owner:  req.body.ID_User,
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

//************* get land by UserType  *************
recommend.put('/LandRecommend', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    condition = ''
    if (req.body != null) {
      if (req.body.LProvince != '' && req.body.LProvince != null) {
        condition += " AND LProvince = '" + req.body.LProvince + "'"
      }
      if (req.body.UserType != '' && req.body.UserType != null) {
        condition += " AND UserType = '" + req.body.UserType + "'"
      }
      if (req.body.PriceMax != null) {
        condition += " AND SellPrice <= '" + req.body.PriceMax + "'"
      }
      if (req.body.PriceMin != null) {
        condition += " AND SellPrice >= '" + req.body.PriceMin + "'"
      }
    }
    db.sequelize.query(
        "SELECT * FROM lands WHERE Owner ='" + decoded.ID_User + "' " + condition, {
          type: Op.SELECT
        }
      )
        .then(land => {
            if (land) {
                res.json(land[0])
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

//************* get land by UserType Mobile *************
recommend.put('/LandRecommendMobile', (req, res) => {
    //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    Land.findAll({
            where: {
                Owner: req.body.ID_User,
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