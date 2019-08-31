![logo](https://i.imgur.com/lPYcuWA.png)

![GitHub package version](https://img.shields.io/github/package-json/v/Winor/RPiLC.svg)
![GitHub (pre-)release](https://img.shields.io/github/release/Winor/RPiLC/all.svg)
[![Dependency Status](https://david-dm.org/Winor/RPiLC.svg)](https://david-dm.org/Winor/RPiLC)

RPiLC lets you control your RGB led strip with a Raspberry Pi. RPiLC has a designed web app that allows you to control your RGB led strip from any device with style!

![Imgur](https://i.imgur.com/00O4qHE.png)

## Features
* Live color preview as you move the color picker
* Multiple clients can be opened simultaneously
* control multiple RPiLC servers from one client
* Cycle between selected colors
* Recently used colors
* Web controlled, clean design
* iOS web app support
* Touch ready UI
* API

## Prerequisites
In order to use this app you need:
* A Raspberry Pi.
* Node.js installed.
* Pigpio C library (Version V41 or higher)
* RGB led connected to the Pi's GPIO (you can follow [this guide](http://dordnung.de/raspberrypi-ledstrip/) for wiring)

## How to run RPiLC ?
You can follow these 3 easy steps to get it running on your own RPi:

#### 1. Get the files

```
git clone https://github.com/Winor/RPiLC
cd RPiLC
npm install
```
#### 2. Config
Edit config.json to match your setup

#### 3. Run

```
sudo node index.js
```
## Run RPiLC on startup using pm2
You can start RPiLC on startup by following these steps:
### 1. Install pm2
```
sudo npm install pm2@latest -g
```
### 2. Add RPiLC to pm2
```
cd [RPiLC location]
sudo pm2 start index.js --name RPiLC
```
### 3. Make pm2 run on startup
```
sudo pm2 startup
```

## API
### Status
```
http://RPiLC-Address/status
```
Will return status in JSON format
### Toggle State
```
http://RPiLC-Address/togglestate
```
Will turn the LED strip on or off & return status in JSON format
### Set Color
```
http://RPiLC-Address/color
```
Accepts hex value, rgb(x, x, x) and color name.
Will set the LED strip color & return status in JSON format
## Apple Shortcuts
You can use this [Siri shortcut](https://www.icloud.com/shortcuts/4746aadabf974abbae066326c69e8c3a) to toggle your LED strip using your Apple device.
## TODO
You can see what I plan to do next at my [trello list](https://trello.com/b/78vXfIeE), might be a little messy, sorry :P

## Resources

* [colorjoe](https://github.com/bebraw/colorjoe) - The color picker used
* [uikit](https://github.com/uikit/uikit) - framework used

## License

This project is licensed under Apache License 2.0
