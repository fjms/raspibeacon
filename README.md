# Raspibeacon

Beacon low energy scanning program that sends a post request to an end point defined in the parameters.

You can filter by beacons mark, define the time between beacon detection.

### Linux

 * Kernel version 3.6 or above
 * ```libbluetooth-dev```

#### Ubuntu/Debian/Raspbian

```sh
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```

Make sure ```node``` is on your path, if it's not, some options:
 * symlink ```nodejs``` to ```node```: ```sudo ln -s /usr/bin/nodejs /usr/bin/node```
 * [install Node.js using the NodeSource package](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)


#### Usage

```js
npm install raspibeacon
var raspibeacon = require('raspibeacon')
let options = {
    brands: ['Kontakt'],
    host: "http://10.148.144.104:3000",
    endpoint: "/api/ionic/raspibeacons",
    timeout: 180000    
}
raspibeacon.startScan(options);
```

Modo debug
```js
npm install raspibeacon
var raspibeacon = require('raspibeacon')
let options = {
    brands: ['Kontakt','RadioLand iBeacon'],
    host: "http://10.148.144.104:3000",
    endpoint: "/api/ionic/raspibeacons",
    timeout: 180000    
}
raspibeacon.startScanDebug(options);
```
