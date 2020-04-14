var express = require('express')
var group = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const Group = require('../models/Group')
const GroupAn = require('../models/GroupFolder')
const GroupM = require('../models/Groupmembers')
const TypeAn = require('../models/PropertyInGroups')
const User = require('../models/User')
const multer = require('multer');
group.use(cors())
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
//addi


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname,'../uploads/images')
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
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5
  },
  FileFilter: FileFilter
}).single('file');

group.post('/uploadimagegroup', function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      res.json({
        error: err
      });
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
          client.upload(['uploads/images/**'], '/public_html/images', {
            baseDir: 'uploads/images',
            overwrite: 'older'
          }, function (result) {
            console.log(result);
          });
        })
        .catch(err => {
          res.send('error: ' + err)
        })
    }
  });


})
group.post('/addgroup', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const groupData = {
    NameG: req.body.NameG,
    Owner: decoded.ID_User
  }
  Group.create(groupData)
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


})


group.post('/createfolder', (req, res) => {
  const groupData = {
    NameF: req.body.NameF,
    ID_Group: req.body.ID_Group,
  }
  GroupAn.create(groupData)
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


})
group.post('/addAnnouce', (req, res) => {
  const groupData = {
    ID_Property: req.body.ID_Property,
    ID_Folder: req.body.ID_Folder
  }

  TypeAn.findOne({
      where: {
        ID_Folder: req.body.ID_Folder,
        ID_Property: req.body.ID_Property
      }
    })
    //TODO bcrypt
    .then(Property => {
      if (!Property) {
        TypeAn.create(groupData)
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
      } else {
        res.json({
          error: 'มีอสังหานี้อยู่แล้ว'
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })



})

group.put('/group/folder', (req, res) => {

  GroupAn.findAll({
      where: {
        ID_Group: req.body.ID_Group
      }
    })
    .then(group => {
      if (group) {
        res.json(group)
      } else {
        res.send('folder does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
group.put('/group/folder/ID', (req, res) => {

  GroupAn.findAll({
      where: {
        ID_Folder: req.body.ID_Folder
      }
    })
    .then(group => {
      if (group) {
        res.json(group)
      } else {
        res.send('folder does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
group.put('/group/member', (req, res) => {

  GroupM.findAll({
      where: {
        ID_Group: req.body.ID_Group
      }
    })
    .then(group => {
      if (group) {
        res.json(group)
      } else {
        res.send('Member does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
group.get('/group/member/list', (req, res) => {

  User.findAll()
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
group.post('/group/member/add', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  var ID
  if (req.body.Email == decoded.Email) {
    res.json('คุณไม่สามารถเพิ่มตัวเองลงกลุ่มได้')

  } else {
    User.findAll({
        where: {
          Email: req.body.Email
        }
      })
      .then(chack => {
        chack.forEach((element) => {
          ID = element.ID_User
        });

        if (chack.length == '') {
          res.json('อีเมลนี้ไม่มีอยู่จริง')
        } else {
          GroupM.findAll({
              where: {
                ID_Group: req.body.ID_Group,
                ID_User: ID
              }
            })
            .then(findG => {
              if (findG.length == '') {
                GroupM.create({
                    ID_Group: req.body.ID_Group,
                    ID_User: ID
                  })
                  .then(member => {
                    res.json('เพิ่มสมาชิกสำเร็จ')
                  })
                  .catch(err => {
                    res.send('error: ' + err)
                  })

              } else {
                res.json('อีเมลนี้เป็นสมาชิกอยู่แล้ว')
              }
            })
            .catch(err => {
              res.send('error: ' + err)
            })
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  }
})
group.put('/group/member/chack', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  var ID

  User.findAll({
      where: {
        Email: req.body.Email
      }
    })
    .then(chack => {
      chack.forEach((element) => {
        ID = element.ID_User
      });

      if (chack.length == '') {
        res.json('อีเมลนี้ไม่มีอยู่จริง')
      } else {
        res.json(chack)
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })

})

group.put('/group/folder/list', (req, res) => {

  TypeAn.findAll({
      where: {
        ID_Folder: req.body.ID_Folder
      }
    })
    .then(group => {
      if (group) {
        res.json(group)
      } else {
        res.send('list does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
group.get('/group/folder/listAll', (req, res) => {

  TypeAn.findAll()
    .then(group => {
      if (group) {
        res.json(group)
      } else {
        res.send('list does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

group.get('/group', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  Group.findAll({
      where: {
        Owner: decoded.ID_User
      }
    })
    .then(group => {
      if (group) {
        res.json(group)
      } else {
        res.send('group does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

group.get('/groupAll', (req, res) => {

  Group.findAll()
    .then(group => {
      if (group) {
        res.json(group)
      } else {
        res.send('group does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})


group.get('/group/onmember', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  GroupM.findAll({
      where: {
        ID_User: decoded.ID_User
      }
    })
    .then(group => {
      if (group) {
        res.json(group)
      } else {
        res.send('group does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
// delete land
group.put('/group/folder/Delete', (req, res, next) => {
  GroupAn.destroy({
      where: {
        ID_Folder: req.body.ID_Folder
      }
    })
    .then(() => {
      res.send('แฟ้มถูกลบแล้ว')
      return console.log("สำเร็จ.");
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
group.put('/group/Delete', (req, res, next) => {
  Group.destroy({
      where: {
        ID_Group: req.body.ID_Group
      }
    })
    .then(() => {
      res.send('กลุ่มถูกลบแล้ว')
      return console.log("สำเร็จ.");
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
group.put('/group/member/Delete', (req, res, next) => {
  GroupM.destroy({
      where: {
        ID_Group: req.body.ID_Group,
        ID_User: req.body.ID_User
      }
    })
    .then(() => {
      res.send('สมาชิกถูกลบแล้ว')
      return console.log("สำเร็จ.");
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
group.put('/group/Annouce/Delete', (req, res, next) => {
  TypeAn.destroy({
      where: {
        ID_Property: req.body.ID_Property
      }
    })
    .then(() => {
      res.send('ลบอสังหาฯออกจจากกลุ่มแล้ว')
      return console.log("สำเร็จ.");
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
// Update land
group.put('/EditGroupName', (req, res, next) => {
  if (!req.body.ID_Group) {
    res.status(400)
    res.json({
      error: 'Bad Data'
    })
  } else {
    Group.update({
        NameG: req.body.NameG,
      }, {
        where: {
          ID_Group: req.body.ID_Group
        }
      })
      .then(() => {
        res.send('Task Updated!')
        return console.log("สำเร็จ.");
      })
      .error(err => handleError(err))
  }
})
group.put('/EditFolderName', (req, res, next) => {
  if (!req.body.ID_Folder) {
    res.status(400)
    res.json({
      error: 'Bad Data'
    })
  } else {
    GroupAn.update({
        NameF: req.body.NameF,
      }, {
        where: {
          ID_Folder: req.body.ID_Folder
        }
      })
      .then(() => {
        res.send('Task Updated!')
        return console.log("สำเร็จ.");
      })
      .error(err => handleError(err))
  }
})

module.exports = group