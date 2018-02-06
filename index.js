const winowatch = require("./winowatch.js");
winowatch.info('Starting RPiLC ...');
let fs = require("fs");
let csstate;
let thehex;
//-------load config---------
let configfile = fs.readFileSync("config.json");
// Define to JSON type
let config = JSON.parse(configfile);
winowatch.info('Config Loaded.');
//--------load config end-----
//--- gpio pwm seting input start ---
const Gpio = require('pigpio').Gpio,
  //colors pins
  red = new Gpio(config.redgpio, {
    mode: Gpio.OUTPUT
  }),
  green = new Gpio(config.greengpio, {
    mode: Gpio.OUTPUT
  }),
  blue = new Gpio(config.bluegpio, {
    mode: Gpio.OUTPUT
  });

// function to write RGB value.
function gpiowrite(r, g, b) {
  red.pwmWrite(r);
  green.pwmWrite(g);
  blue.pwmWrite(b);
};

//webserver and socketio
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
// --- web server start ---
server.listen(config.webserverport);
app.use(express.static(config.webdir));
// --- web server end ---


//socketio
io.sockets.on('connection', function(socket) {
  winowatch.info("Client Connected.");
  if (csstate == null) {
  } else {
    syncemit();
  }


  if (thehex != null) {

  io.sockets.emit('csync', {
    hex: thehex
  });
};

  socket.on('color', function(vrgb) {
    gpiowrite(vrgb.red, vrgb.green, vrgb.blue);
  });

  socket.on('fadeoc', function(a) {
    fade(a.colortf);
    io.sockets.emit('csync', {
      hex: a.colortf
    });
  });

  socket.on('fade', function(cs) {
    winowatch.info("Got a list of colors to fade: " + cs.hexf +". the state of the button is now "+ cs.state);
    csstate = cs.state;
    cshexf = cs.hexf;
    syncemit = function() {
      winowatch.info("sent fade info to other clients.");
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


      }, 5000);



    };

    if (csstate == true) {
      faders();
    }

  });


  // ---- note hex to update clients start ----
  socket.on('hex', function(hexs) {
    thehex = hexs.hex;
    /*write to file
    fs.writeFile(config.webdir + "/js/ccode.js", "let nowcolor =" + '"' + thehex + '"', function(err) {
      if (err) {
        return console.log(err);
      };
      //    console.log("The file was saved!");
    });
    *///write to file done
    socket.emit('hex', {
      hex: thehex
    });
    io.sockets.emit('hex', {
      hex: thehex
    });
    winowatch.info('Sent new color to Clients: ' + thehex);
    io.emit('hex', {
      hex: thehex
    });
    // ---- note hex to update clients end ----
  });
});


let convertHex = function(hex) {
  hex = hex.replace('#', '');
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);

  result = [r, g, b];
  return result;
};


let fade = function(endColour) {
  winowatch.info("Fading #" + thehex + ' and ' + endColour + "...");
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
        console.log(rgbs);
        let hexfa = color.toHex();
        gpiowrite(rgbs.r, rgbs.g, rgbs.b);

        //if (i == steps.length) {
        //console.log('it is! ' + hexfa);

        //};
        thehex = hexfa

      }, 50 * i);
    })(i);


  };
  return;
};



winowatch.info('ready.');
