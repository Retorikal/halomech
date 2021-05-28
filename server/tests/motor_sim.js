// IOT Sensor node. Sends data to the broker server.
var mqtt = require('mqtt') 

var t = 0; 
var u = 0; 
var f = 5;
var a = 100;
var interval_handle;
var motorname = process.argv.length > 2 ? process.argv[2] : "d4e5ff4";
var aedes_port = 1880;
var topicVib = `esp32/motor_${motorname}/vib`;
var topicRPM = `esp32/motor_${motorname}/rpm`;
var topicCoef = `esp32/motor_${motorname}/coef`;

console.log("Publishing to" , topicRPM);

var client = mqtt.connect(`mqtt://localhost:${aedes_port}`) 
client.on('connect', () => { 
	console.log(`Publishing to ${aedes_port}`);
	client.publish(topicCoef, "0.02932",{retain: true});

	interval_handle = setInterval(() => { 
		t++; 
		u = a + a * Math.abs(Math.sin(f*t)); 
		u = u.toFixed(2); 
		client.publish(topicRPM, u.toString(),{retain: true});
		client.publish(topicVib, u.toString(),{retain: true});
		//console.log("Published message:", u); 
	},100)

	client.subscribe(topicRPM);
})

client.on('message', (topic, message) => { 
	console.log('Received: '+ topic + ": " + message);
});