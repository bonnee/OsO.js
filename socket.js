var io = require('socket.io')();
var ev = require('events').EventEmitter;
var util = require('util');

this.Server = function(port) {
	var self = this;

	var socket = new io();

	socket.on('connection', function(device) {
		var state = State.Connecting;
		var devId;

		console.log('Connection');

		device.on('hello', function(data) {
			db.exists(data, function(ex, dev) {
				devId = data;
				if (ex) { // Skip association
					state = State.Connected;
					device.emit('welcome', dev.name);
					console.log(JSON.stringify(dev.name) + ' recognized.');
				} else { // Asks for manifest
					state = State.Associating;
					device.emit('pair', devId);
					console.log(data + ' does not exist in db. Requesting data...');
				}
			});
		});

		device.on('pair', function(data) {
			state = State.Connected;
			var dev = db.addDevice(devId, JSON.parse(message.data));
			device.emit('hello', dev.name);
			console.log(dev.name + ' added.');
		});

		/*	device.on('message', function(message) {
				message = JSON.parse(message);

				if (message.id == 'hello' && state == State.Connecting) { // Initial connection. Only accepted when state is 0


				} else if (message.id == 'who' && state == State.Associating) { // Adds a new device in db


				} else if (message.id = 'log' && state == State.Connected) {
					console.log(db.addRecord(devId, JSON.parse(message.data)));
				} else {
					console.log(devId + ': ' + message.data);
				}
			});*/

		device.on('close', function close() {
			console.log(devId + ' has disconnected.');
		});
	});
	socket.listen(port);
}

util.inherits(this.Server, ev);
module.exports = this;
ev.call(this);
