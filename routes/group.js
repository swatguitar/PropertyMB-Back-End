var express = require('express')
var group = express.Router()
const jwt = require('jsonwebtoken')
const Group = require('../models/Group')
const multer = require('multer');     


group.post('/addgroup',  (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const groupData = {
      name: req.body.name,
      Img: req.body.Img,
      Owner: decoded.ID_User
    }
          Group.create(groupData)
            .then(group => {
              let token = jwt.sign(group.dataValues, process.env.SECRET_KEY, {
                expiresIn: 1440
              })
              res.json({ token: token })
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
  module.exports = group