'use strict'
const logger = require('./logger.js');
// load config file
const fs = require("fs");
const configfile = fs.readFileSync("config.json");
const config = JSON.parse(configfile);
logger.debug('Config File Loaded.');
// require pigpio and set PWM gpio numbers
const Gpio = require('pigpio').Gpio,
  red = new Gpio(config.gpio_pin.red, {
    mode: Gpio.OUTPUT
  }),
  green = new Gpio(config.gpio_pin.red, {
    mode: Gpio.OUTPUT
  }),
  blue = new Gpio(config.gpio_pin.red, {
    mode: Gpio.OUTPUT
  });
// set value to zero
  red.digitalWrite(0);
  green.digitalWrite(0);
  blue.digitalWrite(0);

// function to write PWM value
module.exports = function (r, g, b) {
  red.pwmWrite(r);
  green.pwmWrite(g);
  blue.pwmWrite(b);
};
