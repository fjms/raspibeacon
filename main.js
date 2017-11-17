var noble = require('noble');
var moment = require('moment');
var util = require('./sender');


let myDict = {};
let OPTIONS = {};
let URL = "";
let DEBUG = true;
let INTERVAL;
let TIMEOUT = 180000;


// MAIN LOGIC
module.exports = {
  startScan: function (options) {
    OPTIONS = options;
    DEBUG = options.debug;
    if (options.timeout) {
      TIMEOUT = options.timeout;
    }
    module.exports.ID_DEVICE = getserial();
    module.exports.DEBUG = options.debug;
    if (DEBUG)
      console.log('Start Raspibeacon');
    if (options.host && options.endpoint) {
      URL = options.host + options.endpoint;
      noble.on('stateChange', function (state) {
        if (state === 'poweredOn')
          noble.startScanning([], true);
        else
          noble.stopScanning();
      });

      INTERVAL = setInterval(function () {
        checkBeaconsOnExit();
      }, 30000);
    } else {
      console.log('Error. You must specify host and endpoint options');
      console.log('let options = {host: "http://10.148.144.104:3000",endpoint: "/api/ionic/raspibeacons"}')
      console.log('Example of use: raspibeacon.startScan(options)');
      process.exit();
    }
  }
};
// END MAIN LOGIC

noble.on('discover', function (device) {
  let uuid = device.uuid;
  let mac = device.address.toUpperCase();
  let adv = device.advertisement;
  if (adv.localName && isfilterBrand(adv.localName)) {
    // FILTRAMOS POR MARCA
    let date = new Date();
    if (myDict[mac] != null) {
      myDict[mac] = createBeaconJson(mac, date);
    } else {
      myDict[mac] = createBeaconJson(mac, date);
      prepareBeaconPresence(mac, true);
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

createBeaconJson = function (mac, date) {
  let device = {};
  device['mac'] = mac;
  device['date'] = date;
  return JSON.stringify(device);
}

prepareBeaconPresence = function (mac, inOut) {
  let now = moment();
  if (DEBUG) {
    let date = now.format('YYYY-MM-DD HH:mm:ss');
    console.clear();
    console.log('Beacon detected');
    console.log(date, 'mac:', mac);
  }
  util.sendToServo(URL, {
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
        prepareBeaconPresence(key, false);
        if (DEBUG)
          console.log('Beacon out of detection range');
        delete myDict[key];
      }
    });
  }
}

getserial = function () {
  let fs = require('fs');
  let content = fs.readFileSync('/proc/cpuinfo', 'utf8');
  let cont_array = content.split("\n");
  let serial_line = cont_array[cont_array.length - 2];
  let serial = serial_line.split(":");
  return serial[1].slice(1);
}

