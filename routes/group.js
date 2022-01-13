var express = require('express')
var group = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const Group = require('../models/Group')
const GroupAn = require('../models/GroupFolder')
const GroupM = require('../models/Groupmembers')
const TypeAn = require('../models/PropertyInGroups')
const User = require('../models/User')
const db = require('../database/db.js')
const {
  Op
} = require("sequelize");
var multer = require('multer')
var aws = require('aws-sdk')
var sftpStorage = require('multer-sftp')
var FTPStorage = require('multer-ftp')
group.use(cors())

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
      callback(null, 'img_' + Date.now() + '.jpg') // custom file destination, file extension is added to the end of the path
    }
  })
}).single('file');
//const uploadImg = uploadFTP.single('file');

//************* get group detail member *************
group.get('/group/groupDetailMember', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  db.sequelize.query(
    "SELECT * FROM `Groups` AS `g` INNER JOIN `Groupmembers` AS `gm` ON `g`.`ID_Group` = `gm`.`ID_Group`  WHERE `gm`.`ID_User`= " + decoded.ID_User , {
        type: Op.SELECT
      }
    ).then(groupDetail => {
      if (groupDetail) {
        res.json(groupDetail[0])
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

//************* get group detail member *************
group.post('/group/ListDetailMember', (req, res) => {
 
  db.sequelize.query(
    "SELECT * FROM Groupmembers AS m INNER JOIN Users AS u ON `m`.ID_User = `u`.ID_User  WHERE `m`.`ID_Group`= "+req.body.ID_Group  , {
        type: Op.SELECT
      }
    ).then(ListDetail => {
      if (ListDetail) {
        res.json(ListDetail[0])
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

//************* get property in folder *************
group.post('/group/folder/Listproperty', (req, res) => {
 
  db.sequelize.query(
    "SELECT * FROM PropertyInGroups AS pig INNER JOIN propertys AS p ON `pig`.ID_Property = `p`.ID_Property INNER JOIN Users AS u ON `p`.owner = `u`.ID_user  WHERE `pig`.`ID_Folder`= "+req.body.ID_Folder  , {
        type: Op.SELECT
      }
    ).then(item => {
      if (item) {
        res.json(item[0])
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

//************* get Land in folder *************
group.post('/group/folder/ListLand', (req, res) => {
 
  db.sequelize.query(
    "SELECT * FROM PropertyInGroups AS pig INNER JOIN lands AS l ON `pig`.ID_Property = `l`.ID_Lands INNER JOIN Users AS u ON `l`.owner = `u`.ID_user WHERE `pig`.`ID_Folder`= "+req.body.ID_Folder  , {
        type: Op.SELECT
      }
    ).then(item => {
      if (item) {
        res.json(item[0])
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
//************* get group by owner id *************
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
        res.send('ไม่พบกลุ่ม')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* get folder of group  *************
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
        res.send('ไม่พบแฟ้ม')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* get all group *************
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

//************* get group that you are member  *************
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

//************* get group that you are member  *************
group.post('/uploadimagegroup', function (req, res, next) {
  uploadImg(req, res, function (err) {
    if (err) {
      res.json({
        error: err
      });
    }
    if (req.file) {
      Group.update({
          Img: "https://landhousevisit.xyz/images/NewImg/"+req.file.path
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
})

//************* create group *************
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

//************* create folder *************
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

//************* Get group by id group *************
group.post('/group/groupbById', (req, res) => {
  Group.findAll({
    where: {
      ID_Group: req.body.ID_Group,
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

//************* add property into group *************
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
    .then(Property => {
      if (!Property) {
        TypeAn.create(groupData)
          .then(group => {
            let token = jwt.sign(group.dataValues, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            res.json("เพิ่มอสังหาฯลงกลุ่มสำเร็จ")
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      } else {
        res.json({
          error: 'มีอสังหานี้ในกลุ่มแล้ว'
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* get group folder *************
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

//************* get group member *************
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

//************* get owner info *************
group.post('/group/owner', (req, res) => {
  User.findAll({
    where: {
      ID_User: req.body.ID_User
    }
  })
  
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//************* add member to group *************
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
          res.json('ไม่พบผู้ใช้งาน')
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

//************* check user *************
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
        res.json('ไม่พบผู้ใช้งาน')
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
//************* get peoperty of folder *************
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



 //************* Delete folder  *************
group.put('/group/folder/Delete', (req, res, next) => {
  GroupAn.destroy({
      where: {
        ID_Folder: req.body.ID_Folder
      }
    })
    .then(() => {
      res.json('แฟ้มถูกลบแล้ว')
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
 //************* Delete group  *************
group.put('/group/Delete', (req, res, next) => {
  Group.destroy({
      where: {
        ID_Group: req.body.ID_Group
      }
    })
    .then(() => {
      res.json('กลุ่มถูกลบแล้ว')
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

 //************* Delete member  *************
group.put('/group/member/Delete', (req, res, next) => {
  GroupM.destroy({
      where: {
        ID_Group: req.body.ID_Group,
        ID_User: req.body.ID_User
      }
    })
    .then(() => {
      res.json('สมาชิกถูกลบแล้ว')
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

 //************* Delete item  *************
group.put('/group/Annouce/Delete', (req, res, next) => {
  TypeAn.destroy({
      where: {
        ID_Property: req.body.ID_Property
      }
    })
    .then(() => {
      res.json('ลบอสังหาฯออกจจากกลุ่มแล้ว')
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

 //************* Edit group name  *************
group.put('/EditGroupName', (req, res, next) => {
  if (!req.body.ID_Group) {
    res.status(400)
    res.json({
      error: 'กรุณากรอกชื่อกลุ่ม'
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
        res.json('แก้ไขสำเร็จ')
      })
      .error(err => handleError(err))
  }
})

 //************* Edit folder name  *************
group.put('/EditFolderName', (req, res, next) => {
  if (!req.body.ID_Folder) {
    res.status(400)
    res.json({
      error: 'กรุณากรอกชื่อแฟ้ม'
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
        res.json('แก้ไขสำเร็จ')
      })
      .error(err => handleError(err))
  }
})

module.exports = group