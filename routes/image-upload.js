var express = require('express')
var image = express.Router()

const singleUpload = multer({
    storage: storage, limits: {
      fieldSize: 1024 * 1024 * 5 // no larger than 5mb, you can change as needed.
    },
    FileFilter: FileFilter
  }).single('file');

  house.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
      if (err ) {
        res.json({ error: err });
      }
      //do all database record saving activity
      const imgData = {
        ID_property: req.body.ID_property,
        URL: null
      }
      if (req.file) {
        imgData.URL = req.file.filename
        // handle that a file was uploaded
        img.create(imgData)
        .then(house => {
          res.json(house)
        })
        .catch(err => {
          res.send('error: ' + err) 
        })
      House.update(
        { ImageEX: req.file.filename },
        { where: { ID_Property: req.body.ID_property } }
      )
      }
     
    });
  
  
  });

  module.exports = uploadS3 ;