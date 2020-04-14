
var express = require('express')
var cors = require('cors')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var fs = require('fs')
const jwt = require('jsonwebtoken')
var app = express()
const serveIndex = require('serve-index');
var port = process.env.PORT || 3001
app.use(express.static( 'public'));
app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('views', __dirname + '/views');
app.use('/ftp', express.static(__dirname +'/uploads/images'), serveIndex('uploads/images', {'icons': true}));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});


var Houses = require('./routes/houses')
var Lands = require('./routes/lands')
var Users = require('./routes/Users')
var Group = require('./routes/group')
var Contact = require('./routes/contact')
var location = require('./routes/location')
var recommend = require('./routes/recommend')

app.use('/users', Users)
app.use('/users', Group)
app.use('/users', Lands)
app.use('/users', Houses)
app.use('/users', Contact)
app.use('/users', location)
app.use('/users', recommend)


app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})


app.get('/recommendHouse', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const { spawn } = require('child_process');
  const processPY = spawn('python', ['./Load_from_Database.py', 
  req.query.ID_User = decoded.ID_User, 
  req.query.lastname]);

  processPY.stdout.on('data', function(data) {

      console.log(data.toString());
      res.json({
        Result: 'Succress'
      })
      res.end('end');
  });
})

app.get('/recommendLand', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  const { spawn } = require('child_process');
  const processPY = spawn('python', ['./Load_from_Database.py', 
  req.query.ID_User = decoded.ID_User, 
  req.query.lastname]);

  processPY.stdout.on('data', function(data) {

      console.log(data.toString());
      res.json({
        Result: 'Succress'
      })
      res.end('end');
  });
})


