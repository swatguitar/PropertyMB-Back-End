const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
  const today = new Date()
  const userData = {
    Firstname: req.body.Firstname,
    Lastname: req.body.Lastname,
    birthday: req.body.Birthday,
    Location: req.body.Location,
    Phone: req.body.Phone,
    Profile: req.body.Profile,
    Age: req.body.Age,
    Gender: req.body.Gender,
    Occupation: req.body.Occupation,
    Email: req.body.Email,
    Password: req.body.Password,
    Created: today
  }

  User.findOne({
    where: {
      Email: req.body.email
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
              expiresIn: 1440
            })
            res.json({ token: token })
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})



users.post('/login', (req, res) => {
  User.findOne({
    where: {
      Email: req.body.Email
    }
  })
    .then(user => {
      if(bcrypt.compareSync(req.body.Password, user.Password)){
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
          expiresIn: 144000
        })
        res.json({ token: token })
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

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

module.exports = users 
