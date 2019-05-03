'use strict'
// require
const logger = require('./logger.js');
const gpio = require('./gpio.js');
const sioserver = require('./sioserver.js');
let data = require("./data.js");
const fs = require("fs");
const tinycolor = require("tinycolor2");

// CODE
module.exports = {
cval: function (c) {
  let color = tinycolor(c);
  if (color.isValid()) {
    return {
      rgb: color.toRgb(),
      hex: color.toHex(),
      name: color.toName()
    }
  } else {
    logger.warn("invalid color.");
    return "error";
  }
},

  setcolor: function (c) {
    if (this.cval(c) == "error") {
      logger.warn("Cannot set this color.");
      return "error";
    } else {
      let color = this.cval(c);
      data.ColorVals.CurrentHEX = color.hex;
      data.ColorVals.CurrentRGB = color.rgb;
      data.ColorVals.CurrentCName = color.name;
      if (data.ColorVals.CurrentCName == "black") {
        data.state = "off";
      } else {
        data.state = "on";
      }
      sioserver('updatecolor', data.ColorVals);
      logger.debug("Updated ColorVals to all clients.");
      gpio(color.rgb.r, color.rgb.g, color.rgb.b);
    }
  },


   chgstate: function() {
    if (data.state == "on") {
      this.setcolor("black");
    } else {
      this.setcolor("white");
    }
  }
}
