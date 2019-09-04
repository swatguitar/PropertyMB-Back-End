var express = require('express')
var house = express.Router()
var multer = require('multer')
const jwt = require('jsonwebtoken')
const House = require('../models/House')
const img = require('../models/ImgProperty')
const User = require('../models/User')


//addimg
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images')
  },
  filename: function (req, file, cb) {
    cb(null, 'img_'+Date.now()+'.jpg')
  }
})
const FileFilter = (req, file, cd) => {
  //reject a file
  if (file.mimettype === 'image/jpeg' || file.mimettype === 'image/png') {
    cd(null, true);
  } else {
    cd(null, false);
  }


}
const upload = multer({
  storage: storage, limits: {
    fieldSize: 1024 * 1024 * 5
  },
  FileFilter: FileFilter
}).single('file');

house.post('/upload', function(req,res,next){
  upload(req,res,function(err){
      if(err){
          return res.status(501).json({error:err});
      }
      //do all database record saving activity
        const imgData = {
          ID_property: req.body.ID_property,
          URL: req.file.filename
        }
        img.create(imgData)
          .then(house => {
            let token = jwt.sign(house.dataValues, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            res.json({ token: token })
          })
          .catch(err => {
            res.send('error: ' + err)
          })
        
      return res.json({originalname:req.file.originalname, uploadname:req.file.filename, ID_Property:req.body.ID_property});
  });
});
house.get('/imghouse', (req, res, next) => {

  img.findAll()
    .then(tasks => {
      res.json(tasks)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})


process.env.SECRET_KEY = 'secret'
// Get All Tasks
house.get('/houses', (req, res, next) => {

  House.findAll()
    .then(tasks => {
      res.json(tasks)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
//getall house
house.get('/house', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  House.findAll({
    where: {
      Owner: decoded.ID_User
    }
  })
    .then(house => {
      if (house) {
        res.json(house)
      } else {
        res.send('house does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

house.get('/imgProperty', (req, res) => {
  img.findAll()
    .then(house => {
      if (house) {
        res.json(house)
      } else {
        res.send('house does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})



// Addland
house.post('/addhouse', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const houseData = {
    ID_Property: req.body.ID_Property,
    PropertyType: req.body.PropertyType,
    AnnounceTH: req.body.AnnounceTH,
    CodeDeed: req.body.CodeDeed,
    SellPrice: req.body.SellPrice,
    Costestimate: req.body.Costestimate,
    CostestimateB: req.body.CostestimateB,
    MarketPrice: req.body.MarketPrice,
    BathRoom: req.body.BathRoom,
    BedRoom: req.body.BedRoom,
    CarPark: req.body.CarPark,
    HouseArea: req.body.HouseArea,
    Floor: req.body.Floor,
    LandR: req.body.LandR,
    LandG: req.body.LandG,
    LandWA: req.body.LandWA,
    LandU: req.body.LandU,
    HomeCondition: req.body.HomeCondition,
    BuildingAge: req.body.BuildingAge,
    BuildFD: req.body.BuildFD,
    BuildFM: req.body.BuildFM,
    BuildFY: req.body.BuildFY,
    Directions: req.body.Directions,
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
    //ContactUo: req.body.ContactUo,
    ContactSo: req.body.ContactSo,
    //ContactUt: req.body.ContactUt,
    ContactSt: req.body.ContactSt,
    //ContactU: req.body.ContactU,
    ContactS: req.body.ContactS,
    Blind: req.body.Blind,
    Neareducation: req.body.Neareducation,
    Cenmarket: req.body.Cenmarket,
    Market: req.body.Market,
    River: req.body.River,
    Mainroad: req.body.Mainroad,
    Insoi: req.body.Insoi,
    Letc: req.body.Letc,
    airconditioner: req.body.airconditioner,
    afan: req.body.afan,
    AirPurifier: req.body.AirPurifier,
    Waterheater: req.body.Waterheater,
    WIFI: req.body.WIFI,
    TV: req.body.TV,
    refrigerator: req.body.refrigerator,
    microwave: req.body.microwave,
    gasstove: req.body.gasstove,
    wardrobe: req.body.wardrobe,
    TCset: req.body.TCset,
    sofa: req.body.sofa,
    shelves: req.body.shelves,
    CCTV: req.body.CCTV,
    Securityguard: req.body.Securityguard,
    pool: req.body.pool,
    Fitness: req.body.Fitness,
    Publicarea: req.body.Publicarea,
    ShuttleBus: req.body.ShuttleBus,
    WVmachine: req.body.WVmachine,
    CWmachine: req.body.CWmachine,
    Elevator: req.body.Elevator,
    Lobby: req.body.Lobby,
    ATM: req.body.ATM,
    BeautySalon: req.body.BeautySalon,
    Balcony: req.body.Balcony,
    EventR: req.body.EventR,
    MeetingR: req.body.MeetingR,
    LivingR: req.body.LivingR,
    Hairsalon: req.body.Hairsalon,
    Laundry: req.body.Laundry,
    Store: req.body.Store,
    Supermarket: req.body.Supermarket,
    CStore: req.body.CStore,
    MFee: req.body.MFee,
    Kitchen: req.body.Kitchen,
    LandAge: req.body.LandAge,
    PPStatus: req.body.PPStatus,
    Owner: decoded.ID_User,
  }
  House.create(houseData)
    .then(house => {
      let token = jwt.sign(house.dataValues, process.env.SECRET_KEY, {
        expiresIn: 1440
      })
      res.json({ token: token })
    })
    .catch(err => {
      res.send('error: ' + err)
    })


})

// delete land
house.delete('/task/:id', (req, res, next) => {
  House.destroy({
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
house.put('/task/:id', (req, res, next) => {
  if (!req.body.task_name) {
    res.status(400)
    res.json({
      error: 'Bad Data'
    })
  } else {
    House.update(
      { task_name: req.body.task_name },
      { where: { id: req.params.id } }
    )
      .then(() => {
        res.send('Task Updated!')
      })
      .error(err => handleError(err))
  }
})

module.exports = house
