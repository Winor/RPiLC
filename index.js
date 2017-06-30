console.log('Starting Node-RGB.....');
//require what i need
var fs = require("fs");
//-------load config---------
var configfile = fs.readFileSync("config.json");
// Define to JSON type
var config = JSON.parse(configfile);
console.log('Config Loaded.');
//--------load config end-----

//--- gpio pwm seting input start ---
var Gpio = require('pigpio').Gpio,
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
}

// --- gpio pwm seting input end ---
var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);
// --- web server start ---
server.listen(config.webserverport);
app.use(express.static(config.webdir));
// --- web server end ---
// web socket
io.sockets.on('connection', function(socket) {
  console.log("Client Connected.");
  socket.on('color', function(vrgb) {
    gpiowrite(vrgb.red, vrgb.green, vrgb.blue);
  });
});


// ---- note hex to update clients start ----
io.sockets.on('connection', function (socket) {
socket.on('hex', function (hexs) {
var thehex = hexs.hex;
//write to file
fs.writeFile(config.webdir + "/js/ccode.js", "var nowcolor ="+ '"' + thehex + '"', function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
//dode writeing
socket.emit('hex', {hex: thehex});
io.sockets.emit('hex', {hex: thehex});
console.log('new!' + thehex);
io.emit('hex', {hex: thehex});
});
});
// ---- note hex to update clients end ----

console.log('done');
