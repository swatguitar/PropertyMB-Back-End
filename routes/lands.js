var express = require('express')
var land = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
var multer = require('multer')
var request = require('request')
var aws = require('aws-sdk')
var multerS3 = require('multer-s3')
const PDFDocument = require('pdfkit')
const {
  Op
} = require("sequelize");
const House = require('../models/House')
const Land = require('../models/Land')
const imgL = require('../models/ImgLand')
const User = require('../models/User')
const db = require('../database/db.js')
var sftpStorage = require('multer-sftp')

process.env.SECRET_KEY = 'secret'
land.use(cors())

//************* Config Hostinger bucket *************
var storage = sftpStorage({
  sftp: {
    host: '156.67.222.168',
    port: 65002,
    username: 'u656477047',
    password: 'tar15234'

  },
  destination: function (req, file, cb) {
    cb(null, '/domains/landvist.xyz/public_html/images/NewImg')
  },
  filename: function (req, file, cb) {
    cb(null, 'img_' + Date.now() + '.jpg')
  }
})

//************* FileFilter to filter image before upload *************
const FileFilter = (req, file, cd) => {

  if (file.mimettype === 'image/jpeg' || file.mimettype === 'image/png') {
    cd(null, true);
  } else {
    cd(null, false);
  }
}
//************* Config Amazon s3 bucket *************
/*aws.config.update({
  secretAccessKey: 'FOwpx/09x7mWBwtuRa6GoILjKER23RQbOvKqxU9/',
  accessKeyId: 'AKIAIH5UYQ4D2YZCUDEA',
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
})*/

//** config file **
//const uploadImg = uploadS3.single('file');
var uploadImg = multer({
  storage: storage
}).single('file');
//const uploadImg = uploadFTP.single('file');

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

//************* get land by user id *************
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

//************* get land by filter *************
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
    Land.update({
        PPStatus: req.body.PPStatus

      }, {
        where: {
          ID_Lands: req.body.ID_Lands
        }
      })
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
      imgData.URL = "https://landvist.xyz/images/NewImg/"+req.file.filename
      imgData.File_Name = req.file.filename
      imgL.create(imgData)
        .then(land => {
          res.json(land)
        })
        .catch(err => {
          res.send('error: ' + err)
        })
      Land.update({
        ImageEX: "https://landvist.xyz/images/NewImg/"+req.file.filename
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
        Owner: decoded.ID_User,
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
      if (!land) {
        res.json("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีครั้ง")
      } else {
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
    Land.update({
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
        WxD: req.body.WxD
      }, {
        where: {
          ID_Lands: req.body.ID_Lands
        }
      })
      .then(() => {
        res.json('อัพเดทข้อมูล สำเร็จ')
      })
      .error(err => handleError(err))
  }
})

//************* Load PDF land// *************
land.post('/LandPDF', (req, res) => {
  const doc = new PDFDocument({
    size: 'A4'
  })
  let uri = req.body.URL
  let Owner = []
  let images = []
  let count = 0
  let X = 0
  let Y = 0
  let F = false
  let IF = false
  let sortX = 0
  let sortY = 0
  imgL.findAll({
    where: {
      ID_land: req.body.ID_Lands
    }
  }).then(result => {
    images = result
  });
  Land.findAll({
      where: {
        ID_Lands: req.body.ID_Lands
      }
    })
    .then(land => {

      User.findAll({
        where: {
          ID_User: land[0].Owner
        }
      }).then(Owner => {
        res.setHeader(
          'Access-Control-Allow-Origin', '*'
        );
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="' + house[0].ID_Property + '".pdf'
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
          doc.text(land[0].AnnounceTH, 50, 130, {
            width: 600
          }).font('service/THSarabun.ttf', 13);
          doc.image('service/Mark.png', 50, 152, {
            width: 10,
            height: 10
          });
          doc.text(land[0].Location + ',' + land[0].LDistrict + ',' + land[0].LAmphur + ',' + land[0].LProvince + ' ประเทศไทย ' + land[0].LZipCode, 60, 150).font('service/THSarabun.ttf', 10);
          doc.text('ประเภทที่ดิน : ' + land[0].ColorType, 50, 162).font('service/THSarabun-Bold.ttf', 14);
          doc.image('service/hr.png', 295, 165, {
            width: 10,
            height: 300
          });
          doc.text('รายละเอียด', 60, 365, {
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
          doc.text('รหัสอสังหา :', 60, 210, {
            width: 410
          });
          doc.text('ประเภทโฉนด :', 60, 225, {
            width: 410
          });
          doc.text('เลขโฉนด :', 60, 240, {
            width: 410
          });
          doc.text('ราคาขาย :', 60, 255, {
            width: 410
          });
          doc.text('ราคาประเมิน :', 60, 270, {
            width: 410
          });
          doc.text('ราคาตลาด :', 60, 285, {
            width: 410
          });
          doc.text('กรมที่ดินประเมิน :', 60, 300, {
            width: 410
          });
          doc.text('ราคาต่อตารางวา :', 60, 315, {
            width: 410
          });
          doc.text('**วางเงินมัดจำ', 60, 330, {
            width: 410
          });
          doc.text(land[0].LandR + ' ไร่', 60, 385, {
            width: 410
          });
          doc.text(land[0].LandG + ' งาน', 60, 400, {
            width: 410
          });
          doc.text(land[0].LandWA + ' ตารางวา', 60, 415, {
            width: 410
          });
          doc.text('พื้นที่(กว้าง*ลึก) : ' + land[0].Land + ' เมตร', 60, 430, {
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
          doc.text('ที่ดิน', 200, 195, {
            width: 410
          });
          doc.text(land[0].CodeProperty, 200, 210, {
            width: 410
          });
          doc.text(land[0].Deed, 200, 225, {
            width: 410
          });
          doc.text(land[0].CodeDeed, 200, 240, {
            width: 410
          });
          doc.text(land[0].SellPrice + ' บาท', 200, 255, {
            width: 410
          });
          doc.text(land[0].CostestimateB + ' บาท', 200, 270, {
            width: 410
          });
          doc.text(land[0].MarketPrice + ' บาท', 200, 285, {
            width: 410
          });
          doc.text(land[0].Costestimate + ' บาท', 200, 300, {
            width: 410
          });
          doc.text(land[0].PriceWA + ' บาท', 200, 315, {
            width: 410
          });
          doc.text('10%', 200, 330, {
            width: 410
          });
          // right
          doc.text(land[0].PPStatus, 435, 195, {
            width: 410
          });
          doc.text(land[0].AsseStatus, 435, 210, {
            width: 41
          });
          doc.text(Owner[0].Email, 435, 270, {
            width: 410
          });
          doc.text(Owner[0].Phone, 435, 285, {
            width: 410
          });
          doc.font('service/THSarabun.ttf', 10)
          doc.text(land[0].Location + ',' + land[0].LDistrict + ',' + land[0].LAmphur + ',' + land[0].LProvince + ' ประเทศไทย ' + land[0].LZipCode, 340, 330)
          doc.image('service/Mark.png', 335, 333, {
            width: 5,
            height: 5
          });
          doc.image(body, 335, 355, {
            width: 250,
            height: 110
          })
          F = true
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


module.exports = land