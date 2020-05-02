/* eslint-disable no-new-func */
'use strict'
const logger = require('./logger.js')
const Gpio = require('pigpio').Gpio
const Device = require('./devices.js').Light
// load config file
const fs = require('fs')
const configfile = fs.readFileSync('config.json')
const config = JSON.parse(configfile)

const devices = {}

// creates an object that intracts with the RGB LED Strip
function Pio (int) {
  const led = String(Object.keys(int))
  const pin = {}
  let cmd = ''
  Object.keys(int[led]).forEach(function (item) {
    pin[item] = new Gpio(int[led][item], { mode: Gpio.OUTPUT })
    pin[item].digitalWrite(0)
    cmd += 'this.io.' + item + '.pwmWrite(' + item + ');'
  })
  this.type = led
  this.io = pin
  this.set = new Function(String(Object.keys(int[led])), cmd)
}

class Rpi extends Device {
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
// creates light device from config file
function createpinsfromconfig () {
  let i = 0
  config.gpio.forEach(int => {
    devices['local-' + i] = new Rpi(
      String(Object.keys(int)),
      'local-' + i,
      'RPi',
      new Pio(int),
      'black',
      'white'
    )
    i++
  })
}

createpinsfromconfig()
module.exports = devices

// devices['local-1'].setcycle(true)
// devices['local-0'].brightness = 20
// devices['local-0'].setcycle(true, ['green', 'yellow', 'blue', 'purple'])

// console.log(devices)
// devices["local-0"].color = "white"
//  devices["local-1"].color = "red"

//  devices["local-0"].io.set(0,255,0)
//  devices["local-1"].setcolor(0,255,0)
// for (let i = 0; i < 255; i++) {
//   devices["local-0"].color = "rgb 255 0 "+ i
