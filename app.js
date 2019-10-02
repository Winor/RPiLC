'use strict'
const fs = require('fs');
const writer = require('./src/writer.js');
const path = './config.json'
if (!fs.existsSync(path)) {
    console.log("Generating Config File")
    writer.ConfigWrite(writer.ConfigData);
    }
require('./src/sioserver.js');