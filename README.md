# Node-RGB-RPi

Web RGB LED Strip controler.

![preview](http://i.imgur.com/skpYggc.png)

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
and then run it with:
```
sudo node index.js
```

## Built With

* [colorjoe](https://github.com/bebraw/colorjoe) - The color picker used

## License

This project is licensed under the MIT License
