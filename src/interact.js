'use strict'
const fs = require('fs')
const configfile = fs.readFileSync('config.json')
const config = JSON.parse(configfile)
const serverevents = require('./devices.js').serverevents
let devices = {}

if (config.server_settings.gpio) {
  const pigpio = require('./pigpio.js')
  devices = pigpio
}
module.exports = {
  events: serverevents,
  listdevices: function () {
    const devs = Object.keys(devices)
    return devs
  },
  listdevicesnames: function () {
    const devs = Object.keys(devices)
    const names = []
    devs.forEach(device => {
      names.push(devices[device].name)
    })
    return [devs, names]
  },
  getdata: function (device) {
    return {
      type: devices[device].type,
      id: devices[device].id,
      haredware: devices[device].haredware,
      cycle: {
        ison: devices[device].cycle.ison,
        colors: devices[device].cycle.colors,
        effect: devices[device].cycle.effect,
        speed: devices[device].cycle.speed
      },
      brightness: devices[device].brightness,
      oncolor: devices[device].oncolor,
      savedcolors: devices[device].savedcolors,
      color: devices[device]._color,
      color_prev: devices[device].old_color,
      status: devices[device].status,
      name: devices[device].name
    }
  },
  setcolor: function (device, color) {
    // devices[device].color = color
    devices[device].usersetcolor(color)
    return {
      id: devices[device].id,
      color: devices[device]._color,
      color_prev: devices[device].old_color,
      status: devices[device].status
    }
  },
  previewcolor: function (device, rgb) {
    devices[device].previewcolor(rgb)
  },
  togle: function (device, state) {
    devices[device].toggle(state)
    return {
      id: devices[device].id,
      color: devices[device]._color,
      color_prev: devices[device].old_color,
      status: devices[device].status
    }
  },
  setcycle: function (device, { ison, colors, effect, speed }) {
    devices[device].setcycle({ ison: ison, colors: colors, effect: effect, speed: speed })
    return {
      id: devices[device].id,
      cycle: {
        ison: devices[device].cycle.ison,
        colors: devices[device].cycle.colors,
        effect: devices[device].cycle.effect,
        speed: devices[device].cycle.speed
      }
    }
  },
  fadeone: function (device, color) {
    devices[device].fadeone(color)
    return {
      id: devices[device].id,
      color: devices[device]._color,
      color_prev: devices[device].old_color,
      status: devices[device].status
    }
  },
  setoldcolor: function (device) {
    devices[device].setoldcolor()
    return {
      id: devices[device].id,
      color: devices[device]._color,
      color_prev: devices[device].old_color,
      status: devices[device].status
    }
  },
  setoncolor: function (device) {
    devices[device].setoncolor()
    return {
      id: devices[device].id,
      color: devices[device]._color,
      color_prev: devices[device].old_color,
      status: devices[device].status
    }
  },
  devicesetings: function (device, {name, oncolor}) {
    devices[device].name = name
    devices[device].oncolor = oncolor
    return {
      id: devices[device].id,
      name: devices[device].name,
      oncolor: devices[device].oncolor
    }
  }
}
