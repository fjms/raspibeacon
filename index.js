var main = require('./main');
module.exports = {
    startScan: function (host, endpoint) {
        main.startScan(host, endpoint, false);
    },
    startScanDebug: function (host, endpoint) {
        console.log("This is a message from startScanDebug");
        main.startScan(host, endpoint, true);
    }
};