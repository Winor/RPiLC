/* eslint-disable no-new-func */
'use strict'
const logger = require('./logger.js')
logger.debug('Config File Loaded.')
const Gpio = require('pigpio').Gpio

module.exports = function (int) {
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
