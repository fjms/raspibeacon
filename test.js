var raspibeacon = require('./index');

console.log('Test con debug')

let options = {
    brands: ['Kontakt'],
    host: "http://10.148.144.104:3000",
    endpoint: "/api/ionic/raspibeacons",
    timeout: 180000,
    debug: true
}

raspibeacon.startScanDebug(options);




