'use strict'
const tinycolor = require('tinycolor2')
const tinygradient = require('tinygradient')
const logger = require('./logger.js')
const EventEmitter = require('events')
class ServerEvents extends EventEmitter {}
const serverevents = new ServerEvents()

// gets color object
function getcolor (c) {
  const color = tinycolor(c)
  if (!color.isValid()) {
    logger.warn('invalid color: '+ c)
    return
  }
  return {
    rgb: color.toRgb(),
    hex: color.toHex(),
    hsv: color.toHsv(),
    name: color.toName()
  }
}

class Light {
  constructor (type, id, hardware, io, color = 'black', oncolor = 'white') {
    this.type = type
    this.id = id
    this.name = this.id
    this.group = '0'
    this.hardware = hardware
    this.io = io
    this.cycle = {
      ison: false,
      colors: ['#be0000', '#beb500', '#21be00', '#0051be'],
      speed: 8000,
      effect: 'fade'
    }
    this.brightness = 100
    this.oncolor = oncolor
    this.savedcolors = []
    this.color = color
  }

  get color () {
    return this._color
  }

  set color (c) {
    const color = getcolor(c)
    if (color == null) {
      return
    }
    this._color = color
    this.brightness = this._color.hsv.v * 100
    this.getstatus()
    this.setcolor(color.rgb.r, color.rgb.g, color.rgb.b)
    clearTimeout(this.savetimer)
    this.savecolor('#' + color.hex)
    serverevents.emit('updatecolor', this.id)
  }

  get id () {
    return this._id
  }

  set id (id) {
    this._id = id.replace(/[^a-zA-Z0-9- ]/g, '')
  }

  usersetcolor (c) {
    if ((this._color !== null) && (this.status !== 'cycle')) {
      this.old_color = this._color
    }
    if (this.status === 'cycle') {
      this.setcycle({ ison: false })
    }
    this.color = c
  }

  previewcolor (c) {
    if (this.status === 'cycle') {
      this.setcycle({ ison: false })
    }
    const color = getcolor(c)
    this.setcolor(color.rgb.r, color.rgb.g, color.rgb.b)
  }

  getbrightness (brightness) {
    const hsv = this.color.hsv
    hsv.v = brightness / 100
    return hsv
  }

  setbrightness (brightness) {
    this.fadeone(this.getbrightness(brightness))
  }

  getstatus () {
    if (this.cycle.ison) {
      this.status = 'cycle'
      return this.status
    }
    if (this._color.name === 'black') {
      this.status = 'off'
      return this.status
    }
    this.status = 'on'
    return this.status
  }

  setoldcolor () {
    this.fadeone(this.old_color.hex)
  }

  setoncolor () {
    this.color = this.oncolor
  }

  setcycle ({ ison, colors, effect, speed }) {
    this.cycle.ison = ison
    this.getstatus()

    if (colors !== undefined) {
      this.cycle.colors = colors
    }

    if (effect !== undefined) {
      this.cycle.effect = effect
    }

    if (speed !== undefined) {
      this.cycle.speed = speed
    }

    this.cycleswitch(this.cycle.effect)
  }

  cycleswitch (mode) {
    switch (mode) {
      case 'fade':
        clearInterval(this.cycle.timer)
        this.fadeTimer(this.cycle.colors)
        break
      case 'flash':
        // clearInterval(this.cycle.timer)
        // flash(data.CycleMode.colors);
        break
      case 'smooth':
        // clearInterval(this.cycle.timer)
        // smooth(data.CycleMode.colors);
        break
      default:
    }
  }

  // add this color HEX to the begining of color list and last color to the end of the list
  afctel (colors) {
    const clist = colors.slice()
    clist.unshift(this._color.hex)
    clist.push(colors[0])
    logger.data(clist)
    return clist
  }

  // get color gradient array
  getgradient (colors) {
    const gradient = tinygradient(colors)
    const steps = gradient.rgb(110)
    const Grad = []

    for (var i = 0; i < steps.length; i++) {
      const color = tinycolor(steps[i])
      Grad.push(color.toRgb())
    }

    return Grad
  }

  getfade (colors) {
    logger.debug('Generating Colors to fade')
    const clist = this.afctel(colors)
    const fadeList = {}

    for (var i = 0; i < clist.length - 1; i++) {
      logger.debug(clist[i], clist[i + 1])
      fadeList[i] = this.getgradient([clist[i], clist[i + 1]])
    }
    return fadeList
  }

  fadeone (color) {
    if ((this._color !== null) && (this.status !== 'cycle')) {
      this.old_color = this._color
    }
    if (this.status === 'cycle') {
      this.setcycle({ ison: false })
    }
    if (getcolor(color).hex === this._color.hex) {
      return
    }
    const fade = this.getgradient([this._color.hex, color])
    this.fade(fade)
  }

  setcolor (r, g, b) {
    this.io.set(r, g, b)
  }

  savecolor (color) {
    if ((this.status === 'off') || (this.status === 'cycle')) {
      return
    }
    this.savetimer = setTimeout(() => {
      const save = this.savedcolors.filter(c => c !== color)
      save.unshift(color)
      save.splice(19, 1)
      this.savedcolors = save
      serverevents.emit('updatesaved', this.id)
    }, 6000)
  }

  toggle (state) {
    switch (state) {
      case 'on':
        if ((this.status === 'cycle') || (this.status === 'on')) {
          return
        }
        // this.color = this.oncolor
        this.fadeone(this.oncolor)
        break

      case 'off':
        if (this.status === 'cycle') {
          this.setcycle({ ison: false })
          // this.color = 'black'
          this.fadeone('black')
        }
        // this.color = 'black'
        this.fadeone('black')
        break

      default:
        if (this.status === 'off') {
          // this.color = this.oncolor
          this.fadeone(this.oncolor)
          return
        }

        if (this.status === 'cycle') {
          this.setcycle({ ison: false })
        }
        // this.color = 'black'
        this.fadeone('black')

        break
    }
  }
}

module.exports.Light = Light
module.exports.serverevents = serverevents
