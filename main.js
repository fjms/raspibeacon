var noble = require('noble');
var moment = require('moment');
var util = require('./sender');
var now = moment();


var myDict = {};
var OPTIONS = {};
let filterName = "Kontakt";
var stateProcess;
var url = "";
var DEBUG = true;
var INTERVAL;
var TIMEOUT = 180000;

// let options = {
//   brands: ['Kontakt', 'Radioland iBeacon'],
//   host: "http://10.148.144.104:3000",
//   endpoint: "/api/ionic/raspibeacons",
//   timeout: 180000,
//   debug: true
// }


// BUCLE PRINCIPAL
module.exports = {
  startScan: function (options) {
    OPTIONS = options;
    DEBUG = options.debug;
    if (options.timeout) {
      TIMEOUT = options.timeout;
    }
    module.exports.DEBUG = options.debug;
    if (DEBUG)
      console.log('Start Raspibeacon');
    if (options.host && options.endpoint) {
      url = options.host + options.endpoint;
      noble.on('stateChange', function (state) {
        stateProcess = state;
        if (state === 'poweredOn')
          noble.startScanning([], true);
        else
          noble.stopScanning();
      });

      INTERVAL = setInterval(function () {
        checkBeaconsOnExit();
      }, 30000);
    } else {
      console.log('Error. Debe indicar parametros host y endpoint');
      console.log('let options = {host: "http://10.148.144.104:3000",endpoint: "/api/ionic/raspibeacons"}')
      console.log('Ejemplo de uso: raspibeacon.startScan(options)');
      process.exit();
    }
  }
};
// FIN BUCLE PRINCIPAL

noble.on('discover', function (device) {
  let uuid = device.uuid;
  let mac = device.address.toUpperCase();
  let adv = device.advertisement;
  if (adv.localName && isfilterBrand(adv.localName)) {
    // FILTRAMOS POR MARCA
    let date = new Date();
    if (myDict[mac] != null) {
      myDict[mac] = createBeaconDao(mac, date);
    } else {
      myDict[mac] = createBeaconDao(mac, date);
      prepareBeacon(mac, true);
    }
  }

})

isfilterBrand = function (brand) {
  brands = OPTIONS.brands;
  if (brands) {
    return (brands.indexOf(brand) > -1);
  } else {
    return true;
  }
}

createBeaconDao = function (mac, date) {
  let device = {};
  device['mac'] = mac;
  device['date'] = date;
  return JSON.stringify(device);
}

prepareBeacon = function (mac, inOut) {
  let now = moment();
  let date = now.format('YYYY-MM-DD HH:mm:ss');
  if (DEBUG) {
    console.clear();
    console.log('Beacon detectado');
    console.log(date, 'mac:', mac);
  }
  util.sendToServo(url, {
    dateTime: now.toDate(),
    inOut: inOut,
    uuid: mac
  });
}
checkBeaconsOnExit = function () {
  //console.log('checkBeaconsOnExit');
  let keys = Object.keys(myDict);
  if (keys.length > 0) {
    keys.forEach((key) => {
      //let time = new Date(JSON.parse(this.myDict[key]).date).getTime();
      //console.log('key almacenada: ' + key + ' TimeStorage: ' + time + " Now:" + new Date().getTime());
      if (new Date().getTime() - new Date(JSON.parse(myDict[key]).date).getTime() > TIMEOUT) {
        prepareBeacon(key, false);
        if (DEBUG)
          console.log('Saliendo del radio de acción del beacon');
        delete myDict[key];
      }
    });
  }
}

