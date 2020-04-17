
var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')
aws.config.update({
    secretAccessKey: 'P0f/1f+x4n8aXsTaRHXlgnscnoA0ccbvAUMCbr5w',
    accessKeyId: 'AKIAIXQ74JGXTQPVIO2Q',
    region: 'us-east-2'
  })
  var s3 = new aws.S3()
   
  var uploadS3 = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'backendppmb',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })

  module.exports = uploadS3 ;