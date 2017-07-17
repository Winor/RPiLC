//var app = require('http').createServer(handler);
//var io = require('socket.io').listen(app);
//var fs = require('fs');
//var sock;

//app.listen(8001, function(){
// console.log('listening on *.8001');
//});

//colors pins
"use strict";

var Gpio = require('onoff').Gpio,
   red = new Gpio(17, 'out'),
   green = new Gpio(22, 'out'),
   blue = new Gpio(24, 'out');
 //test blue led
 blue.writeSync(0);
 red.writeSync(0);
 green.writeSync(0);
