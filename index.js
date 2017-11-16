var main = require('./main');
module.exports = {
    startScan: function (options) {
        options.debug = false;
        main.startScan(options);
    },
    startScanDebug: function (options) {
        console.log("This is a message from startScanDebug");
        options.debug = true;
        main.startScan(options);
    }
};