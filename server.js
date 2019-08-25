var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');

var app = express()
const serveIndex = require('serve-index');
var port = process.env.PORT || 3001
//app.use(express.static('public'));
app.use('/ftp', express.static('uploads/images'), serveIndex('uploads/images', {'icons': true}));

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false }));
app.use(cookieParser());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});



var Houses = require('./routes/houses')
var Lands = require('./routes/lands')
var Users = require('./routes/Users')
var Group = require('./routes/group')
var location = require('./routes/location')

app.use('/users', Users)
app.use('/users', Group)
app.use('/users', Lands)
app.use('/users', Houses)
app.use('/users', location)

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})


