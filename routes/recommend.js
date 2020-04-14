const express = require('express')
const recommend = express.Router()
const cors = require('cors')
const path = require('path')
const {spawn} = require('child_process')
let {PythonShell} = require('python-shell')
const nodemailer = require('nodemailer');
recommend.use(cors())


recommend.get('/recommend', (req, res) => {

  const { spawn } = require('child_process');
  const process = spawn('python', ['../TEST.py', 
  req.query.firstname, 
  req.query.lastname]);

  process.stdout.on('data', function(data) {

      console.log(data.toString());
      res.write(data);
      res.end('end');
  });
})

recommend.get('/name', callName); 
  
function callName(req, res) { 
      
    // Use child_process.spawn method from  
    // child_process module and assign it 
    // to variable spawn 
    var spawn = require("child_process").spawn; 
      
    // Parameters passed in spawn - 
    // 1. type_of_script 
    // 2. list containing Path of the script 
    //    and arguments for the script  
      
    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will 
    // so, first name = Mike and last name = Will 
    var process = spawn('python',["./TEST.py", 
                            req.query.firstname, 
                            req.query.lastname] ); 
  
    // Takes stdout data from script which executed 
    // with arguments and send this data to res object 
    process.stdout.on('data', function(data) { 
        res.send(data.toString()); 
    } ) 
} 


module.exports = recommend 
