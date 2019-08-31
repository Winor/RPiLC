'use strict'
module.exports = {
  Version: "1.1.0",
  type: 'desktop',
  description: "My Workstation",
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
  },
  RainbowMode: {
    state: false, // true / false
    speed: 6000
  }
}
