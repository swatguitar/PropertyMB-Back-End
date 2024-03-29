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
var sftpStorage = require('multer-sftp')
var FTPStorage = require('multer-ftp')
process.env.SECRET_KEY = 'secret'
users.use(cors())

//************* Config Gmail to send message to repassword *************
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.in.th',
  port: 587, //25, 465, 587 depend on your 
  secure: false, // use SSL
  auth: {
    user: 'propertymb@landhousevisit.xyz', // your email
    pass: 'Tar15234' // your email password
  }
});

//************* Config Hostinger bucket *************
var storage = sftpStorage({
  sftp: {
    host: '194.163.35.36',
    port: 65002,
    username: 'u534412661',
    password: 'Tar15234',
  },
  destination: function (req, file, cb) {
    cb(null, 'domains/landhousevisit.xyz/public_html/images/NewImg')
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


//** config file **
var uploadImg = multer({
  storage:  new FTPStorage({
    basepath: 'images/NewImg/',
    ftp: {
      host: '194.163.35.36',
      secure: false, // enables FTPS/FTP with TLS
      user: 'u534412661',
      password: 'Tar15234'
    },destination: function (req, file, options, callback) {
      callback(null, 'images/NewImg/img_' + Date.now() + '.jpg') // custom file destination, file extension is added to the end of the path
    }
  })
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
  User.findAll({
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
  User.findAll({
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
              Email: user[0].Email
            }
          }).then(function (item) {
            if (!item) {
              res.json({
                error: 'Oops problem in creating new password record'
              })
            } else {

              let mailOptions = {
                from: '"<PropertyMB Team>" propertymb@landhousevisit.xyz',
                to: user[0].Email,
                subject: 'คำร้องขอรีเซ็ทรหัสผ่าน PropertyMB',
                html: '<hr><h2 style="text-align: center">PropertyMB</h2><hr>' +
                  '<img src="https://www.landhousevisit.xyz/images/Defult/logo2.png">' +
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
  User.findAll({
      where: {
        Email: req.body.Email,
      }
    })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.Token, user[0].Token)) {
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
  User.findAll({
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
  User.findAll({
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
      imgData.ProfileImg = "http://landhousevisit.xyz/"+req.file.path
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