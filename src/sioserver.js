'use strict'
const log = require('./logger.js');
log.info('Starting RPiLC Socket Server ...');
const fs = require("fs");
// load config file
const configfile = fs.readFileSync("config.json");
const config = JSON.parse(configfile);
log.debug('Server Config Loaded.');
// Webserver and socketio
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
// web server start
server.listen(config.webserverport);
app.use(express.static(config.webdir));

module.exports = function (action, data) {
  log.debug("action_name: "+action);
  log.data(data);
io.sockets.emit(action, data);
};

const action = require('./actions.js');

/*
socketio
list of possible emitted events:
data - send all data for new clients
CycleSync - send color circle status and color list
updatecolor - send ColorVals
*/

io.sockets.on('connection', function(socket) {
  action.connection();
  socket.on('change', action.change);
  // Write color value received from client to gpio & update
  socket.on('done', action.done);
  // get cycle info from client
  socket.on('cycle', action.cycle);
  socket.on('togglestate', action.togglestate);
});

log.info('Server Ready.');
