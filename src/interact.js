'use strict'
const serverevents = require('./devices.js').serverevents
const devices = require('./loader.js')
const logger = require('./logger.js')
const writer = require('./writer.js')
const errormsg = { error: 'Invalid device ID, method or arguments' }

module.exports = {
  events: serverevents,
  listdevices: function () {
    const names = []
    const devs = Object.keys(devices)
    devs.forEach(device => {
      names.push([device, devices[device].name])
    })
    return names
  },
  listdevicesnames: function () {
    const devs = Object.keys(devices)
    const names = []
    devs.forEach(device => {
      names.push(devices[device].name)
    })
    return [devs, names]
  },
  filterdevices: function (key, value) {
    const devs = Object.keys(devices)
    const names = []
    const ids = []
    devs.forEach(device => {
      if (devices[device][key] === value) {
        names.push(devices[device].name)
        ids.push(devices[device].id)
      }
    })
    return [ids, names]
  },
  getdata: function (device) {
    try {
      return {
        type: devices[device].type,
        id: devices[device].id,
        hardware: devices[device].hardware,
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
        name: devices[device].name,
        group: devices[device].group
      }
    } catch (e) {
      return errormsg
    }
  },
  getconfig: function () {
    try {
      return writer.read('./config.json')
    } catch (e) {
      return errormsg
    }
  },
  mqtt: function (device) {
    try {
      return {
        state: devices[device].status.toUpperCase(),
        brightness: devices[device].brightness,
        color: {
          r: devices[device]._color.rgb.r,
          g: devices[device]._color.rgb.g,
          b: devices[device]._color.rgb.b
        }
      }
    } catch (e) {
      return errormsg
    }
  },
  setconfig: function (data) {
    writer.setconfig(data)
    this.restart()
  },
  setcolor: function (device, color) {
    try {
      devices[device].usersetcolor(color)
      return {
        id: devices[device].id,
        color: devices[device]._color,
        color_prev: devices[device].old_color,
        status: devices[device].status
      }
    } catch (e) {
      return errormsg
    }
  },
  setbrightness: function (device, setbrightness) {
    try {
      devices[device].setbrightness(setbrightness)
      return {
        id: devices[device].id,
        color: devices[device]._color,
        color_prev: devices[device].old_color,
        status: devices[device].status
      }
    } catch (e) {
      return errormsg
    }
  },
  groupsetcolor: function (group, color) {
    const devs = this.filterdevices('group', group)
    const data = []
    devs[0].forEach(device => {
      data.push(this.setcolor(device, color))
    })
    return data
  },
  previewcolor: function (device, rgb) {
    try {
      devices[device].previewcolor(rgb)
    } catch (e) {
      return errormsg
    }
  },
  togle: function (device, state) {
    try {
      devices[device].toggle(state)
      return {
        id: devices[device].id,
        color: devices[device]._color,
        color_prev: devices[device].old_color,
        status: devices[device].status
      }
    } catch (e) {
      return errormsg
    }
  },
  setcycle: function (device, { ison, colors, effect, speed }) {
    try {
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
    } catch (e) {
      return errormsg
    }
  },
  fadeone: function (device, color) {
    try {
      devices[device].fadeone(color)
      return {
        id: devices[device].id,
        color: devices[device]._color,
        color_prev: devices[device].old_color,
        status: devices[device].status
      }
    } catch (e) {
      return errormsg
    }
  },
  setoldcolor: function (device) {
    try {
      devices[device].setoldcolor()
      return {
        id: devices[device].id,
        color: devices[device]._color,
        color_prev: devices[device].old_color,
        status: devices[device].status
      }
    } catch (e) {
      return errormsg
    }
  },
  setoncolor: function (device) {
    try {
      devices[device].setoncolor()
      return {
        id: devices[device].id,
        color: devices[device]._color,
        color_prev: devices[device].old_color,
        status: devices[device].status
      }
    } catch (e) {
      return errormsg
    }
  },
  devicesetings: function (device, { name, oncolor, group }) {
    try {
      devices[device].name = name
      devices[device].oncolor = oncolor
      devices[device].group = group
      return {
        id: devices[device].id,
        name: devices[device].name,
        oncolor: devices[device].oncolor,
        group: devices[device].group
      }
    } catch (e) {
      return errormsg
    }
  },
  savedata: function (device) {
    try {
      return {
        name: devices[device].name,
        oncolor: devices[device].oncolor,
        group: devices[device].group,
        savedcolors: devices[device].savedcolors
      }
    } catch (e) {
      return errormsg
    }
  },
  restart: function () {
    logger.info('RPiLC is Restarting...')
    process.exit()
  }
}

// writer.read('./storage.json')
// for (const [key, value] of Object.entries(object1)) {
//   console.log(`${key}: ${value}`)
// }
