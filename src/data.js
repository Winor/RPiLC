// 'use strict'
// const fs = require("fs");
// const packagefile = fs.readFileSync("package.json");
// const packagejson = JSON.parse(packagefile);


//module.exports = 

function data(device) {
  this.mac = device.mac,
  this.interface = device.interface,
  this.id = device.mac + '.' + device.interface
  this.msg = function (action,data) {
    return {
    action: action,
    id: this.id,
    data: data
    }
  }
}

let devices = {
  dev1: new data ({mac: "111111",
  interface: "1"
})

}

class data {
  constructor(device, cmd, data){
  }
}

console.log(devices.dev1.msg("color",{rgb:"1.1.1"}))