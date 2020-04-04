'use strict'
const fs = require('fs')
const configfile = fs.readFileSync('config.json')
const config = JSON.parse(configfile)
let devices = {}

if (config.server_settings.gpio) {
  const pigpio = require('./pigpio.js')
  devices = pigpio
}
module.exports = {
  listdevices: function () {
    const devs = Object.keys(devices)
    return devs
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
      status: devices[device].status
    }
  },
  setcolor: function (device, color) {
    devices[device].color = color
    return {
      id: devices[device].id,
      color: devices[device]._color,
      color_prev: devices[device].old_color,
      status: devices[device].status
    }
  },
  previewcolor: function (device, rgb) {
    devices[device].setcolor(rgb.r, rgb.g, rgb.b)
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
  }
}
