var protobuf = require("protobufjs");
var spawn = require('child_process').spawn;
var net = require('net');
var sync = require('synchronize');

var createMessage = function(callback) {
	var proto = protobuf.load("gauge-proto/api.proto");
	proto.then(function(root) {
		var message = root.lookupType("gauge.messages.APIMessage");
	    var payload = {
		        messageType: message.APIMessageType.GetAllStepsRequest,
		        allStepsRequest: {}
		    };
		callback(message.encodeDelimited(message.create(payload)).finish());
	})
};

var messageHandler = function(bytes) {
    console.log("Received response");
    var message = APIMessage.decodeDelimited(bytes);
    console.log(JSON.stringify(message));
};

var Project = function(path) {
	var socket = this.socket = net.Socket();
	
	var port = (Math.random() * 999 | 6000) + 1;
	var daemon = spawn('gauge', ['daemonize', '--api-port', port], { cwd: path});
	
	daemon.stdout.on('data', function(){
		console.log('spawn');
		socket.connect(port, 'localhost');
		socket.on('data', messageHandler);
	});
	
	daemon.on('error', (err) => {
	  console.log('Failed to start child process.');
	});
}

Project.prototype.steps = function() {
	var self = this;
	createMessage(function(message){
		self.socket.write(message);
	});
}

module.exports = {
	Project: function(path) { return new Project(path) }
};