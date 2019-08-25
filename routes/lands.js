var express = require('express')
var land = express.Router()
const jwt = require('jsonwebtoken')
const Land = require('../models/Land')
const User = require('../models/User')


process.env.SECRET_KEY = 'secret'
// Get All land
land.get('/landsall', (req, res, next) => {
  
  Land.findAll()
    .then(land => {
      res.json(land)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//getall lands of user
land.get('/land', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  Land.findAll({
    where: {
      Owner: decoded.ID_User
    }
  })
    .then(land => {
      if (land) {
        res.json(land)
      } else {
        res.send('land does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
// Addland
land.post('/addland', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  const landData = {
    ColorType: req.body.ColorType,
    AnnounceTH: req.body.AnnounceTH,
    CodeDeed: req.body.CodeDeed,
    SellPrice: req.body.SellPrice,
    Costestimate: req.body.Costestimate,
    CostestimateB: req.body.CostestimateB,
    MarketPrice: req.body.MarketPrice,
    PricePM: req.body.PricePM,
    LandR: req.body.LandR,
    LandG: req.body.LandG,
    LandWA: req.body.LandWA,
    Land: req.body.Land,
    Deed: req.body.Deed,
    RoadType: req.body.RoadType,
    RoadWide: req.body.RoadWide,
    GroundLevel: req.body.GroundLevel,
    GroundValue: req.body.GroundValue,
    MoreDetails: req.body.MoreDetails,
    Latitude: req.body.Latitude,
    Longitude: req.body.Longitude,
    AsseStatus: req.body.AsseStatus,
    ObservationPoint: req.body.ObservationPoint,
    Location: req.body.Location,
    LProvince: req.body.LProvince,
    LAmphur: req.body.LAmphur,
    LDistrict: req.body.LDistrict,
    LZipCode: req.body.LZipCode,
    ContactU:req.body.ContactU,
    ContactE: req.body.ContactE,
    ContactP: req.body.ContactP,
    ContactL: req.body.ContactL,
    ContactUo: req.body.ContactUo,
    ContactEo: req.body.ContactEo,
    ContactPo: req.body.ContactPo,
    ContactLo: req.body.ContactLo,
    ContactSo: req.body.ContactSo,
    ContactUt: req.body.ContactUt,
    ContactEt: req.body.ContactEt,
    ContactPt: req.body.ContactPt,
    ContactLt: req.body.ContactLt,
    ContactSt: req.body.ContactSt,
    Place: req.body.Place,
    Blind: req.body.Blind,
    Neareducation: req.body.Neareducation,
    Cenmarket: req.body.Cenmarket,
    Market: req.body.Market,
    River: req.body.River,
    Mainroad: req.body.Mainroad,
    Insoi: req.body.Insoi,
    Letc: req.body.Letc,
    LandAge: req.body.LandAge,
    PPStatus: req.body.PPStatus,
    TypeCode: req.body.TypeCode,
    PriceWA: req.body.PriceWA,
    WxD: req.body.WxD,
    Owner: decoded.ID_User,
    Created: today
  }
        Land.create(landData)
          .then(land => {
            let token = jwt.sign(land.dataValues, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            res.json({ token: token })
          })
          .catch(err => {
            res.send('error: ' + err)
          })
     
    
})

// delete land
land.delete('/task/:id', (req, res, next) => {
  Land.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => {
      res.send('Task deleted!')
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

// Update land
land.put('/task/:id', (req, res, next) => {
  if (!req.body.task_name) {
    res.status(400)
    res.json({
      error: 'Bad Data'
    })
  } else {
    Land.update(
      { task_name: req.body.task_name },
      { where: { id: req.params.id } }
    )
      .then(() => {
        res.send('Task Updated!')
      })
      .error(err => handleError(err))
  }
})

module.exports = land
