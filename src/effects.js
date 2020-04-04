'use strict'
let data = require("./data.js");
const logger = require('./logger.js');
const logic = require('./logic.js');
const tinycolor = require("tinycolor2");
const tinygradient = require("tinygradient");
var stimer;


  // CycleMode switch
  module.exports.CycleModeSwitch = function(mode) {
    switch (mode) {
      case "fade":
        clearInterval(stimer)
        fadeTimer(data.CycleMode.colors);
        break;
      case "flash":
      clearInterval(stimer)
      flash(data.CycleMode.colors);
        break;
      case "smooth":
        clearInterval(stimer)
        smooth(data.CycleMode.colors);
        break;
      default:
    }
  }

//add CurrentHEX to the begining of color list and last color to the end of the list
function afctel(colors) {
  let clist = colors.slice();
  clist.unshift(data.ColorVals.CurrentHEX);
  clist.push(colors[0]);
  logger.data(clist);
  return clist
}

// get color gradient array
function getGradient(colors) {
  let gradient = tinygradient(colors);
  const steps = gradient.rgb(110);
  let Grad = [];

  for (var i = 0; i < steps.length; i++) {
    let color = tinycolor(steps[i]);
    Grad.push(color.toRgb());
  }

  return Grad;
}

// Get a list of color steps for fade
function GetFade(colors) {
  logger.debug("Generating Colors to fade");
  let clist = afctel(colors);
  let fadeList = {};

  for (var i = 0; i < clist.length - 1; i++) {
    logger.debug(clist[i], clist[i + 1]);
    fadeList[i] = getGradient([clist[i], clist[i + 1]]);
  }
  return fadeList;
}

// Fade Timer
function fadeTimer(colors) {
  let i = 0;
  let steps = GetFade(colors);
  stimer = setInterval(function() {

    if (data.CycleMode.state == false) {
      clearInterval(stimer)
      return;
    }

    playFade(steps[i]);

    i++;

    if (i == Object.keys(steps).length) {
      logger.debug('finished a circle!!');
      i = 1;
    }
  }, data.CycleMode.speed);

}

// Fade player
function playFade(colors) {
  for (let i = 0; i < colors.length; i++) {
    (function(i) {
      setTimeout(function() {
        logic.setcolor(colors[i]);
      }, 10 * i);
    })(i);
  };

}

// Get a list of colors to smooth
function GetSmooth(colors) {
  logger.debug("Generating Colors to smooth");
  let clist = colors.slice();
  clist.push(colors[0]);
  logger.data(clist);
  let smooth = getGradient(clist);
  logger.data(smooth)
  return smooth
}

//
function smooth(colors) {
  let i = 0;
  let steps = GetSmooth(colors);
  stimer = setInterval(function() {

    if (data.CycleMode.state == false) {
      clearInterval(stimer)
      return;
    }

    logic.setcolor(steps[i]);

    i++;

    if (i == steps.length) {
      logger.debug('finished a circle!!');
      i = 0;
    }
  }, data.CycleMode.speed / 50);
}

function flash(colors) {
  let i = 0;
  stimer = setInterval(function() {

    if (data.CycleMode.state == false) {
      clearInterval(stimer)
      return;
    }

    logic.setcolor(colors[i]);

    i++;

    if (i == colors.length) {
      logger.debug('finished a circle!!');
      i = 0;
    }
  }, data.CycleMode.speed / 2);
}

//GetFade(['#be0000', '#beb500', '#21be00', '#0051be']);
