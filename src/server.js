'use strict'
const log = require('./logger.js')
log.info('Starting RPiLC Server ...')
const fs = require('fs')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
module.exports = io
const interact = require('./interact.js')
const writer = require('./writer.js')
const updater = require('./updater.js')

// load config file
const configfile = fs.readFileSync('config.json')
const config = JSON.parse(configfile)

if (config.server_settings.mqtt) {
  require('./mqtt.js')
}

// web server start
server.listen(config.server_settings.webserverport)
app.use(express.static(config.server_settings.webdir))

io.sockets.on('connection', function (socket) {
  io.sockets.emit('config', interact.getconfig())
  socket.on('askdevs', function (group) {
    if (group === 'ALL') {
      io.sockets.emit('devicelist', interact.listdevicesnames())
      return
    }
    io.sockets.emit('devicelist', interact.filterdevices('group', group))
  })
  socket.on('askdata', function (device) {
    io.sockets.emit('data', interact.getdata(device))
  })
  socket.on('setcolor', function (device, color) {
    io.sockets.emit('updatecolor', interact.setcolor(device, color))
  })
  socket.on('previewcolor', function (device, color) {
    interact.previewcolor(device, color)
  })
  socket.on('togglestate', function (device, state) {
    io.sockets.emit('updatecolor', interact.togle(device, state))
    io.sockets.emit('cycle', interact.getdata(device))
  })
  socket.on('cycle', function (device, { ison, colors, effect, speed }) {
    io.sockets.emit('cycle', interact.setcycle(device, { ison, colors, effect, speed }))
  })
  socket.on('setoldcolor', function (device) {
    io.sockets.emit('updatecolor', interact.setoldcolor(device))
  })
  socket.on('setconfig', function (data) {
    interact.setconfig(data)
  })
  socket.on('setoncolor', function (device) {
    io.sockets.emit('updatecolor', interact.setoncolor(device))
  })
  socket.on('fadeone', function (device, color) {
    io.sockets.emit('updatecolor', interact.fadeone(device, color))
  })
  socket.on('devicesetings', function (device, { name, oncolor, group }) {
    io.sockets.emit('devicesetings', interact.devicesetings(device, { name, oncolor, group }))
    writer.edit('./storage.json', device, interact.savedata(device))
  })
  socket.on('checkupdate', async function () {
    io.sockets.emit('updates', { update: 'checking' })
    try {
      const updateinfo = await updater.CheckForUpdates()
      io.sockets.emit('updates', updateinfo)
    } catch (err) {
      io.sockets.emit('updates', { update: 'err' })
    }
  })
  socket.on('update', async function () {
    io.sockets.emit('updates', { update: 'installing' })
    try {
      await updater.update()
      interact.restart()
    } catch (err) {
      io.sockets.emit('updates', { update: 'err' })
    }
  })
})

// server events
interact.events.on('updatecolor', function (device) {
  io.sockets.emit('updatecolor', interact.getdata(device))
})
interact.events.on('updatesaved', function (device) {
  writer.edit('./storage.json', device, interact.savedata(device))
  io.sockets.emit('updatesaved', interact.getdata(device))
})
interact.events.on('newdevice', function (device) {
  io.sockets.emit('devicelist', interact.listdevicesnames())
})
interact.events.on('removedevice', function (device) {
  io.sockets.emit('devicelist', interact.listdevicesnames())
})
// API
app.get('/api/', (req, res) => {
  return res.json(interact.listdevicesnames())
})

app.get('/api/:device', (req, res) => {
  return res.json(interact.getdata(req.params.device))
})

app.get('/api/:device/toggle', (req, res) => {
  return res.json(interact.togle(req.params.device))
})

app.get('/api/:device/toggle/:state', (req, res) => {
  return res.json(interact.togle(req.params.device, req.params.state))
})

app.get('/api/:device/setcolor/:color', (req, res) => {
  return res.json(interact.setcolor(req.params.device, req.params.color))
})

app.get('/api/group/:group/setcolor/:color', (req, res) => {
  return res.json(interact.groupsetcolor(req.params.group, req.params.color))
})

log.info('Server Ready.')
