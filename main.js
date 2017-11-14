var noble = require('noble');
var moment = require('moment');
var util = require('./sender');
var now = moment();


var myDict = {};

let filterName = "Kontakt";
var stateProcess;
var url = "";
var DEBUG = true;


// BUCLE PRINCIPAL
module.exports = {
  startScan: function (host, endpoint, debug) {
    DEBUG = debug;
    module.exports.DEBUG = debug;
    if (DEBUG)
      console.log('Start Raspibeacon');
    if (host && endpoint) {
      url = host + endpoint;
      noble.on('stateChange', function (state) {
        stateProcess = state;
        if (state === 'poweredOn')
          noble.startScanning([], true);
        else
          noble.stopScanning();
      });

      var myInt = setInterval(function () {
        checkBeaconsOnExit();
      }, 60000);
    } else {
      console.log('Error. Debe indicar parametros host y endpoint');
      console.log('Ejemplo de uso: raspibeacon.startScan("http:/servo.grupoclece.com","/api/ionic/raspibeacons")');
      process.exit();
    }
  }
};
// FIN BUCLE PRINCIPAL

noble.on('discover', function (device) {
  let uuid = device.uuid;
  let mac = device.address;
  let rssi = device.rssi;
  let adv = device.advertisement;
  if (adv.localName && adv.localName == filterName) {
    let date = new Date();
    if (myDict[device.address] != null) {
      myDict[mac] = createBeaconDao(device.address, date);
    } else {
      myDict[device.address] = createBeaconDao(device.address, date);
      prepareBeacon(device.address, true);
    }
  }

})

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
    inOut: true,
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
      if (new Date().getTime() - new Date(JSON.parse(myDict[key]).date).getTime() > 180000) {
        prepareBeacon(key, false);
        if (DEBUG)
          console.log('Saliendo del radio de acción del beacon');
        delete myDict[key];
      }
    });
  }
}

