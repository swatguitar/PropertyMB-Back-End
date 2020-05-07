var express = require('express')
var land = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var multer = require('multer')
var aws = require('aws-sdk')
var multerS3 = require('multer-s3')
const {
  Op
} = require("sequelize");
const House = require('../models/House')
const Land = require('../models/Land')
const imgL = require('../models/ImgLand')
const User = require('../models/User')
const db = require('../database/db.js')

process.env.SECRET_KEY = 'secret'
land.use(cors())


//************* FileFilter to filter image before upload *************
const FileFilter = (req, file, cd) => {

  if (file.mimettype === 'image/jpeg' || file.mimettype === 'image/png') {
    cd(null, true);
  } else {
    cd(null, false);
  }
}
//************* Config Amazon s3 bucket *************
aws.config.update({
  secretAccessKey: 'ske3uOIYveU9sN4WjWc0KKfEfmAdMc0uMAkAY2f7',
  accessKeyId: 'AKIAJMSJLXE6OBJ5OFJA',
  region: 'us-east-2'
})
var s3 = new aws.S3()
var uploadS3 = multer({
  limits: {
    fieldSize: 1024 * 1024 * 5 // no larger than 5mb, you can change as needed.
  },
  FileFilter: FileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'backendppmb',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, 'img_' + Date.now() + '.jpg')
    }
  })
})

//** config file **
const uploadImg = uploadS3.single('file');

//************* get all Land *************
land.get('/landsall', (req, res, next) => {

  Land.findAll()
    .then(land => {
      res.json(land)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* get house by user id *************
land.get('/land', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  Land.findAll({
      where: {
        Owner: decoded.ID_User
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

//************* get house by filter *************
land.post('/filterLand', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  condition = ''
  if (req.body != null) {
    if (req.body.PropertyType != '' && req.body.PropertyType != null) {
      condition += " AND ColorType = '" + req.body.PropertyType + "'"
    }
     if (req.body.Deed != '' && req.body.Deed != null) {
      condition += " AND Deed = '" + req.body.Deed + "'"
    }
    if (req.body.LProvince != '' && req.body.LProvince != null) {
      condition += " AND LProvince = '" + req.body.LProvince + "'"
    }
    if (req.body.LAmphur != '' && req.body.LAmphur != null) {
      condition += " AND LAmphur = '" + req.body.LAmphur + "'"
    }
    if (req.body.LDistrict != '' && req.body.LDistrict != null) {
      condition += " AND LDistrict = '" + req.body.LDistrict + "'"
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
    ).then(land => {
      if (land) {
        res.json(land[0])
        //console.log(condition)
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

//************* get Land by land id *************
land.post('/landDetail', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  Land.findAll({
      where: {
        Owner: decoded.ID_User,
        ID_Lands: req.body.ID_Lands
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

//************* get Image land by land id *************
land.put('/imgland', (req, res, next) => {
  imgL.findAll({
      where: {
        ID_land: req.body.ID_Lands
      }
    }).then(Image => {
      if (Image) {
        res.json(Image)
      } else {
        res.json({
          error: "ไม่พบรูปภาพ"
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })

})

//************* Delete house && image house *************
land.put('/land/Delete', (req, res, next) => {
  Land.destroy({
    where: {
      ID_Lands: req.body.ID_Lands
    }
  })
  imgL.destroy({
      where: {
        ID_land: req.body.ID_Lands
      }
    })
    .then(() => {
      res.json('อสังหาถูกลบแล้ว')
    })
    .catch(err => {
      res.json('error: ' + err)
    })

})

//************* Delete image land *************
land.put('/land/DeleteImage', (req, res, next) => {
  imgL.findAll({
      where: {
        ID_Photo: req.body.ID_Photo
      }
    }).then(Image => {
      if (Image) {
        data = Image.map(row => {
          return row.File_Name
        });
       if (data != null) {
          params = {
            Bucket: 'backendppmb',
            Key: data[0]
          };
          s3.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack); // error
            else console.log(data); // deleted
          });
          img.destroy({
            where: {
              ID_Photo: req.body.ID_Photo
            }
          }).then(() => {
            res.json('ลบรูปภาพเสำเร็จ')
          })
          .catch(err => {
            res.json('error: ' + err)
          })
        }
      } else {
        res.json({
          error: "ไม่พบรูปภาพ"
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* Update PP Status Land *************
land.put('/UpdateStatusL', (req, res, next) => {
  if (!req.body.ID_Lands) {
    res.status(400)
    res.json({
      error: 'กรุณาเลือกอสังหาฯ'
    })
  } else {
    Land.update(
      { 
        PPStatus: req.body.PPStatus
     
         },
      { where: {ID_Lands: req.body.ID_Lands } }
    )
      .then(() => {
        res.json('แก้ไขสำเร็จ')
      })
      .error(err => handleError(err))
  }
})

//************* Upload image Land *************
land.post('/uploadImageL', function (req, res, next) {
  uploadImg(req, res, function (err) {
    if (err) {
      res.json({
        error: err
      });
    }
    const imgData = {
      ID_land: req.body.ID_lands,
      URL: null,
      File_Name: null
    }
    if (req.file) {
      imgData.URL = req.file.location
      imgData.File_Name = req.file.filename
      imgL.create(imgData)
        .then(land => {
          res.json(land)
        })
        .catch(err => {
          res.send('error: ' + err)
        })
      Land.update({
        ImageEX: req.file.location
      }, {
        where: {
          ID_Lands: req.body.ID_lands
        }
      })
    }
  });
});
//************* group data land *************
land.put('/group/member/landDetail', (req, res) => {
  Land.findAll({
      where: {
        ID_Lands: req.body.ID_Lands
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
//************* Update data land// *************
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

//************* Inseart data land// *************
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
      if(!land){
        res.json("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีครั้ง")
      }else{
        res.json("บันทึกสำเร็จ กดปุ่ม 'ถัดไป'") 
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })


})

//************* Update data land// *************
land.put('/EditLand', (req, res, next) => {
  if (!req.body.ID_Lands) {
    res.status(400)
    res.json({
      error: 'ไม่พบอสังหาฯ'
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
        res.json('อัพเดทข้อมูล สำเร็จ')
      })
      .error(err => handleError(err))
  }
})

module.exports = land
