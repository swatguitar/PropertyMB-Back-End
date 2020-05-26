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


app.use('/ftp', express.static(__dirname + '/uploads/images'), serveIndex('uploads/images', {
  'icons': true
}));

const aws = require('aws-sdk');

app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);


app.use(express.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));
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


app.listen(port, function () {
  console.log('Server is running on port: ' + port)
})



app.get('/', (req, res) => {
  res.end('Welcom to PropertyMB Backend');
})


app.post('/recommendHouse', (req, res) => {
  //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  // 'py' is use in cmd python
  console.log("Property ID FN is : " +req.body.ID_Property);
  const {
    spawn
  } = require('child_process');
  const processPY = spawn('python', ['./Model_House_Connect_Database-Debug01.py',
    req.query.ID_Property = req.body.ID_Property,
  ]);

  processPY.stdout.on('data', function (data) {

    console.log(data.toString());
  
    res.end('end');
  });
})

app.post('/recommendLand', (req, res) => {
  //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  console.log("Property ID FN is : " +req.body.ID_Property);
  const {
    spawn
  } = require('child_process');
  const processPY = spawn('python', ['./Model_Land_Connect_Database-Debug01.py',
    req.query.ID_Lands = req.body.ID_Lands,
  ]);

  processPY.stdout.on('data', function (data) {

    console.log(data.toString());
  
    res.end('end');
  });
})