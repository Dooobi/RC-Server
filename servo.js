var Gpio = require('pigpio').Gpio;

module.exports = function(options) {
	
	this.gpioNumber = options.gpio;
	this.inputRange = options.inputRange;
	this.outputRange = options.outputRange;
	this.defaultPulseWidth = options.defaultPulseWidth || (this.inputRange.max - this.inputRange.min)/2 + this.inputRange.min;
	this.mirror = options.mirror || false;
	
	this.currentPulseWidth = this.defaultPulseWidth;
	this.actualOutputRange = {
		min: this.mirror ? this.outputRange.max : this.outputRange.min,
		max: this.mirror ? this.outputRange.min : this.outputRange.max
	};
	this.servo = new Gpio(this.gpioNumber, {mode: Gpio.OUTPUT});
	this.calibrating = false;
	
	this.init = function() {
		this.servo.servoWrite(this.defaultPulseWidth);
		this.currentPulseWidth = this.defaultPulseWidth;
	};
	
	this.update = function(input) {
		this.currentPulseWidth = Math.round(map(input, this.inputRange.min, this.inputRange.max, this.actualOutputRange.min, this.actualOutputRange.max));
		console.log(`Math.round(map(${input}, ${this.inputRange.min}, ${this.inputRange.max}, ${this.actualOutputRange.min}, ${this.actualOutputRange.max})) = ${this.currentPulseWidth}`);
		this.servo.servoWrite(this.currentPulseWidth);
	};
	
};

// linearly maps value from the range (a..b) to (c..d)
function map(value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
}