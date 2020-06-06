'use strict'
const fs = require('fs')
const packagefile = fs.readFileSync('package.json')
const packagejson = JSON.parse(packagefile)
const semver = require('semver')

function Configdata ({ gpiopins = [], mode = 'server', webserverport = '80', debug = false, gpio = false, thinsiodevices = false, mqtt = false, serverurl = 'localhost', autogen = true }) {
  this.gpio = gpiopins
  this.server_settings = {
    mode: mode,
    webserverport: webserverport,
    webdir: 'client',
    debug: debug,
    gpio: gpio,
    thinsiodevices: thinsiodevices,
    mqtt: mqtt
  }
  this.remote_settings = {
    serverurl: serverurl
  }
  this.AutoGen = autogen
  this.Version = packagejson.version
}

module.exports = {
  write: function (file, data) {
    const json = JSON.stringify(data, null, 2)
    fs.writeFileSync(file, json)
  },
  read: function (file) {
    const fsfile = fs.readFileSync(file)
    return JSON.parse(fsfile)
  },
  edit: function (file, key, data) {
    if (!fs.existsSync(file)) {
      const ep = {}
      ep[key] = data
      this.write(file, ep)
      return
    }
    const edit = this.read(file)
    edit[key] = data
    this.write(file, edit)
    return edit
  },
  genconfig: function () {
    this.write('./config.json', new Configdata({}))
  },
  setconfig: function (data) {
    this.write('./config.json', new Configdata(data))
  },
  configver: function () {
    if (!fs.existsSync('./config.json')) {
      return
    }
    if (semver.diff(this.read('./config.json').Version, packagejson.version) === 'major') {
      fs.rename('./config.json', './config.old.json', (err) => {
        if (err) throw err;
        console.log('Outdated config file, renaming.');
      });
    }
  },
  // ConfigConstract: function (config) {
  //   this.ConfigData.gpio.rgb.red = config.red;
  //   this.ConfigData.gpio.rgb.green = config.green;
  //   this.ConfigData.gpio.rgb.blue = config.blue;
  //   this.ConfigData.server_settings.webserverport = config.port;
  //   this.ConfigData.server_settings.debug = config.debug;
  //   this.ConfigData.RPiLC_settings.startupcolor = config.startcolor;
  //   this.ConfigData.RPiLC_settings.on_color = config.oncolor;
  //   this.ConfigData.AutoGen = false;
  // },
}

