'use strict'
const fs = require('fs')
const writer = require('./src/writer.js')
writer.configver()

if (!fs.existsSync('./config.json')) {
  console.log('Generating Config File')
  writer.genconfig()
}
const configfile = fs.readFileSync('config.json')
const config = JSON.parse(configfile)

switch (config.server_settings.mode) {
  case 'server':
    require('./src/server.js')
    break

  case 'remote':
    require('./src/remote.js')
    break

  default:
    require('./src/server.js')
    break
}
