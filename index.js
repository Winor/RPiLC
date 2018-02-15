const winowatch = require("./winowatch.js");
winowatch.info('Starting RPiLC ...');
const fs = require("fs");

// For knowing when null
let csstate;
let thehex;

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

// web server start
server.listen(config.webserverport);
app.use(express.static(config.webdir));

/*
socketio
list of possible emitted events:
csync - send a color code without emiting update event
fsync - send the slected color cricle status and color list
hex - send a color code and emit update event
*/
io.sockets.on('connection', function(socket) {
  winowatch.debug("Client Connected.");

// if not null, send color and cricle state to new clients
  if (csstate != null) {
    syncemit();
  }

  if (thehex != null) {

  io.sockets.emit('csync', {
    hex: thehex
  });
};

// write color received from client to gpio
  socket.on('color', function(vrgb) {
    gpiowrite(vrgb.red, vrgb.green, vrgb.blue);
  });

// fade to a color
  socket.on('fadeoc', function(a) {
    fade(a.colortf);
    io.sockets.emit('csync', {
      hex: a.colortf
    });
  });

// color get cricle info and timer
  socket.on('fade', function(cs) {
    winowatch.debug("Got a list of colors to fade: " + cs.hexf +". the state of the button is now "+ cs.state);
    csstate = cs.state;
    cshexf = cs.hexf;
    syncemit = function() {
      winowatch.debug("sent fade info to other clients.");
      io.sockets.emit('fsync', {
        thests: csstate,
        cctf: cshexf
      });
    }
    syncemit();
    faders = function() {

      if (csstate == false) {
        return;
      }

      xi = 0;
      let timer = setInterval(function() {

        if (csstate == false) {
          clearInterval(timer)
          return;
        }

        fade(cshexf[xi]);
        io.sockets.emit('csync', {
          hex: cshexf[xi]
        });
        xi++;

        if (xi == 4) {
          xi = 0;
          console.log('it is!');
        }
      }, 8000);
    };

    if (csstate == true) {
      faders();
    }
  });

  // update hex to clients
  socket.on('hex', function(hexs) {
    thehex = hexs.hex;
    io.sockets.emit('hex', {
      hex: thehex
    });
    winowatch.debug('Sent new color to Clients: ' + thehex);
  });
});

// fade logic
let fade = function(endColour) {
  winowatch.debug("Fading #" + thehex + ' and ' + endColour + "...");
  const tinygradient = require("tinygradient");
  const tinycolor = require("tinycolor2");

  let gradient = tinygradient([
    thehex,
    endColour
  ]);

  const steps = gradient.rgb(9);
  for (i = 0; i < steps.length; i++) {
    (function(i) {
      setTimeout(function() {

        let steps = gradient.rgb(9);
        let color = tinycolor(steps[i]);
        let rgbs = color.toRgb();
        winowatch.debug(JSON.stringify(rgbs));
        let hexfa = color.toHex();
        gpiowrite(rgbs.r, rgbs.g, rgbs.b);
        thehex = hexfa
      }, 50 * i);
    })(i);
  };
};

winowatch.info('ready.');
