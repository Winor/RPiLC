'use strict'
const logger = require('./logger.js');
logger.debug('Config File Loaded.');
const gpio = require('pigpio').Gpio;

module.exports = function(int) {
      let led =  String(Object.keys(int));
      let pin = {}
      let cmd = ""
      Object.keys(int[led]).forEach(function (item) {
        pin[item] = new gpio(int[led][item], {mode: gpio.OUTPUT})
        pin[item].digitalWrite(0)
        cmd += "this.io."+item+".pwmWrite("+item+");"
      }); 
      this.type = led;
      this.io = pin
      this.set = new Function (String(Object.keys(int[led])) ,cmd)
  }


