# RPiLC - Raspberry Pi LED Control

Easily control your RGB LED strip with a Raspberry PI.

![preview](https://i.imgur.com/aCaw8fB.png)

## Features
* Touch ready
* Web controlled, clean design
* Multiple clients can be opened simultaneously
* Cycle between selected colors (preview feature, client side only)
#### Coming soon
* API
* Color fade
* Better server app
* Light sensor support
* More.

## Prerequisites

In order to use this app you need:
* A Raspberry Pi.
* Node.js installed.
* Pigpio C library (Version V41 or higher)
* RGB led connected to the Pi's GPIO (you can follow [this guide](http://dordnung.de/raspberrypi-ledstrip/) for wiring)

## How to use?
You can follow these 3 easy steps to get it running on your own PI:

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

## Resources

* [colorjoe](https://github.com/bebraw/colorjoe) - The color picker used

## License

This project is licensed under the MIT License
