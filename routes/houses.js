var express = require('express')
var house = express.Router()
const cors = require('cors')
var path = require('path')
var multer = require('multer')
var fs = require('fs')
const PDFDocument = require('pdfkit')
var request = require('request')
var FTPStorage = require('multer-ftp')
var slash = require('slash');
var sftpStorage = require('multer-sftp')
const Group = require('../models/Group')
const jwt = require('jsonwebtoken')
const db = require('../database/db.js')
const {
  Op
} = require("sequelize");
const House = require('../models/House')
const Land = require('../models/Land')
const img = require('../models/ImgProperty')
const imgL = require('../models/ImgLand')
const User = require('../models/User')
var ID_USER = null;
process.env.SECRET_KEY = 'secret'
house.use(cors())



//************* FileFilter to filter image before upload *************
const FileFilter = (req, file, cd) => {

  if (file.mimettype === 'image/jpeg' || file.mimettype === 'image/png') {
    cd(null, true);
  } else {
    cd(null, false);
  }
}

/*var uploadFTP = multer({
  storage: new FTPStorage({
    basepath: '/remote/path',
    ftp: {
      host: 'example.com',
      secure: true, // enables FTPS/FTP with TLS
      user: 'user',
      password: 'password'
    }
  })
})*/

/*let Client = require('ssh2-sftp-client');
let sftp = new Client();

sftp.connect({
  host: '156.67.222.168',
  port: 65002,
  username: 'u656477047',
  password: 'tar15234'
}).then(() => {
  return sftp.list('/home/u656477047/domains/landvist.xyz/public_html/images/NewImg');
}).then(data => {
  console.log('')
  console.log(data, 'the data info');
}).catch(err => {
  console.log(err, 'catch error');
});*/
//************* Config Hostinger bucket *************
var storage = sftpStorage({
  sftp: {
    host: '156.67.222.168',
    port: 65002,
    username: 'u656477047',
    password: 'tar15234',

  },
  destination: function (req, file, cb) {

    cb(null, 'domains/landvist.xyz/public_html/images/UploadImg/');
  },
  filename: function (req, file, cb) {
    cb(null, 'img_' + Date.now() + '.jpg')
  }
})

//** config file **
var uploadImg = multer({
  storage: storage
}).single('file');
//const uploadImg = uploadFTP.single('file');

//************* Upload image house *************
house.post('/uploadImageFTP', function (req, res, next) {
  console.log('HELLOW XX')
  uploadImg(req, res, function (err) {
    logger.debug(JSON.stringify(req.body));
    logger.debug(JSON.stringify(req.files));
    if (err) {
      logger.debug("Error Occured", JSON.stringify(err));
      res.json({
        error_code: 1,
        err_desc: err
      });
    } else {
      logger.debug("Files uploaded successfully");
      res.json({
        error_code: 0,
        err_desc: null
      });
    }
  });
  /*uploadImg(req, res, function (err) {

    if (err instanceof multer.MulterError) {
      console.log('HELLOW VV')
    } else if (err) {
      console.log('HELLOW EE')
    }
    console.log('HELLOW XXII')
    // Everything went fine.
  })*/
});







//************* get all house *************
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

//************* get house by user id *************
house.get('/house', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  House.findAll({
      where: {
        Owner: decoded.ID_User
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

//************* get house by filter *************
house.post('/filterHouse', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  condition = ''
  if (req.body != null) {
    if (req.body.PropertyType != '' && req.body.PropertyType != null) {
      condition += " AND PropertyType = '" + req.body.PropertyType + "'"
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
    if (req.body.HomeCondition != '' && req.body.HomeCondition != null) {
      condition += " AND HomeCondition = '" + req.body.HomeCondition + "'"
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

//************* get house by property id *************
house.post('/houseDetail', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  House.findAll({
      where: {
        Owner: decoded.ID_User,
        ID_Property: req.body.ID_Property
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

//************* get Image house by property id *************
house.put('/imghouse', (req, res, next) => {
  img.findAll({
      where: {
        ID_property: req.body.ID_Property
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
house.put('/house/Delete', (req, res, next) => {
  House.destroy({
    where: {
      ID_Property: req.body.ID_Property
    }
  })
  img.destroy({
      where: {
        ID_property: req.body.ID_Property
      }
    })
    .then(() => {
      res.json('อสังหาถูกลบแล้ว')
    })
    .catch(err => {
      res.json('error: ' + err)
    })

})

//************* Delete image house *************
house.put('/house/DeleteImage', (req, res, next) => {
  img.findAll({
      where: {
        ID_Photo: req.body.ID_Photo
      }
    }).then(Image => {
      if (Image) {
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

//************* Update PP Status house *************
house.put('/UpdateStatus', (req, res, next) => {
  if (!req.body.ID_Property) {
    res.status(400)
    res.json({
      error: 'กรุณาเลือกอสังหาฯ'
    })
  } else {
    House.update({
        PPStatus: req.body.PPStatus
      }, {
        where: {
          ID_Property: req.body.ID_Property
        }
      })
      .then(() => {
        res.json('แก้ไขสำเร็จ')
      })
      .error(err => handleError(err))
  }
})

//************* Upload image house *************
house.post('/uploadImageH', function async (req, res, next) {
  uploadImg(req, res, function (err) {
    if (err) {
      res.json({
        error: err
      });
    }

    console.log(req.file)
    console.log(req.file.path)
    const imgData = {
      ID_property: req.body.ID_property,
      URL: null,
      File_Name: null
    }

    if (req.file) {
      imgData.URL = "https://landvist.xyz/images/UploadImg/" + req.file.filename
      imgData.File_Name = req.file.filename
      img.create(imgData)
        .then(house => {
          res.json(house)
        })
        .catch(err => {
          res.send('error: ' + err)
        })
      House.update({
        ImageEX: "https://landvist.xyz/images/UploadImg/" + req.file.filename
      }, {
        where: {
          ID_Property: req.body.ID_property
        }
      })
    }
  });
});

//************* Update data house *************
house.put('/houseUpdate', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  House.findAll({
      where: {
        Owner: decoded.ID_User,
        ID_Property: req.body.ID_Property
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

//************* group data house *************
house.put('/group/member/houseDetail', (req, res) => {
  House.findAll({
      where: {
        ID_Property: req.body.ID_Property
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

//************* Insert data house *************
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
      if (!house) {
        res.json("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีครั้ง")
      } else {
        res.json("บันทึกสำเร็จ กดปุ่ม 'ถัดไป'")
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* Edit data house *************
house.put('/EditHouse', (req, res, next) => {
  if (!req.body.ID_Property) {
    res.status(400)
    res.json({
      error: 'ไม่พบอสังหาฯ'
    })
  } else {
    House.update({
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
      }, {
        where: {
          ID_Property: req.body.ID_Property
        }
      })
      .then(() => {
        res.json('อัพเดทข้อมูล สำเร็จ')
      })
      .error(err => handleError(err))
  }
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

house.post('/HousePDF', (req, res) => {
  const doc = new PDFDocument({
    size: 'A4'
  })

  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  let filename = req.body.filename
  let uri = req.body.URL
  let imageURL = 'https://backendppmb.s3.us-east-2.amazonaws.com/img_1587565164509.jpg'
  let Owner = []
  let images = []
  let count = 0
  let X = 0
  let Y = 0
  let F = false
  let IF = false
  let sortX = 0
  let sortY = 0
  img.findAll({
    where: {
      ID_property: req.body.ID_Property
    }
  }).then(result => {
    images = result
  });
  House.findAll({
      where: {
        ID_Property: req.body.ID_Property
      }
    })
    .then(house => {

      User.findAll({
        where: {
          ID_User: house[0].Owner
        }
      }).then(Owner => {

        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Access-Control-Allow-Origin': '*',
          'Content-Disposition': 'inline; filename="' + house[0].ID_Property + '".pdf'
        });
        doc.pipe(res)
        request({
          url: uri,
          encoding: null // Prevents Request from converting response to string
        }, function (err, response, body) {
          if (err) throw err;
          // Using a TrueType font (.ttf)
          //console.log(response)
          doc.font('service/THSarabun-Bold.ttf', 23);
          doc.image('service/Navbar.png', 260, 10, {
            width: 90,
            height: 90
          });
          doc.image('service/Capture.PNG', 230, 60, {
            width: 160,
            height: 70
          });
          doc.text(house[0].AnnounceTH, 50, 130, {
            width: 600
          }).font('service/THSarabun.ttf', 13);
          doc.image('service/Mark.png', 50, 152, {
            width: 10,
            height: 10
          });
          doc.text(house[0].Location + ',' + house[0].LDistrict + ',' + house[0].LAmphur + ',' + house[0].LProvince + ' ประเทศไทย ' + house[0].LZipCode, 60, 150).font('service/THSarabun-Bold.ttf', 14);
          doc.image('service/hr.png', 295, 165, {
            width: 10,
            height: 300
          });
          doc.text('รายละเอียด', 60, 360, {
            width: 410
          });
          doc.text('ข้อมูลสถานที่', 335, 315, {
            width: 410
          });
          doc.text('รูปภาพ', 60, 465, {
            width: 410
          });
          doc.text('ข้อมูลการติดต่อ', 335, 240, {
            width: 410
          });
          doc.text('ข้อมูลทั่วไป', 60, 180, {
            width: 410
          }).font('service/THSarabun.ttf', 13);
          doc.text('ประเภทอสังหาฯ :', 60, 195, {
            width: 410
          });
          doc.text('รหสัอสังหาฯ :', 60, 210, {
            width: 410
          });
          doc.text('สภาพ :', 60, 225, {
            width: 410
          });
          doc.text('ปีที่ก่อสร้าง :', 60, 240, {
            width: 410
          });
          doc.text('ทิศด้านหน้า :', 60, 255, {
            width: 410
          });
          doc.text('ราคาขาย :', 60, 285, {
            width: 410
          });
          doc.text('ราคาประเมิน :', 60, 300, {
            width: 410
          });
          doc.text('ราคาตลาด :', 60, 315, {
            width: 410
          });
          doc.text('**วางเงินมัดจำ', 60, 330, {
            width: 410
          });
          doc.text('ห้องน้ำ :', 60, 375, {
            width: 410
          });
          doc.text('ห้องนอน :', 60, 390, {
            width: 410
          });
          doc.text('ที่จอดรถ :', 60, 405, {
            width: 410
          });
          doc.text('พื้นที่ใช้สอย :', 60, 420, {
            width: 410
          });
          doc.text('จำนวนชั้น/ชั้นที่อาศัยอยู่ :', 60, 435, {
            width: 410
          });
          // right
          doc.text('สถานะการซื้อขาย :', 335, 195, {
            width: 410
          });
          doc.text('สถานะทรัพย์สิน :', 335, 210, {
            width: 410
          });
          doc.text('คุณ ' + Owner[0].Firstname + ' ' + Owner[0].Lastname, 335, 255, {
            width: 410
          });
          doc.text('อีเมล :', 335, 270, {
            width: 410
          });
          doc.text('เบอร์โทร :', 335, 285, {
            width: 410
          });
          // result
          doc.text(house[0].PropertyType, 200, 195, {
            width: 410
          });
          doc.text(house[0].CodeDeed, 200, 210, {
            width: 410
          });
          doc.text(house[0].HomeCondition, 200, 225, {
            width: 410
          });
          doc.text(house[0].BuildingAge + ' ปี', 200, 240, {
            width: 410
          });
          doc.text(house[0].Directions, 200, 255, {
            width: 410
          });
          doc.text(house[0].SellPrice + ' บาท', 200, 285, {
            width: 410
          });
          doc.text(house[0].CostestimateB + ' บาท', 200, 300, {
            width: 410
          });
          doc.text(house[0].MarketPrice + ' บาท', 200, 315, {
            width: 410
          });
          doc.text('10%', 200, 330, {
            width: 410
          });
          doc.text(house[0].BathRoom + ' ห้อง', 200, 375, {
            width: 410
          });
          doc.text(house[0].BedRoom + ' ห้อง', 200, 390, {
            width: 410
          });
          doc.text(house[0].CarPark + ' ที่', 200, 405, {
            width: 410
          });
          doc.text(house[0].HouseArea + ' ตารางวา', 200, 420, {
            width: 410
          });
          doc.text(house[0].Floor, 200, 435, {
            width: 410
          });
          // right
          doc.text(house[0].PPStatus, 435, 195, {
            width: 410
          });
          doc.text(house[0].AsseStatus, 435, 210, {
            width: 41
          });
          doc.text(Owner[0].Email, 435, 270, {
            width: 410
          });
          doc.text(Owner[0].Phone, 435, 285, {
            width: 410
          });
          doc.font('service/THSarabun.ttf', 10)
          doc.text(house[0].Location + ',' + house[0].LDistrict + ',' + house[0].LAmphur + ',' + house[0].LProvince + ' ประเทศไทย ' + house[0].LZipCode, 340, 330)
          doc.image('service/Mark.png', 335, 333, {
            width: 5,
            height: 5
          });
          doc.image(body, 335, 355, {
            width: 250,
            height: 110
          })

          F = true
          console.log('F:' + F)
          if (images.length == 0 || IF == true) {
            doc.end()
          }
          return;
        });
        if (images.length != 0) {
          for (var image in images) {
            console.log(images[image].URL)
            request({
              url: images[image].URL,
              encoding: null // Prevents Request from converting response to string
            }, function (error, response, body) {
              count = count + 1
              console.log('Count:' + count + 'Length:' + images.length)
              sortX = sortX + 1
              if (sortX <= 3) {
                doc.image(body, 95 + X, 485 + Y, {
                  width: 130,
                  height: 110
                })
                X = X + 140
              } else {
                Y = Y + 120
                X = 0
                doc.image(body, 95 + X, 485 + Y, {
                  width: 130,
                  height: 110
                })
                sortX = 0
              }
              if (count == images.length) {
                IF = true
              }
              if ((count == images.length && F == true) || count == 9) {
                console.log('END')
                doc.end()
              }
              return;
            });
          }
        }
      });

    })
    .catch(err => {
      res.send('error: ' + err)
    })
})







module.exports = house