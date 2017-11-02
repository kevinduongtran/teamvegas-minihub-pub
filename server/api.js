var async = require("async");

var utils = require('./utils.js');
var config = require('./config.js');

var Firebase = require('./vendor/Firebase.js');
var SmartThings = require('./vendor/SmartThingsInterface.js');
var Netatmo = require('./vendor/netatmo.js');
// var Nest = require('./vendor/nest.js');
var Nest = require('unofficial-nest-api');

// SmartThings.getAllLights(function(res) {
//     console.log(res)
// });

// SmartThings.setLightLevel("83933d40-d370-43ea-91b9-29206e089e51", 25)


var netatmo_refresh_token = "nil";

module.exports = function(app) {
    app.get('/api/smartthings/getSwitches', function(req, res) {

        async.waterfall([
            function auth(callback) {

                SmartThings.getAllSwitches(function(res) {
                    callback(null, JSON.parse(res))
                });

            }
        ], function(err, result) {
            utils.resJSON(res, err, result)
        });
    })
    app.get('/api/smartthings/getLights', function(req, res) {

        async.waterfall([
            function auth(callback) {

                SmartThings.getAllLights(function(res) {
                    callback(null, JSON.parse(res))
                });

            }
        ], function(err, result) {
            utils.resJSON(res, err, result)
        });
    })
    app.post('/api/smartthings/setLightMode', function(req, res) {
        var device_id = req.body.device_id;
        var mode = req.body.mode;

        async.waterfall([
            function validate(callback) {
                var success = true;

                if (!device_id) {
                    callback("no device_id");
                    success = false;
                } else if (mode === null) {
                    callback("no mode");
                    success = false;
                }
                if (success) {
                    callback(null)
                }


            },
            function changeLightLevel(callback) {
                SmartThings.setLightMode(device_id, mode)
                callback(null)

            }
        ], function(err, result) {
            utils.resJSON(res, err, result)
        })
    });
    app.post('/api/smartthings/setLightLevel', function(req, res) {
        var device_id = req.body.device_id;
        var level = req.body.level;

        async.waterfall([
            function validate(callback) {
                var success = true;

                if (!device_id) {
                    callback("no device_id");
                    success = false;
                } else if (!level) {
                    callback("no level");
                    success = false;
                } else if (isNaN(level)) {

                    callback("level is Nan");
                    success = false;
                } else if (level > 100 || level < 0) {

                    callback("level is not valid range");
                    success = false;
                }
                if (success) {
                    callback(null)
                }


            },
            function changeLightLevel(callback) {
                SmartThings.setLightLevel(device_id, level)
                callback(null)

            }
        ], function(err, result) {
            utils.resJSON(res, err, result)
        })
    });
    app.get('/api/smartthings/getLights', function(req, res) {

        async.waterfall([
            function auth(callback) {

                SmartThings.getAllLights(function(res) {
                    callback(null, JSON.parse(res))
                });

            }
        ], function(err, result) {
            utils.resJSON(res, err, result)
        });
    })
    app.get('/api/netatmo', function(req, res) {
        async.waterfall([
            function auth(callback) {

                Netatmo.auth_refresh(netatmo_refresh_token, function(error, refreshAuthData) {

                    if (error) {
                        console.log("refresh token didint work")
                        Netatmo.auth(function(error, authData) {
                            callback(error, authData)
                        });
                    } else {
                        console.log("refresh token did work")
                        callback(error, refreshAuthData)
                    }
                })


            },
            function read_station(authData, callback) {

                netatmo_refresh_token = authData.refresh_token;
                Netatmo.read_station(authData.access_token, function(error, data) {
                    callback(error, data)
                });
            }
        ], function(err, result) {
            utils.resJSON(res, err, result)
        });

    });

    app.get('/api/nest', function(req, res) {
        async.waterfall([
            function auth(callback) {

                Nest.login('kevinduongtran@gmail.com', 'Defeatedzebra!11', function(err, data) {

                    if (err) {
                        callback(err);
                    }
                    Nest.fetchStatus(function(data) {
                        callback(null, data);
                        //Nest.setTemperature(ids[0], 70);
                        //Nest.setTemperature(70);
                        //Nest.setFanModeAuto();
                        //subscribe();
                        //Nest.setAway();
                        //Nest.setHome();
                        //Nest.setTargetTemperatureType(ids[0], 'heat');
                    });
                });



            },
        ], function(err, result) {
            utils.resJSON(res, err, result)
        });

    });
    app.post('/api/nest', function(req, res) {
        // required
        var deviceId = req.body.deviceId;
        var cmd = req.body.command;

        // attributes
        var temperature = req.body.target_temperature;
        var temperatureType = req.body.target_temperature_type;
        var away = req.body.target_away_state;

        console.log(temperatureType != "cool")
        async.waterfall([
            function validate(callback) {
                var success = true;
                if (!deviceId) {
                    callback("Missing deviceId")
                    success = false;
                }
                if (!cmd) {
                    callback("Missing command")
                    success = false;
                }
                switch (cmd) {
                    case 'setTemperature':
                        if (!temperature) {
                            callback("Missing target_temperature")
                            success = false;
                        }
                        break;
                    case 'setAway':
                        if (away == null) {
                            callback("Missing target_away_state")
                            success = false;
                        }
                        break;

                    case 'setTargetTemperatureType':
                        if (!temperatureType) {
                            callback("Missing target_temperature_type")
                            success = false;
                        }
                        if (temperatureType == "cool" || temperatureType == "heat" || temperatureType === "range") {

                        } else {
                            callback("Invalid target_temperature_type, must be 'cool', 'heat', or 'range'")
                            success = false;
                        }
                        break;
                }
                if (success)
                    callback(null)
            },

            function pass_to_nest(callback) {

                Nest.login('kevinduongtran@gmail.com', 'Defeatedzebra!11', function(err, data) {
                    console.log("doing")
                    if (err) {
                        callback(err);
                    } else {
                        Nest.fetchStatus(function(data) {
                            try {
                                var success = true;
                                switch (cmd) {
                                    case 'setTemperature':
                                        Nest.setTemperature(deviceId, temperature);
                                        break;
                                    case 'setAway':
                                        Nest.setAway(away, deviceId);
                                        break;
                                    case 'setHome':
                                        Nest.setHome(deviceId);
                                        break;
                                    case 'setFanModeAuto':
                                        Nest.setFanModeAuto(deviceId);
                                        break;
                                    case 'setFanModeOn':
                                        Nest.setFanModeOn(deviceId);
                                        break;
                                    case 'setTargetTemperatureType':
                                        Nest.setTargetTemperatureType(deviceId, temperatureType);
                                        break;
                                }
                            } catch (err) {
                                if (err instanceof TypeError) {
                                    // console.log(err)
                                    success = false;
                                }
                                if (err instanceof SyntaxError) {
                                    // console.log(err)
                                    success = false;
                                }

                            }
                            if (!success) {
                                callback("Cannot find device with id " + deviceId);
                            } else {
                                callback(null)
                            }
                        });
                    }


                });
            },
        ], function(err, result) {
            utils.resJSON(res, err, result)
        });


    })

};
