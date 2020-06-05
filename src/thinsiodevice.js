'use strict'
const Device = require('./devices.js').Light
const devices = require('./loader.js')

function Msg (socket, device) {
  this.device = device.split('-').pop()
  this.type = 'RGB'
  this.set = function (r, g, b) {
    socket.emit('set', this.device, r, g, b)
  }
}

class Thin extends Device {
  constructor (type, id, haredware, io, color = 'black', oncolor = 'white', sid) {
    super(type, id, haredware, io, color, oncolor)
    this.socketid = sid
  }

  fadeTimer (colors) {
    let i = 1
    const steps = this.getfade(colors)
    this.playFade(steps[0])
    this.cycle.timer = setInterval(() => {
      if (this.cycle.ison === false) {
        clearInterval(this.cycle.timer)
        return
      }

      this.playFade(steps[i])

      i++

      if (i === Object.keys(steps).length) {
        i = 1
      }
    }, this.cycle.speed)
  }

  playFade (colors) {
    for (let i = 0; i < colors.length; i++) {
      (i => {
        setTimeout(() => {
          if (this.cycle.ison === false) {
            clearInterval(this.cycle.timer)
            return
          }
          this.color = colors[i]
        }, 10 * i)
      })(i)
    }
  }

  fade (colors) {
    let i = 0
    clearInterval(this.fadeonetimer)
    this.fadeonetimer = setInterval(() => {
      if ((i === colors.length) || (i > colors.length)) {
        clearInterval(this.fadeonetimer)
        return
      }
      this.color = colors[i]
      i++
    }, 1)
  }
}

require('./server.js').of('/thindevice')
  .on('connection', (socket) => {
    socket.emit('whoareyou')

    socket.on('devices', (ids) => {
      ids.forEach(device => {
        devices.add(
          new Thin(
            'RGB',
            device,
            'Thin SIO Device',
            new Msg(socket, device),
            'black',
            'white',
            socket.id
          ))
      })
      // devices[socket.id] = new Thin(
      //   'RGB',
      //   socket.id,
      //   'Thin SIO Device',
      //   new Msg(socket),
      //   'black',
      //   'white'
      // )
    })

    socket.on('disconnect', () => {
      const dev = devices.find('socketid', socket.id)
      dev.forEach(device => {
        devices.remove(device[0])
      })
    })
  })
