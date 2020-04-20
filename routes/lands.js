var express = require('express')
var land = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const Land = require('../models/Land')
const User = require('../models/User')
var multer = require('multer')
const img = require('../models/ImgLand')
land.use(cors())


//addimg

const FileFilter = (req, file, cd) => {
  //reject a file
  if (file.mimettype === 'image/jpeg' || file.mimettype === 'image/png') {
    cd(null, true);
  } else {
    cd(null, false);
  }


}



land.put('/UpdateStatusL', (req, res, next) => {
  if (!req.body.ID_Lands) {
    res.status(400)
    res.json({
      error: '555'
    })
  } else {
    Land.update(
      { 
        PPStatus: req.body.PPStatus
     
         },
      { where: {ID_ID_Lands: req.body.ID_Lands } }
    )
      .then(() => {
        res.send('Task Updated!')
        return console.log("สำเร็จ.");
      })
      .error(err => handleError(err))
  }
})
land.put('/landUpdate', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  Land.findAll({
    where: {
      Owner: decoded.ID_User, ID_Lands: req.body.ID_Lands
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

land.put('/imgLand', (req, res, next) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  img.findAll({
    where: {
      ID_land: req.body.ID_Lands
    }
  })
    .then(tasks => {
      res.json(tasks)
      return console.log("Get Images property success.");
    })
    .catch(err => {
      res.send('error: ' + err)
    })

})



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
    ID_Lands: req.body.ID_Lands,
    ColorType: req.body.ColorType,
    AnnounceTH: req.body.AnnounceTH,
    CodeDeed: req.body.ID_Lands,
    TypeCode: req.body.TypeCode,
    CodeProperty: req.body.CodeProperty,
    SellPrice: req.body.SellPrice,
    Costestimate: req.body.Costestimate,
    CostestimateB: req.body.CostestimateB,
    MarketPrice: req.body.MarketPrice,
    PriceWA: req.body.PriceWA,
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
    ContactU: req.body.ContactU,
    ContactS: req.body.ContactS,
    ContactUo: req.body.ContactUo,
    ContactSo: req.body.ContactSo,
    ContactUt: req.body.ContactUt,
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
    WxD: req.body.WxD,
    Owner: decoded.ID_User,
  }
  Land.create(landData)
    .then(land => {
      let token = jwt.sign(land.dataValues, process.env.SECRET_KEY, {
        expiresIn: 1440
      })
      res.json({ token: token })
      return console.log("บันทึกสำเร็จ.");
    })
    .catch(err => {
      res.send('error: ' + err)
    })


})

// delete land
land.put('/land/Delete', (req, res, next) => {
  Land.destroy({
    where: {
      ID_Lands: req.body.ID_Lands
    }
  })
    .then(() => {
      res.send('อสังหาถูกลบแล้ว')
      return console.log("สำเร็จ.");
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
// delete land
land.put('/land/DeleteImage', (req, res, next) => {
  img.destroy({
    where: {
      ID_Photo: req.body.ID_Photo
    }
  })
    .then(() => {
      res.send('อสังหาถูกลบแล้ว')
      return console.log("สำเร็จ.");
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
// Update land
land.put('/EditLand', (req, res, next) => {
  if (!req.body.ID_Lands) {
    res.status(400)
    res.json({
      error: 'Bad Data'
    })
  } else {
    Land.update(
      { 
        ColorType: req.body.ColorType,
        AnnounceTH: req.body.AnnounceTH,
        CodeDeed: req.body.ID_Lands,
        TypeCode: req.body.TypeCode,
        CodeProperty: req.body.CodeProperty,
        SellPrice: req.body.SellPrice,
        Costestimate: req.body.Costestimate,
        CostestimateB: req.body.CostestimateB,
        MarketPrice: req.body.MarketPrice,
        PriceWA: req.body.PriceWA,
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
        ContactU: req.body.ContactU,
        ContactS: req.body.ContactS,
        ContactUo: req.body.ContactUo,
        ContactSo: req.body.ContactSo,
        ContactUt: req.body.ContactUt,
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
        Created: req.body.LandAge,
        WxD: req.body.WxD },
      { where: { ID_Lands: req.body.ID_Lands } }
    )
      .then(() => {
        res.send('Task Updated!')
        return console.log("สำเร็จ.");
      })
      .error(err => handleError(err))
  }
})

module.exports = land
