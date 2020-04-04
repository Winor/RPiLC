'use strict'
let data = require("./data.js");
const sioserver = require('./sioserver.js');
const logger = require('./logger.js');
const gpio = require('./pigpio.js');
const logic = require('./logic.js');
const effect = require('./effects.js');
const fs = require("fs");
const configfile = fs.readFileSync("config.json");
const config = JSON.parse(configfile);
const updater = require('./updater.js')

module.exports = {
  connection: function() {
    logger.debug("New client Connected.");
    sioserver('data', data);
    sioserver('config', config);
    logger.debug("Sent data to new client.");
  },
  change: function(c) {
    module.exports.togglecycle('off');
    gpio(c.r, c.g, c.b);
  },
  done: function(val) {
    module.exports.togglecycle('off');
    logic.setcolor(val);
  },
  cycle: function(cycle) {
    logger.debug("Got a list of colors to "+ cycle.effect + ": " + cycle.colors + ". Speed: " + cycle.speed + ". the state is now " + cycle.state);
    data.CycleMode = cycle;
    sioserver('CycleSync', data.CycleMode);
    effect.CycleModeSwitch(cycle.effect);
  },
  togglestate: function(state) {
    switch (state) {
      case 'on':
        if (data.state !== 'on') {
          chgstate()
        }
        break;

      case 'off':
        if (data.state != 'off') {
          chgstate()
        }
        break;
    
      default:
          chgstate()
        break;
    }
    
  },
  togglecycle: function (state) {
    switch (state) {
      case 'on':
        if (!data.CycleMode.state) {
          chcycle()
        }
        break;
      case 'off':
          if (data.CycleMode.state) {
            chcycle()
          }
        break;
    
      default:
          chcycle()
        break;
    }
  },
  config: function (config) {
    logic.UserConfig(config)
  },
  CheakForUpdates: async function () {
    let updateinfo = {
      update: 'checking'
    };
    sioserver('updates', updateinfo);
    try {
      updateinfo = await updater.CheckForUpdates()
      sioserver('updates', updateinfo);

    }catch (err) {
      updateinfo.update = 'err'
      sioserver('updates', updateinfo);
    }
    
  },
  update: async function () {
    let updateinfo = {
      update: 'installing'
    };
    sioserver('updates', updateinfo);
    try {
      await updater.update()
      logic.restart();

    }catch(err) {

    } 
  }

}


function chgstate() {
  if (data.state == "on") {
    if (data.CycleMode.state) {
      module.exports.togglecycle('off')
    }
    logic.setcolor("black");
  } else {
    logic.setcolor(config.RPiLC_settings.on_color);
  }
} 

function chcycle() {
  data.CycleMode.state = !data.CycleMode.state;
  logger.debug("CycleMode state is now " + data.CycleMode.state);
  sioserver('CycleSync', data.CycleMode);
  effect.CycleModeSwitch(data.CycleMode.effect);
} 