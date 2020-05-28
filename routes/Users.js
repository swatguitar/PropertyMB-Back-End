const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const nodemailer = require('nodemailer');
var randomize = require('randomatic');
var multer = require('multer')
var aws = require('aws-sdk')
var multerS3 = require('multer-s3')
var sftpStorage = require('multer-sftp')

process.env.SECRET_KEY = 'secret'
users.use(cors())

//************* Config Gmail to send message to repassword *************
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.in.th',
  port: 587, //25, 465, 587 depend on your 
  secure: false, // use SSL
  auth: {
    user: 'propertymb@landvist.xyz', // your email
    pass: 'tar15234' // your email password
  }
});

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


//************* register *************
users.post('/register', (req, res) => {
  const today = new Date()
  const userData = {
    Firstname: req.body.Firstname,
    Lastname: req.body.Lastname,
    birthday: req.body.Birthday,
    Location: req.body.Location,
    UserType: req.body.UserType,
    Phone: req.body.Phone,
    Profile: req.body.Profile,
    Age: req.body.Age,
    Gender: req.body.Gender,
    Question: req.body.Question,
    Answer: req.body.Answer,
    Email: req.body.Email,
    Password: req.body.Password,
    Created: today
  }
  User.findOne({
      where: {
        Email: req.body.Email
      }
    })
    //TODO bcrypt
    .then(user => {
      if (!user) {
        const hash = bcrypt.hashSync(userData.Password, 10)
        userData.Password = hash
        User.create(userData)
          .then(user => {
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
              expiresIn: 14400
            })
            res.json({
              token: token
            })
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      } else {
        res.json({
          error: 'อีเมลนี้ถูกใช้ไปแล้ว'
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
//************* Repassword  *************
users.put('/ResetPassM', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const userData = {
    Password: req.body.Password
  }
  User.findOne({
      where: {
        ID_User: decoded.ID_User
      }
    })
    //TODO bcrypt
    .then(user => {
      if (bcrypt.compareSync(req.body.OldPassword, user.Password)) {
        const hash = bcrypt.hashSync(userData.Password, 10)
        userData.Password = hash
        User.update(
            userData, {
              where: {
                ID_User: decoded.ID_User
              }
            })
          .then(user => {
            res.json('รีเซ็ทรหัสผ่าน สำเร็จ')
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      } else {
        res.json({
          error: 'รหัสผ่านเดิม ไม่ถูกต้อง'
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
users.put('/ResetPass', (req, res) => {
  const userData = {
    Password: req.body.Password
  }
  User.findOne({
      where: {
        Email: req.body.Email,
      }
    })
    //TODO bcrypt
    .then(user => {
      if (user) {
        const hash = bcrypt.hashSync(userData.Password, 10)
        userData.Password = hash
        User.update(userData, {
            where: {
              Email: req.body.Email
            }
          })
          .then(user => {
            res.json('กรุณารีเซ็ทรหัสผ่านของท่าน')
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      } else {
        res.json({
          error: 'ไม่พบผู้ใช้นี้'
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* Send email *************
users.post('/sendEmail', (req, res) => {
  User.findOne({
      where: {
        Email: req.body.Email,
      }
    })
    //TODO bcrypt
    .then(user => {
      if (user) {
        token = randomize('Aa0', 10); //creating the token to be sent to the forgot password form (react)
        const hash = bcrypt.hashSync(token, 10) //hashing the password to store in the db node.js
        User.update({
            Token: hash,
            //Phone: moment.utc().add(config.tokenExpiry, 'seconds'),
          }, {
            where: {
              Email: user.Email
            }
          }).then(function (item) {
            if (!item) {
              res.json({
                error: 'Oops problem in creating new password record'
              })
            } else {

              let mailOptions = {
                from: '"<PropertyMB Team>" propertymb@landvist.xyz',
                to: user.Email,
                subject: 'คำร้องขอรีเซ็ทรหัสผ่าน PropertyMB',
                html: '<hr><h2 style="text-align: center">PropertyMB</h2><hr>' +
                  '<img src="https://www.landvist.xyz/images/Defult/logo2.png">' +
                  '<h3><b>คำร้องขอรีเซ็ทรหัสผ่าน PropertyMB</b></h3>' +
                  '<p>เรียนท่านผู้ใช้งาน</p>' +
                  '<p>ท่านได้ยื่นคำร้องขอรีเซ็ทรหัสผ่านของท่าน และระบบได้ทำการรีเซ็ทรหัสผ่านของท่านแล้ว โปรดใช้รหัสผ่านชั่วคราวด้านล่าง ในการรีเซ็ทรหัสผ่าน</p>' +
                  '<br>' +
                  '<h1 style="color:green;"><b>' + token + '</b></h1>' +
                  '<br><br>' +
                  '<p>หลังจากรีเซ็ทรหัสผ่านแล้วกรุณาเก็บรหัสผ่านเป็นความลับเพื่อนความปลอดภัยของท่าน</p>' +
                  '<br><br>' +
                  '<p>หากคุณไม่ได้ร้องขอการรีเซ็ทรหัสผ่าน โปรดติดต่อทีมงาน</p>' +
                  '<br><br>' +
                  '<p>PropertyMB Team</p>' +
                  '<p style="text-align: center">Copyright@PropertyManagement 2018 - 2019</p>'
              }
              transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                  console.log(err)
                  res.json('กรุณาลองใหม่อีกครั้ง')
                } else {
                  res.json('กรุณาตรวจสอบอีเมลของท่าน เราได้รีเซ็ตรหัสไปยังอีเมลที่ท่านเคยลงทะเบียนไว้ ')
                }
              });
            }
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      } else {
        res.json({
          error: 'ไม่พบอีเมล'
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* compare token after repassword *************
users.post('/compareToken', (req, res) => {
  User.findOne({
      where: {
        Email: req.body.Email,
      }
    })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.Token, user.Token)) {
          User.update({
              Token: " "
            }, {
              where: {
                Email: req.body.Email
              }
            })
            .then(user => {
              res.json('กรุณารีเซ็ทรหัสผ่านของท่าน')
            })
            .catch(err => {
              res.send('error: ' + err)
            })
        } else {
          res.json({
            error: 'รหัสยืนยัน ไม่ถูกต้อง'
          })
        }
      } else {
        res.json({
          error: 'ไม่พบผู้ใช้นี้'
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* Update infomation profile *************
users.put('/updateprofile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const userData = {
    Firstname: req.body.Firstname,
    Lastname: req.body.Lastname,
    Birthday: req.body.Birthday,
    LocationU: req.body.LocationU,
    Phone: req.body.Phone,
    Age: req.body.Age,
    UserType: req.body.UserType,
    Gender: req.body.Gender,
  }
  User.findOne({
      where: {
        ID_User: decoded.ID_User,
      }
    })
    .then(user => {
      if (user) {
        User.update(
            userData, {
              where: {
                ID_User: decoded.ID_User
              }
            })
          .then(user => {
            res.json('บันทึกสำเร็จ')
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      } else {
        res.json({
          error: 'ไม่พบผู้ใช้นี้'
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* Delete image profile *************
users.put('/removeimg', (req, res, next) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const userData = {
    ProfileImg: '',
  }
  User.findAll({
      where: {
        ID_User: decoded.ID_User
      }
    }).then(Image => {
      if (Image) {
          User.update(
              userData, {
                where: {
                  ID_User: decoded.ID_User
                }
              })
            .then(user => {
              res.json("ลบรูปภาพสำเร็จ")
            })
            .catch(err => {
              res.send('error: ' + err)
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

//************* Find Email *************
users.post('/GetEmail', (req, res) => {
  User.findOne({
      where: {
        Email: req.body.Email
      }
    })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.json({
          error: 'ไม่พบอีเมลนี้ในระบบ'
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* Login *************
users.post('/login', (req, res) => {
  User.findOne({
      where: {
        Email: req.body.Email
      }
    })
    .then(user => {
      if (bcrypt.compareSync(req.body.Password, user.Password)) {
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
          expiresIn: "365d"
        })
        res.json({
          token: token
        })
      } else {
        res.send('อีเมลไม่ถูกต้อง')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* get profile info *************
users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  User.findOne({
      where: {
        ID_User: decoded.ID_User
      }
    })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })

})
//************* update image profile *************
users.post('/uploadprofile', function (req, res, next) {
  uploadImg(req, res, function (err) {
    if (err) {
      res.json({
        error: err
      });
    }
    const ID = {
      ID_User: req.body.ID_User
    }
    const imgData = {
      ProfileImg: null
    }
    if (req.file) {
      imgData.ProfileImg = req.file.locaation
      User.update(imgData, {
          where: {
            ID_User: ID.ID_User
          }
        })
        .then(result => {
          if(result){
            res.json(result)
          }
        })
        .catch(err => {
          res.send('error: ' + err)
        })
    }
  });
});


module.exports = users