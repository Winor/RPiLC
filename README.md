# Node-RGB-RPi

Easily control your LED strip with a Raspberry PI.

![preview](https://i.imgur.com/aCaw8fB.png)

### Prerequisites

In order to use this app you need:
* a Raspberry Pi.
* Node.js installed.
* pigpio C library (Version V41 or higher)
* RGB led connected to the Pi's GPIO (you can follow this [guide](http://dordnung.de/raspberrypi-ledstrip/) for wiring)

### Installing

```
git clone https://github.com/Winor/Node-RGB-RPi
cd Node-RGB-RPi
npm install
``` 
#### Config
Edit config.json to match your setup

#### run

```
sudo node index.js
```

## Built With

* [colorjoe](https://github.com/bebraw/colorjoe) - The color picker used

## License

This project is licensed under the MIT License
