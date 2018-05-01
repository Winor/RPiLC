const winowatch = require("./winowatch.js");
winowatch.info('Starting RPiLC ...');
const fs = require("fs");

// load config file
let configfile = fs.readFileSync("config.json");
let config = JSON.parse(configfile);
winowatch.debug('Config Loaded.');

// require pigpio and set PWM gpio numbers
const Gpio = require('pigpio').Gpio,
  red = new Gpio(config.redgpio, {
    mode: Gpio.OUTPUT
  }),
  green = new Gpio(config.greengpio, {
    mode: Gpio.OUTPUT
  }),
  blue = new Gpio(config.bluegpio, {
    mode: Gpio.OUTPUT
  });

// function to write PWM value
function gpiowrite(r, g, b) {
  red.pwmWrite(r);
  green.pwmWrite(g);
  blue.pwmWrite(b);
};

// Webserver and socketio
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const tinycolor = require("tinycolor2");

// web server start
server.listen(config.webserverport);
app.use(express.static(config.webdir));

let data = {
  Version: "0.1.5",
  type: 'desktop',
  description: "My Workstation",
  ColorVals: {
    CurrentHEX: '000000',
    CurrentRGB: {
      r: 0,
      g: 0,
      b: 0
    },
    CurrentCName: 'black'
  },
  CycleMode: {
    state: false, // true / false
    colors: ['#be0000', '#beb500', '#21be00', '#0051be'],
    speed: 8000
  },
  RainbowMode: {
    state: false, // true / false
    speed: 6000
  },
  FlashMode: {
    state: false, // true / false
    colors: ['000000', '000000'],
    speed: 1000
  }
}

function cval(c) {
  let color = tinycolor(c);
  if (color.isValid()) {
    return {
      rgb: color.toRgb(),
      hex: color.toHex(),
      name: color.toName()
    }
  } else {
    winowatch.warn("invalid color.");
    return "error";
  }
}

  function setcolor(c) {
    if (cval(c) == "error") {
      winowatch.warn("Cannot set this color.");
      return "error";
    } else {
      let color = cval(c);
      data.ColorVals.CurrentHEX = color.hex;
      data.ColorVals.CurrentRGB = color.rgb;
      data.ColorVals.CurrentCName = color.name;
      io.sockets.emit('updatecolor', data.ColorVals);
      winowatch.debug("Updated ColorVals to all clients.");
      gpiowrite(color.rgb.r, color.rgb.g, color.rgb.b);
    }
  }

  /*
  socketio
  list of possible emitted events:
  data - send all data for new clients
  CycleSync - send color circle status and color list
  updatecolor - send ColorVals
  */
  io.sockets.on('connection', function(socket) {
        winowatch.debug("New client Connected.");
        io.sockets.emit('data', data);
        winowatch.debug("Sent data to new client.");
        // Write color preview value received from client to gpio
        socket.on('change', function(c) {
          gpiowrite(c.r, c.g, c.b);
        });
        // Write color value received from client to gpio & update
        socket.on('done', function(val) {
          setcolor(val);
        });
        // get cycle info from client
        socket.on('cycle', function(cycle) {
            winowatch.debug("Got a list of colors to cycle: " + cycle.colors + ". Speed: " + cycle.speed + ". the state is now " + cycle.state);
            data.CycleMode.state = cycle.state;
            data.CycleMode.colors = cycle.colors;
            data.CycleMode.speed = cycle.speed;
            io.sockets.emit('CycleSync', data.CycleMode);
            CycleModeTimer();
        });
        });
      // fade logic
      function fade(endColour) {
        winowatch.debug("Fading " + data.ColorVals.CurrentHEX + ' and ' + endColour + "...");
        const tinygradient = require("tinygradient");

        let gradient = tinygradient([
          data.ColorVals.CurrentHEX,
          endColour
        ]);

        const steps = gradient.rgb(9);
        for (i = 0; i < steps.length; i++) {
          (function(i) {
            setTimeout(function() {
              const steps = gradient.rgb(9);
              let color = tinycolor(steps[i]);
              let rgbs = color.toRgb();
              winowatch.debug(JSON.stringify(rgbs));
              setcolor(rgbs);
            }, 50 * i);
          })(i);
        };
      }
      // Cycle timer
      function CycleModeTimer() {
        if (data.CycleMode.state) {
          xi = 0;
          let timer = setInterval(function() {

            if (data.CycleMode.state == false) {
              clearInterval(timer)
              return;
            }

            fade(data.CycleMode.colors[xi]);
            xi++;

            if (xi == data.CycleMode.colors.length) {
              xi = 0;
              winowatch.debug('finished a circle!!');
            }
          }, data.CycleMode.speed);
        }
      }
      winowatch.info('ready.');
