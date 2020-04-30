var express = require('express')
var contact = express.Router()
const jwt = require('jsonwebtoken')
const Contact = require('../models/Contact')
const multer = require('multer');
const {
  Op
} = require("sequelize");
process.env.SECRET_KEY = 'secret'


//************* Add contact *************
contact.post('/addContact', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const contactData = {
    ID_Contact: req.body.ID_Contact,
    Name: req.body.ContactName,
    Email: req.body.ContactEmail,
    Phone: req.body.ContactPhone,
    Line: req.body.ContactLine,
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


//************* get contact to show in property detail *************
contact.post('/contactDetail', (req, res) => {
  Contact.findAll({
    where: {
      ID_Contact:{
        [Op.or]: [req.body.ContactU, req.body.ContactUo,req.body.ContactUt], 
      } 
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

//************* get contact to auto complete *************
contact.get('/contact', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  Contact.findAll({
    where: {
      CreateOwner: decoded.ID_User 
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

//************* get contact to Random ID *************
contact.post('/contactDuplicate', (req, res) => {
  Contact.findAll({
    where: {
      ID_Contact:req.body.ContactU
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

// Update land
contact.put('/EditContact', (req, res, next) => {
  console.log(req.body)
  if (req.body.ContactName == '')  {
    res.status(400)
    res.json({
      error: 'กรุณากรอกชื่อ'
    })
  } else {
    Contact.update(
      { 
        Name: req.body.ContactName,
        Email: req.body.ContactEmail,
        Line: req.body.ContactLine,
        Phone: req.body.ContactPhone,
       },
      { where: { ID_Contact: req.body.ID_Contact } }
    ).then(() => {
      res.json('บันทึกสำเร็จ')
    })
    .error(err => handleError(err))
  }
})


module.exports = contact