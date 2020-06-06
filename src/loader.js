'use strict'
const fs = require('fs')
const configfile = fs.readFileSync('config.json')
const config = JSON.parse(configfile)
const writer = require('./writer.js')
const serverevents = require('./devices.js').serverevents
module.exports = {}

Object.defineProperty(module.exports, 'add', {
  writable: true,
  enumerable: false,
  value: function (value) {
    try {
      const key = value.id
      if (!fs.existsSync('./storage.json')) {
        this[key] = value
        serverevents.emit('newdevice', key)
        return
      }
      const storage = writer.read('./storage.json')
      const keys = Object.keys(storage)
      if (keys.includes(key)) {
        for (const [entery, val] of Object.entries(storage[key])) {
          value[entery] = val
        }
      }
      this[key] = value
      serverevents.emit('newdevice', key)
    } catch (e) {
      console.log(e)
    }
  }
})

Object.defineProperty(module.exports, 'remove', {
  writable: true,
  enumerable: false,
  value: function (key) {
    try {
      delete this[key]
      serverevents.emit('removedevice', key)
    } catch (e) {
      console.log(e)
    }
  }
})

Object.defineProperty(module.exports, 'find', {
  writable: true,
  enumerable: false,
  value: function (key, value) {
    try {
      const devs = Object.keys(this)
      const devices = []
      devs.forEach(device => {
        if (this[device][key] === value) {
          devices.push([device, this[device].name])
        }
      })
      return devices
    } catch (e) {
      console.log(e)
    }
  }
})

if (config.server_settings.gpio) {
  require('./pigpio.js')
}

if (config.server_settings.thinsiodevices) {
  require('./thinsiodevice.js')
}
