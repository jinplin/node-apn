var util = require('util');
var https = require('https');
var http = require('http');
var tls = require('tls');

function HttpsProxyAgent(proxyOptions) {
    https.Agent.call(this, proxyOptions);
    this.createConnection = function(options, callback) {
        var req = http.request({
            host: proxyOptions.proxyHost,
            port: proxyOptions.proxyPort,
            method: 'CONNECT',
            path: options.host + ':' + options.port,
            headers: {
                host: options.host
            }
        });

        req.on('connect', function(res, socket) {
            options.socket = socket;
            var cts = tls.connect(options, function() {
                callback(false, cts, socket);
            });
        });

        req.on('error', function(err) {
            callback(err, null);
        });

        req.end();
    }
}

util.inherits(HttpsProxyAgent, https.Agent);

module.exports = HttpsProxyAgent;
