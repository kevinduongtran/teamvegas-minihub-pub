var _ = require('underscore')
var async = require("async");

var schedule = require('node-schedule');
var config = require('../config');
var utils = require('../utils');
var request = require('request');
var Nest = require('unofficial-nest-api');


var SmartThings = require('../vendor/SmartThingsInterface')


utils.msgSlack("Radiant Floor Pump Monitor Started", true)

module.exports = function() {

    schedule.scheduleJob('*/' + 30 + ' * * * * *', function() {
        var nestDevices = {}
        var shouldTriggerPump = false;
        var foundPump = false;
        var foundPump = false;
        var pumpID = "";
        var currentPumpState;

        async.waterfall([
            function GetPumpID(callback) {
                console.log("1")
                SmartThings.getAllSwitches(function(devices) {
                    var stDevices = JSON.parse(devices);

                    for (var device in stDevices) {
                        if (stDevices[device].label == "Radiant Pump") {
                            pumpID = stDevices[device].id;
                            currentPumpState = stDevices[device]
                            foundPump = true;
                            callback(null)
                        }
                    }
                    if (!foundPump) {
                        console.log("Pump not found")
                        callback("Pump Not Found")
                    } else {
                        console.log("Pump found")
                    }

                })

            },
            function CheckForHeating(callback) {
                console.log("2")
                Nest.login('kevinduongtran@gmail.com', 'Defeatedzebra!11', function(err, data) {

                    if (err) {
                        callback(err);
                    }

                    Nest.fetchStatus(function(data) {
                        nestDevices = data.shared;
                        Object.keys(nestDevices).forEach(function(key) {
                            if (key.indexOf('fake') == -1) {
                                var device = nestDevices[key]
                                if (device['hvac_heater_state'] == true) {
                                    console.log(device)
                                    shouldTriggerPump = true;
                                }
                            }
                        });
                        callback(null)
                    });
                });
            },
            function TriggerPump(callback) {
                console.log("3")
                console.log("Checking should Triggering Pump")
                if (shouldTriggerPump) {
                    console.log("Should Trigger Pump")
                    if (currentPumpState.value.switch == false) {
                        console.log("Pump was False, Turning On")
                        utils.msgSlack("Setting Pump On " + pumpID, true)
                        SmartThings.setSwitchMode(pumpID, "1")

                    } else {
                        console.log("Pump was True, Not Triggering")
                    }

                } else {
                    console.log("Should not Trigger Pump")
                    if (currentPumpState['value']['switch'] == true) {
                        console.log("Pump was True, Turning Off")
                        utils.msgSlack("Setting Pump Off " + pumpID, true)
                        SmartThings.setSwitchMode(pumpID, "0")
                    } else {
                        console.log("Pump was False, Not Turning Off")
                    }

                }
                callback(null)
            }


        ], function(err, result) {
            if (err) {
                utils.msgSlack("Found Error", true)
                utils.msgSlack(err, true)
            }
            console.log(err, result)
        })



    });



}