var config = require('../config');
var utils = require('../utils');
var request = require("request");



module.exports = {
    auth: function(callback) {
        var options = {
            method: 'POST',
            url: 'https://api.netatmo.net/oauth2/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'cache-control': 'no-cache'
            },
            form: {
                grant_type: 'password',
                client_id: 'NETATMO ID',
                client_secret: 'NETATMO SECRET',
                username: 'NETATMO EMAIL HERE',
                password: 'NETATMO PASSWORD HERE',
                scope: 'read_station'
            }
        };

        request(options, function(error, response, body) {
            var data;
            if (body) {
                data = JSON.parse(body);
                if (data.error)
                    callback(data.error)
                else
                    callback(error, JSON.parse(body))
            } else {
                console.log("error")
                callback(true, error)
            }
        });


    },
    auth_refresh: function(token, callback) {
        var request = require("request");
        console.log("DASD",token)
        var options = {
            method: 'POST',
            url: 'https://api.netatmo.net/oauth2/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'cache-control': 'no-cache'
            },
            form: {
                grant_type: 'refresh_token',
                client_id: 'NETATMO ID',
                client_secret: 'NETATMO SECRET',
                refresh_token: token
            }
        };

        request(options, function(error, response, body) {
            var data;
            if (body) {
                data = JSON.parse(body);
                if (data.error)
                    callback(data.error)
                else
                    callback(error, JSON.parse(body))
            } else {
                console.log("error")
                callback(true, error)
            }
        });

    },
    read_station: function(token, callback) {

        var options = {
            method: 'POST',
            url: 'https://api.netatmo.net/api/getstationsdata',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'cache-control': 'no-cache'
            },
            form: {
                access_token: token
            }
        };

        request(options, function(error, response, body) {
            var data;
            if (body) {
                data = JSON.parse(body);
                console.log(data.error)
                if (data.error)
                    callback(data.error)
                else
                    callback(error, JSON.parse(body))
            } else {
                console.log("error")
                callback(true, error)
            }

        });

    }
};