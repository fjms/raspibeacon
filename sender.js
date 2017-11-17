
var request = require('request');

module.exports = {
    sendToServo: function (url, presence) {
        presence.id_device = require('./main').ID_DEVICE;
        if (require('./main').DEBUG) {
            console.log('Sending to ' + url);
            console.log(presence);
        }
        send(url, presence);
    }
};
send = function (url, presence) {
    request({ url: url, body: presence, json: true, method: 'post' }, function (error, response, body) {
        if (require('./main').DEBUG) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
        }
    });
}

