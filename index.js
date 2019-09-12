'use strict'
const fs = require('fs');
const writer = require('./src/writer.js');
const path = './config.json'
if (!fs.existsSync(path)) {
    console.log("Generating Config File")
    writer.ConfigWrite(writer.ConfigData);
    }

  const child_process = require('child_process');
  function StartPCycle() {
    console.log("Initializing RPiLC")
    let workerProcess = child_process.spawn('node', ['app.js']);  
    workerProcess.stdout.on('data', function (data) {  
        console.log(data.toString());  
     });  
   workerProcess.stderr.on('data', function (data) {  
        console.log(data.toString());  
     });  
   workerProcess.on('close', function (code) {  
        console.log('RPiLC process exited with code ' + code);
        if (code == 0){
        setTimeout(() => {
          StartPCycle();
        }, 100); } else {
          process.exit();
        }
     });  
    
  }

  StartPCycle();