'use strict'
const tinycolor = require('tinycolor2')
const tinygradient = require('tinygradient')
const logger = require('./logger.js')

// gets color object
function getcolor (c) {
  const color = tinycolor(c)
  if (!color.isValid()) {
    logger.warn('invalid color.')
    return
  }
  return {
    rgb: color.toRgb(),
    hex: color.toHex(),
    name: color.toName()
  }
}

class Light {
  constructor (type, id, haredware, io, color = 'black', oncolor = 'white') {
    this.type = type
    this.id = id
    this.haredware = haredware
    this.cycle = {
      ison: false,
      colors: ['#be0000', '#beb500', '#21be00', '#0051be'],
      speed: 8000,
      effect: 'fade'
    }
    this.brightness = 100
    this.color = color
    this.oncolor = oncolor
    this.savedcolors = []
  }

  get color () {
    return 'this._color'
  }

  set color (c) {
    if (this._color !== null && this.status !== 'cycle') {
      this.old_color = this._color
    }
    const color = getcolor(c)
    if (color == null) {
      return
    }
    this._color = color
    this.getstatus()
    const brig = this.getbrightness(color.rgb.r, color.rgb.g, color.rgb.b)
    this.setcolor(brig[0], brig[1], brig[2])
  }

  getbrightness (r, g, b) {
    const rp = Math.ceil((r / 100) * this.brightness)
    const gp = Math.ceil((g / 100) * this.brightness)
    const bp = Math.ceil((b / 100) * this.brightness)
    return [rp, gp, bp]
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

  setcycle (ison, colors, effect) {
    this.cycle.ison = ison
    this.getstatus()

    if (colors !== undefined) {
      this.cycle.colors = colors
    }

    if (effect !== undefined) {
      this.cycle.effect = effect
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
  getGradient (colors) {
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
      fadeList[i] = this.getGradient([clist[i], clist[i + 1]])
    }
    return fadeList
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
        logger.debug('finished a circle!!')
        i = 1
      }
    }, this.cycle.speed)
  }

  playFade (colors) {
    for (let i = 0; i < colors.length; i++) {
      (i => {
        setTimeout(() => {
          this.color = colors[i]
        }, 10 * i)
      })(i)
    }
  }

  setcolor (r, g, b) {
    this.io.set(r, g, b)
  }

  savecolor (color) {
    if (this.status === 'on') {
      return
    }
    this.savedcolors = this.savedcolors.filter(c => c !== color)
    this.savedcolors.unshift(color)
    this.savedcolors.splice(19, 1)
  }

  toggle (state) {
    switch (state) {
      case 'on':
        if (this.status === 'cycle') {
          return
        }
        this.color = this.oncolor
        break

      case 'off':
        this.color = 'black'
        break

      default:
        if (this.status === 'off') {
          this.color = this.oncolor
          return
        }

        if (this.status === 'cycle') {
          this.setcycle(false)
        }
        this.color = 'black'

        break
    }
  }
}

//  devices["local-1"].setcycle(true)
//  devices["local-0"].brightness = 20
//   devices["local-0"].setcycle(true,["green","yellow","blue","purple"])

// console.log(devices)
// devices["local-0"].color = "white"
//  devices["local-1"].color = "red"

//  devices["local-0"].io.set(0,255,0)
//  devices["local-1"].setcolor(0,255,0)
// for (let i = 0; i < 255; i++) {
//   devices["local-0"].color = "rgb 255 0 "+ i
module.exports = Light
