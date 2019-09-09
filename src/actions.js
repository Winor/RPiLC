'use strict'
let data = require("./data.js");
const sioserver = require('./sioserver.js');
const logger = require('./logger.js');
const gpio = require('./gpio.js');
const logic = require('./logic.js');
const effect = require('./effects.js');

module.exports = {
  connection: function() {
    logger.debug("New client Connected.");
    sioserver('data', data);
    logger.debug("Sent data to new client.");
  },
  change: function(c) {
    logic.turnoffcycle();
    gpio(c.r, c.g, c.b);
  },
  done: function(val) {
    logic.turnoffcycle();
    logic.setcolor(val);
  },
  cycle: function(cycle) {
    logger.debug("Got a list of colors to "+ cycle.effect + ": " + cycle.colors + ". Speed: " + cycle.speed + ". the state is now " + cycle.state);
    data.CycleMode = cycle;
    sioserver('CycleSync', data.CycleMode);
    effect.CycleModeSwitch(cycle.effect);
  },
  togglestate: function() {
    if (data.CycleMode.state) {
      data.CycleMode.state = false;
      logger.debug("CycleMode state is now " + data.CycleMode.state);
      sioserver('CycleSync', data.CycleMode);
    }
    logic.chgstate();
  },
  togglecycle: function () {
    data.CycleMode.state = !data.CycleMode.state;
    logger.debug("CycleMode state is now " + data.CycleMode.state);
    sioserver('CycleSync', data.CycleMode);
  }

}
