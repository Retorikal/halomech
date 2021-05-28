// IOT Sensor node. Sends data to the broker server.
var mqtt = require('mqtt') 

var aedes_port = 1880;

var client = mqtt.connect(`mqtt://localhost:${aedes_port}`) 
client.on('connect', () => { 
	client.subscribe("#");
})

client.on('message', (topic, message) => { 
	console.log('Received: '+ topic + ": " + message);
});