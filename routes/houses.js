var express = require('express')
const path = require('path')
var house = express.Router()
const cors = require('cors')
var multer = require('multer')
const Group = require('../models/Group')
const jwt = require('jsonwebtoken')
var fs = require('fs')
const House = require('../models/House')
const Land = require('../models/Land')
const img = require('../models/ImgProperty')
const imgL = require('../models/ImgLand')
const User = require('../models/User')
house.use(cors())
var ftpClient = require('ftp-client'),
  config = {
    host: 'landvist.xyz',
    port: 21,
    user: 'u656477047',
    password: 'tar15234'
  },
  options = {
    logging: 'basic'
  },

  client = new ftpClient(config, options);
client.connect();
client.upload(['uploads/images/**'], '/public_html/images', {
  baseDir: 'uploads/images',
  overwrite: 'older'
}, function (result) {
  console.log(result);
});
//addimg
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../uploads/images'))
  },
  filename: function (req, file, cb) {
    cb(null, 'img_' + Date.now() + '.jpg')
  }
})
const storageG = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../uploads/images'))
  },
  filename: function (req, file, cb) {
    cb(null, 'group_' + Date.now() + '.jpg')
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
    fieldSize: 1024 * 1024 * 5 // no larger than 5mb, you can change as needed.
  },
  FileFilter: FileFilter
}).single('file');

const uploadG = multer({
  storage: storageG, limits: {
    fieldSize: 1024 * 1024 * 5 // no larger than 5mb, you can change as needed.
  },
  FileFilter: FileFilter
}).single('file');

house.post('/upload', function (req, res, next) {
  upload(req, res, function (err) {
    if (err ) {
      res.json({ error: err });
    }
    //do all database record saving activity
    const imgData = {
      ID_property: req.body.ID_property,
      URL: null
    }
    if (req.file) {
      imgData.URL = req.file.filename
      // handle that a file was uploaded
      img.create(imgData)
      .then(house => {
        res.json(house)
      })
      .catch(err => {
        res.send('error: ' + err) 
      })
    House.update(
      { ImageEX: req.file.filename },
      { where: { ID_Property: req.body.ID_property } }
    )
    }
   
  });


});
house.post('/uploadG', function (req, res, next) {
  uploadG(req, res, function (err) {
    if (err ) {
      res.json({ error: err });
    }
    //do all database record saving activity
 
    if (req.file) {
      Group.update({
        Img: req.file.filename
      }, {
        where: {
          ID_Group: req.body.ID_Group
        }
      })
      .then(group => {
        let token = jwt.sign(group.dataValues, process.env.SECRET_KEY, {
          expiresIn: 1440
        })
        res.json({
          token: token
        })
      
      })
      .catch(err => {
        res.send('error: ' + err)
      })
    }
   
  });


});
house.post('/uploadimageLand', function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      res.json({ error: err });
    }
    //do all database record saving activity
    const imgData = {
      ID_land: req.body.ID_lands,
      URL: null
    }
    if (req.file) {
      imgData.URL = req.file.filename
    imgL.create(imgData)
      .then(land => {
        res.json(land)
      })
      .catch(err => {
        res.send('error: ' + err)
      })
    Land.update(
      { ImageEX: req.file.filename },
      { where: { ID_Lands: req.body.ID_lands } }
    )}
  });


})
house.post('/uploadprofile', function (req, res, next) {upload(req, res, function (err) {
    if (err) {
      res.json({ error: err });
    }
    //do all database record saving activity
   
    const ID = {
      ID_User: req.body.ID_User
    }
    const imgData = {
      ProfileImg: null
    }
    if (req.file) {
      imgData.ProfileImg = req.file.filename
    User.update(imgData,
      { where: { ID_User: ID.ID_User }})
      .then(house => {
        res.json({ house })
      })
      .catch(err => {
        res.send('error: ' + err)
      })
    }
  });


});

house.put('/imghouse', (req, res, next) => {
  /*client.connect(function () {

    client.upload(['uploads/images**'], '/public_html/images', {
      baseDir: '/uploads/images',
      overwrite: 'older'
    }, function (result) {
      console.log(result);
    });
  });
*/
img.findAll({
  where: {
    ID_property: req.body.ID_Property
  }
}).then(tasks => {
      res.json(tasks)
      return console.log("Get Images property success.");
    })
    .catch(err => {
      res.send('error: ' + err)
    })

})

house.get('/uploadftp', (req, res, next) => {
  client.connect(function () {

    client.upload( ['uploads/images/**'], '/public_html/images', {
      baseDir:'uploads/images',
      overwrite: 'older'
    }, function (result) {
      console.log(result);
    });
  });
})


process.env.SECRET_KEY = 'secret'
// Get All Tasks
house.get('/houses', (req, res, next) => {

  House.findAll()
    .then(tasks => {
      res.json(tasks)
      return console.log("Get All property success.");
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
house.put('/houseUpdate', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  House.findAll({
    where: {
      Owner: decoded.ID_User, ID_Property: req.body.ID_Property
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
      throw new Error('house does not exist')
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
    ContactUo: req.body.ContactUo,
    ContactSo: req.body.ContactSo,
    ContactUt: req.body.ContactUt,
    ContactSt: req.body.ContactSt,
    ContactU: req.body.ContactU,
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
    bed: req.body.bed,
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
    Owner: decoded.ID_User,
  }
  House.create(houseData)
    .then(house => {
      let token = jwt.sign(house.dataValues, process.env.SECRET_KEY, {
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
house.put('/house/Delete', (req, res, next) => {
  House.destroy({
    where: {
      ID_Property: req.body.ID_Property
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
house.put('/house/DeleteImage', (req, res, next) => {
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
house.put('/EditHouse', (req, res, next) => {
  if (!req.body.ID_Property) {
    res.status(400)
    res.json({
      error: '555'
    })
  } else {
    House.update(
      { PropertyType: req.body.PropertyType,
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
        ContactUo: req.body.ContactUo,
        ContactSo: req.body.ContactSo,
        ContactUt: req.body.ContactUt,
        ContactSt: req.body.ContactSt,
        ContactU: req.body.ContactU,
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
        bed: req.body.bed,
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
         },
      { where: {ID_Property: req.body.ID_Property } }
    )
      .then(() => {
        res.send('Task Updated!')
        return console.log("สำเร็จ.");
      })
      .error(err => handleError(err))
  }
})

// Update land
house.put('/UpdateStatus', (req, res, next) => {
  if (!req.body.ID_Property) {
    res.status(400)
    res.json({
      error: '555'
    })
  } else {
    House.update(
      { 
        PPStatus: req.body.PPStatus
     
         },
      { where: {ID_Property: req.body.ID_Property } }
    )
      .then(() => {
        res.send('Task Updated!')
        return console.log("สำเร็จ.");
      })
      .error(err => handleError(err))
  }
})

module.exports = house
