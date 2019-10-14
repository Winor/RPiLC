'use strict'
// require
const logger = require('./logger.js');
const gpio = require('./gpio.js');
const sioserver = require('./sioserver.js');
let data = require("./data.js");
const fs = require("fs");
const configfile = fs.readFileSync("config.json");
const config = JSON.parse(configfile);
const tinycolor = require("tinycolor2");
const writer = require('./writer.js')
var SaveTimer;
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
    clearTimeout(SaveTimer);
    SaveTimer =  setTimeout(() => SaveColor(data.ColorVals.CurrentHEX), 7000);
  },
  UserConfig: function (config) {
    writer.ConfigConstract(config);
    writer.ConfigApply();
    this.restart();
  },
  restart: function () {
    let obj = {
      type: 'restart',
      message: 'Restarting Server...',
      status: 'danger',
      pos: 'top-center',
      time: 6000
    }
    sioserver('clientevent', obj);
    logger.info("Restarting Server...");
    process.exit();
  }
}

function SaveColor() {
  logger.debug('is not off: '  + (data.state !== "off"));
  logger.debug("is not in CycleMode: " + (data.CycleMode.state != true));
  logger.debug("is not in SavedColors list: " + (data.SavedColors.includes("#" + data.ColorVals.CurrentHEX) == false));
  logger.debug("is not on_color: " + (config.RPiLC_settings.on_color != "#" + data.ColorVals.CurrentHEX));
  if (data.SavedColors.includes("#" + data.ColorVals.CurrentHEX)) {
    data.SavedColors = data.SavedColors.filter(e => e !== "#" + data.ColorVals.CurrentHEX);
    data.SavedColors.unshift( "#" + data.ColorVals.CurrentHEX);
    sioserver('SaveColor', data.SavedColors);

    } else if ((data.state !== "off") && (data.CycleMode.state != true) && (config.RPiLC_settings.on_color != "#" + data.ColorVals.CurrentHEX)) {
      data.SavedColors.unshift( "#" + data.ColorVals.CurrentHEX);
      if (data.SavedColors.length == 19) {
        data.SavedColors.splice(-1,1)
        logger.debug("removed latest color from SavedColors");
    }
    sioserver('SaveColor', data.SavedColors);
  }
}