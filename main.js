console.log('I am working...');
//use pigpio
var Gpio = require('pigpio').Gpio,
//colors pins
red = new Gpio(17, {mode: Gpio.OUTPUT}),
green = new Gpio(22, {mode: Gpio.OUTPUT}),
blue = new Gpio(24, {mode: Gpio.OUTPUT});
//start http server
var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);	//web socket server
 //webserver port
server.listen(80);
//folder contains the static webpages
app.use(express.static('web'));
//use fs to write current color code to file
var fs = require('fs');
//static zero ****
var redv = 0;
var greenv = 0;
var bluev = 0;
console.log('Ready.');
//WebSocket behavior
io.sockets.on('connection', function (socket) {
//react to 'x' packets
socket.on('color', function (vrgb) {
//updates from the data object socket
redv = vrgb.red;
greenv = vrgb.green;
bluev = vrgb.blue;
//logs to console
console.log('R:' + redv + 'G:' + greenv + 'B:' + bluev );
//writers to pin
red.pwmWrite(redv);
green.pwmWrite(greenv);
blue.pwmWrite(bluev);


//sends the updated brightness

});



//send current color state

////socket.emit('color', {value: greenv}),
////socket.emit('color', {value: bluev});
});
io.sockets.on('connection', function (socket) {
socket.on('hex', function (hexs) {
var thehex = hexs.hex;
//write to file
fs.writeFile("web/js/ccode.js", "var nowcolor ="+ '"' + thehex + '"', function(err) {
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
