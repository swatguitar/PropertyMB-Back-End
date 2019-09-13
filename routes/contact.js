var express = require('express')
var contact = express.Router()
const jwt = require('jsonwebtoken')
const Contact = require('../models/Contact')
const multer = require('multer');     

process.env.SECRET_KEY = 'secret'
contact.post('/addContact',  (req, res) => {
    //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    const contactData = {
        Name: req.body.Name,
        Email:req.body.Email,
        Phone: req.body.Phone,
        Line: req.body.Line,
        CreateOwner: decoded.ID_User
    }
    Contact.create(contactData)
            .then(contact => {
              let token = jwt.sign(contact.dataValues, process.env.SECRET_KEY, {
                expiresIn: 1440
              })
              res.json({ token: token })
            })
            .catch(err => {
              res.send('error: ' + err)
            })
       
      
  })

  contact.get('/contact', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  
    Contact.findAll({
      where: {
        Owner: decoded.ID_User
      }
    })
      .then(contact => {
        if (contact) {
          res.json(contact)
        } else {
          res.send('contact does not exist')
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  })

 
  module.exports = contact