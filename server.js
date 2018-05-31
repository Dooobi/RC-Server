/*jslint bitwise: true, node: true */
'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http),
	Servo = require('./servo');

var servo = new Servo({
	gpio: 18,
	inputRange: {
		min: -32768,
		max: 32767
	},
	outputRange: {
		min: 1000,
		max: 1700
	},
	mirror: true,
	defaultPulseWidth: 1500
});
var motor = new Servo({
	gpio: 17,
	inputRange: {
		min: -1.0,
		max: 1.0
	},
	outputRange: {
		min: 1100,
		max: 1900
	},
	mirror: true,
	defaultPulseWidth: 1500
});	

io.on('connection', function (socket) {
    console.log('A client connected!');

	socket.on("update", function(changedData) {	
		motor.update(changedData.trigger.right - changedData.trigger.left);
		servo.update(changedData.leftstick.x);
		
		console.log(`Motor: ${motor.currentPulseWidth} - Servo: ${servo.currentPulseWidth}`);
	});
/*	
	socket.on("button-long", function (n, button, elapsed) {
		console.log("[%d] Hold button %s for %dms", n, button, elapsed);
	});
	
	socket.on("button-short", function(n, button, elapsed) {
		console.log("[%d] Pressed button %s for %dms", n, button, elapsed);
	});
	
	socket.on("button-changed", function(n, button, state) {
		console.log("[%d] Button %s changed: %s", n, button, state);
	});
	
	socket.on("analog-input", function(n, input, data) {
		console.log("[%d] Holding %s at:", n, input, data);
		
		if (input === "leftstick") {
			var pulseWidth = map(data.x, -1, 1, 1100, 1900);
			pulseWidth = Math.trunc(pulseWidth);
			console.log("motor.servoWrite(" + pulseWidth + ")");
			motor.servoWrite(pulseWidth);
		}
	});
*/	
	socket.on("connection-changed", function(n, isConnected) {
		console.log("[%d] Connection state changed: %s", n, isConnected ? "Connected!" : "Disconnected!");
	});

    socket.on('disconnect', function () {
		console.log("disconnect");
    });
	
});

// linearly maps value from the range (a..b) to (c..d)
function map(value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
}

// Don't touch, IP configurations.
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1';
var serverport = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3001;
if (process.env.OPENSHIFT_NODEJS_IP !== undefined) {
    http.listen( serverport, ipaddress, function() {
        console.log('[DEBUG] Listening on localhost:' + serverport);
    });
} else {
    http.listen( serverport, function() {
        console.log('[DEBUG] Listening on 127.0.0.1:' + 3001);
    });
}
