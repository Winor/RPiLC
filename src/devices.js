'use strict'
const tinycolor = require("tinycolor2");
const logger = require('./logger.js');
// load config file
const fs = require("fs");
const configfile = fs.readFileSync("config.json");
const config = JSON.parse(configfile);
//
let pio;
let devices = {}

// gets color object
function getcolor(c) {
    let color = tinycolor(c);
    if (!color.isValid()) {
        logger.warn("invalid color.");
        return;
    }
return {
  rgb: color.toRgb(),
  hex: color.toHex(),
  name: color.toName()
}  
}

class light {
    constructor(type, id, haredware, io, color="black", oncolor="white"){
        this.type = type
        this.id = id
        this.haredware = haredware
        this.io = new pio(io);
        this.color = color
        this.oncolor = oncolor
        //this.status; //on,cycle,off
    }

    get color() {
        return this._color;
      }

    set color(c) {
      let color = getcolor(c);
      if (color == null) {
        return;
      }
        this._color = color;
        if (this._color.name == "black" && this.status !== "cycle"){
          this.status = "off"
        } else {
          this.status = "on"
        }
  }

  setcolor(c){
    // pigpio only?
    this.color = c;
    this.io.set(this._color.rgb.r, this._color.rgb.g, this._color.rgb.b);
  }

  toggle(state){
    switch (state) {
      case "on":
        if (this.status == "cycle") {
          return;
        }
        this.setcolor(this.oncolor);
        break;

      case "off":
        this.setcolor("black");
        break;    
    
      default:
        if (this.status == "off"){
          this.setcolor(this.oncolor);
          return;
        }
        if (this.status == "cycle") {
          return;
        }
        this.setcolor(this.oncolor);

        break;
    }

  }

}

//creates light device from config file
function createpinsfromconfig() {
    let i = 0;
    config.gpio.forEach(int => {
        devices["local-"+i] = new light (String(Object.keys(int)), "local-"+i, "RPi", int, "black", "white")
        i++
    });
  }

  if (config.server_settings.gpio){
    pio = require('./pigpio.js')
    createpinsfromconfig()
  }

  console.log(devices)

  devices["local-0"].toggle("on")
// for (let i = 0; i < 255; i++) {
//   devices["local-0"].color = "rgb 255 0 "+ i
//   console.log(devices)
  
// }

    

 