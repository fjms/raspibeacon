# Raspibeacon

Escaneo de beacon ble Kontack enviando una peticion post a un endpoint

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



```js
npm install raspibeacon
var raspibeacon = require('raspibeacon')
raspibeacon.startScan("http://localhost:80", "/endpoint/beacon");
```

Modo debug
```js
npm install raspibeacon
var raspibeacon = require('raspibeacon')
raspibeacon.startScanDebug("http://localhost:80", "/endpoint/beacon");
```
