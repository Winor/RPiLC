'use strict'
const fs = require('fs')
const configfile = fs.readFileSync('config.json')
const config = JSON.parse(configfile)

console.log('Config file loaded')

function getdate () {
  const date = new Date()
  const options = {
    month: 'short',
    day: 'numeric'

  }
  return date.toLocaleTimeString('en-us', options)
}

module.exports.info = function (msg) {
  console.log(getdate() + '\x1b[36m', '[info]', '\x1b[0m' + '' + msg)
}

module.exports.debug = function (msg) {
  if (config.server_settings.debug) {
    console.log(getdate() + '\x1b[35m', '[debug]', '\x1b[0m' + '' + msg)
  }
}

module.exports.data = function (msg) {
  if (config.server_settings.debug) {
    console.log(getdate() + '\x1b[35m', '[debug]', '\x1b[0m' + '' + JSON.stringify(msg, null, 2))
  }
}

module.exports.warn = function (msg) {
  console.log(getdate() + '\x1b[33m', '[warn]', '\x1b[0m' + '' + msg)
}

module.exports.error = function (msg) {
  console.log(getdate() + '\x1b[31m', '[error]', '\x1b[0m' + '' + msg)
}
