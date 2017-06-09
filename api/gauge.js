var protobuf = require("protobufjs");

var socket = require("net").Socket();

socket.connect(9999, "localhost");

protobuf.load("../gauge-proto/api.proto").then(function(root) {
    var APIMessage = root.lookupType("gauge.messages.APIMessage");

    var messageHandler = function(bytes) {
        console.log("Received response");
        var message = APIMessage.decodeDelimited(bytes);
        console.log(JSON.stringify(message));
    };

    socket.on("data", messageHandler);

    var payload = {
        messageType: APIMessage.APIMessageType.GetAllStepsRequest,
        allStepsRequest: {}
    };

    // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
    var errMsg = APIMessage.verify(payload);
    if (errMsg)
        throw Error(errMsg);

    // Create a new message
    var msg = APIMessage.create(payload); // or use .fromObject if conversion is necessary

    // Encode a message to an Uint8Array (browser) or Buffer (node)
    var buffer = APIMessage.encodeDelimited(msg).finish();


    // ... do something with buffer
    console.log("Sending message");
    socket.write(buffer);
    console.log("Message sent");
});