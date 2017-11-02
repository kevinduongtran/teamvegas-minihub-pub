/*
use this to update all lights again, you might to need to save out JSON from iotdb again

https://graph.api.smartthings.com/oauth/authorize?response_type=code&client_id=1efdccc1-c398-404f-a89d-4f226da1ed30
&scope=app&redirect_uri=teamvegasapp.com/test


/*/
var unirest = require('unirest');

var fs = require('fs');
var util = require('util');
var events = require('events');
var minimist = require('minimist');

var SmartThings = require("./smartthingslib").SmartThings;



module.exports = {
	getAllSwitchLevel: function(callback) {
		execute(['--type',
			'switchLevel'
		], function(result) {
			callback(result)
		})
	},
	getAllSwitches: function(callback) {
		execute(['--type',
			'switch'
		], function(result) {
			callback(result)
		})
	},
	setLightMode: function(device_id, Mode) {
		execute(['--type',
			'switch',
			'--device_id',
			device_id,
			'--request',
			'switch=' + Mode
		], function(result) {
			console.log("done")
		})
	},
	setSwitchMode: function(device_id, Mode) {
		execute(['--type',
			'switch',
			'--device_id',
			device_id,
			'--request',
			'switch=' + Mode
		], function(result) {
			console.log("done")
		})
	},
	setLightLevel: function(device_id, level) {
		execute(['--type',
			'switchLevel',
			'--device_id',
			device_id,
			'--request',
			'level=' + level
		], function(result) {
			console.log("done")
		})
	}
}

var execute = function(command, callback) {
	var sm = new SmartThings();
	var ad = require('minimist')(command, {
		boolean: ["poll"]
	});

	sm.on("endpoint", function() {
		sm.request_devices(ad.type);
	});
	sm.on("devices", function(device_type, devices) {
		var di;
		var device;

		if (ad.device_id) {
			var ds = [];
			for (di in devices) {
				device = devices[di];
				if ((device.id === ad.device_id) || (device.label === ad.device_id)) {
					ds.push(device);
				}
			}
			devices = ds;
		}

		if (ad.request) {
			for (di in devices) {
				device = devices[di];
				sm.device_request(device, ad.request);
			}
		} else if (ad.poll && ad.device_id) {
			var _on_state = function(error, _deviced, _stated) {
				console.log(JSON.stringify(_stated, null, 2));
			};
			for (di in devices) {
				device = devices[di];
				sm.device_poll(device, _on_state);
			}
		} else {
			var obj = JSON.stringify(devices, null, 2);
			// console.log(obj);
			callback(obj)
		}

	});

	var help = function() {
		console.log("usage:", process.argv[1], "[arguments...]");
		console.log("");
		console.log("--type <device_type>");
		console.log("  the device type (required), one of switch, motion, presence, acceleration, …");
		console.log("  …contact, temperature, battery, threeAxis");
		console.log("");
		console.log("--device_id <device_id>");
		console.log("  the ID or Name of the device to manipulate");
		console.log("");
		console.log("--request <something=value>");
		console.log("  something to do, e.g. 'switch=1', 'switch=0'");
		console.log("");
		console.log("--poll");
		console.log("  request the device's state (must be paired with device_id");

	};
	if (Object.keys(ad).length === 1) {
		help();
		process.exit(1);
	}
	if (!ad.type) {
		console.log("error:");
		console.log("  --type <device_type> is required");
		console.log("");
		help();
		process.exit(1);
	}
	if (ad.request) {
		var parts = ad.request.split("=", 2);
		if (parts.length !== 2) {
			console.log("error:");
			console.log("  --request requires an argument like 'switch=1'");
			console.log("");
			help();
			process.exit(1);
		}
		ad.request = {};
		ad.request[parts[0]] = parseInt(parts[1]);
	}

	sm.load_settings();
	sm.request_endpoint();


}