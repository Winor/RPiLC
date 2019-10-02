'use strict'
const fs = require("fs");
const packagefile = fs.readFileSync("package.json");
const packagejson = JSON.parse(packagefile);
module.exports = {
  Version: packagejson.version,
  type: 'LED Strip',
  description: "My LED Strip",
  state: "off",
  SavedColors: [],
  ColorVals: {
    CurrentHEX: '#000000',
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
    speed: 8000,
    effect: "fade"
  }
}
