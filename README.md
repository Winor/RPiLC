![logo](https://i.imgur.com/lPYcuWA.png)

![GitHub package version](https://img.shields.io/github/package-json/v/Winor/RPiLC.svg)
![GitHub (pre-)release](https://img.shields.io/github/release/Winor/RPiLC/all.svg)
[![Dependency Status](https://david-dm.org/Winor/RPiLC.svg)](https://david-dm.org/Winor/RPiLC)

RPiLC lets you control your RGB led strip with a Raspberry Pi. RPiLC has a designed web app that allows you to control your RGB led strip from any device with style!

![Imgur](https://i.imgur.com/Gg8tnId.png)

## Features
* Live color preview as you move the color picker
* Multiple clients can be opened simultaneously
* Connect to multiple RPiLC servers from one client
* Cycle between selected colors
* Web controlled, clean design
* iOS web app support
* Touch ready UI

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

## TODO
You can see what I plan to do next at my [trello list](https://trello.com/b/78vXfIeE), might be a little messy, sorry :P

## Resources

* [colorjoe](https://github.com/bebraw/colorjoe) - The color picker used
* [uikit](https://github.com/uikit/uikit) - framework used

## License

This project is licensed under the MIT License
