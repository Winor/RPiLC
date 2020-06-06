'use strict'
const fs = require('fs')
const configfile = fs.readFileSync('config.json')
let config = JSON.parse(configfile)
const Gpio = require('./gpio.js')
const io = require('socket.io-client')
const writer = require('./writer.js')
const device = io.connect(`${config.remote_settings.serverurl}/thindevice`)

async function cheackupdates () {
  const updater = require('./updater.js')
  try {
    const updateinfo = await updater.CheckForUpdates()
    if (updateinfo.update) {
      await updater.update()
      process.exit()
    }
  } catch (err) {
    console.log(err)
  }
}

cheackupdates()

function id () {
  return Math.random().toString(36).substr(2, 9)
}

if (config.uid === undefined) {
  config = writer.edit('./config.json', 'uid', id())
}

function createpinsfromconfig () {
  let i = 0
  const data = {
    names: [],
    devices: []
  }
  config.gpio.forEach(int => {
    data.names.push(`${config.uid}-${i}`)
    data.devices.push(new Gpio(int))
    i++
  })
  return data
}

const devices = createpinsfromconfig()

device.on('connect', () => {
  console.log('ready')
})

device.on('whoareyou', () => {
  device.emit('devices', devices.names)
})

device.on('set', (id, r, g, b) => {
  devices.devices[id].set(r, g, b)
})
