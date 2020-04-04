'use strict'
const fs = require('fs');
const packagefile = fs.readFileSync("package.json");
const packagejson = JSON.parse(packagefile);
module.exports = {
  ConfigData: {
    gpio: [
      {
        RGB: {
          red: '17',
          green: '22',
          blue: '24'
        }
      }
    ],
    server_settings: {
      mode: "server",
      webserverport: '80',
      webdir: 'client',
      debug: false,
      gpio: true,
      discovery: true
    },
    RPiLC_settings: {
      startupcolor: '#000000',
      on_color: '#ffffff'
    },
    AutoGen: true,
    Version: packagejson.version
  },
  write: function (file, data) {
    let json = JSON.stringify(data, null, 2);
    fs.writeFileSync(file, json);
  },
  ConfigWrite: function () {
    this.write("./config.json", this.ConfigData)
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
  ConfigApply: function () {
    this.ConfigWrite();
  }
}