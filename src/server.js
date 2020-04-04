'use strict'
const log = require('./logger.js')
const interact = require('./interact.js')
const fs = require('fs')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

// load config file
const configfile = fs.readFileSync('config.json')
const config = JSON.parse(configfile)

// web server start
log.info('Starting RPiLC Server ...')
server.listen(config.server_settings.webserverport)
app.use(express.static(config.server_settings.webdir))

io.sockets.on('connection', function (socket) {
  io.sockets.emit('devicelist', interact.listdevices())
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
})
