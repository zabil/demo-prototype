var protobuf = require("protobufjs");
var spawn = require('child_process').spawn;
var net = require('net');
var path = require('path');

var Project = function(p) {
	this.path = path.resolve(p)
	var socket = this.socket = net.Socket();

	port = (Math.random() * 999 | 6000) + 1;
	var daemon = spawn('gauge', ['--daemonize', '--api-port', port, "specs"], { cwd: this.path});
	console.log("Starting Gauge Daemon in " + this.path + " on port " + port);
	setTimeout(function(){
		socket.connect(port, "localhost")
	},3000);
	daemon.on('error', (err) => {
		console.error('Failed to start child process.', err);
	});
}

Project.prototype.get_steps = function() {
	var self = this;
	return new Promise(function(resolve, reject){
		protobuf.load("gauge-proto/api.proto")
			.then(function(root) {
				var api_message = root.lookupType("gauge.messages.APIMessage");
				var payload = {
					messageType: api_message.APIMessageType.GetAllStepsRequest,
					allStepsRequest: {}
				};
				var request = api_message.encodeDelimited(api_message.create(payload)).finish();
				self.socket.write(request);
				self.socket.on('data', function(data){
					var message = api_message.decodeDelimited(data);
					resolve(message['allStepsResponse']['allSteps'].map(function(s){return s.stepValue}));
				});
			})
			.catch(reject);
	});
}

Project.prototype.get_specs_dir = function() {
	return path.join(this.path, "specs");
}

module.exports = {
	Project: function(path) { return new Project(path) }
};