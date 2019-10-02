![logo](https://i.imgur.com/lPYcuWA.png)

![GitHub package version](https://img.shields.io/github/package-json/v/Winor/RPiLC.svg)
![GitHub (pre-)release](https://img.shields.io/github/release/Winor/RPiLC/all.svg)
[![Dependency Status](https://david-dm.org/Winor/RPiLC.svg)](https://david-dm.org/Winor/RPiLC)

RPiLC allows you to control your RGB led strip from any device using a Raspberry Pi.

![Imgur](https://i.imgur.com/00O4qHE.png)


| Feature                  | Description                                                 |
|--------------------------|-------------------------------------------------------------|
| 🚦 **Live Color Preview** | Watch the color change as you move the color picker        |
| 📲 **Touch friendly**     | The app was designed to be comfortable to use on any device |
| 🕒 **Recent Colors**      | Choose a color from a list of recently used colors          |
| ▶ **Cycle Colors**       | Select colors to cycle, choose transition effect            |
| 📱 **iOS web app**        | Add RPiLC to your home screen and use like a normal app     |
| 🌐 **Web Client**         | Use RPiLC from any browser                                  |
| 🔃 **Flexible**           | Connect to other RPiLC Servers through one web client       |
| 🔄 **Updater**            | Get updates for RPiLC through the web client (Experimental) |
| ↔ **API**                | Interact with RPiLC via API                                   |


## Prerequisites
In order to use RPiLC you need:
* A Raspberry Pi.
* Node.js version 8.0.0 or newer installed (you can follow [this](https://github.com/nodesource/distributions/blob/master/README.md) to install the latest Node.js version on your Pi).
* Pigpio C library (Version V41 or higher)
* Python-setuptools & Python3-setuptools (required for Pigpio)
* RGB led strip connected to the Pi's GPIO (you can follow [this guide](http://dordnung.de/raspberrypi-ledstrip/) for wiring)

##  Install RPiLC on your Pi

#### 1. Get the files

Get the latest release from [here](https://github.com/Winor/RPiLC/releases/latest) and extract it to a new folder, or do:
```
git clone https://github.com/Winor/RPiLC
```
#### 2. Install dependencies

```
cd RPiLC
npm install
```
#### 3. Run
Note that in order to run RPiLC, the app has to be ran with root privilags so it can have accsess to the Pi's GPIO.
```
sudo node index.js
``` 

#### 4. Configure
Visit http://127.0.0.1 in your browser and configure the app to match your setup.
You can also edit config.json manually after it is generated by the app.

## Run RPiLC on startup using pm2
You can start RPiLC on startup by following these steps:
### 1. Install pm2
Note that in order to run RPiLC on startup, pm2 has to run the app as root so RPiLC can get accsess to the Pi's GPIO. 
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
http://RPiLC-Address/api/status
```
Will return status in JSON format
### Toggle State
```
http://RPiLC-Address/api/togglestate
```
Will turn the LED strip on or off & return status in JSON format
### Toggle Cycle
```
http://RPiLC-Address/api/togglecycle
```
Will turn the LED strip on or off & return status in JSON format
### Set Color
```
http://RPiLC-Address/api/set/[color]
```
Accepts hex value, rgb(x, x, x) and color name.
Will set the LED strip color & return status in JSON format
## Apple Shortcuts
You can use this [Siri shortcut](https://www.icloud.com/shortcuts/4746aadabf974abbae066326c69e8c3a) to toggle your LED strip using your Apple device.

## Resources

* [colorjoe](https://github.com/bebraw/colorjoe) - The color picker used
* [uikit](https://github.com/uikit/uikit) - framework used