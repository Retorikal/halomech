// IOT Sensor node. Sends data to the broker server.
const mqtt = require('mqtt') 
const csv = require('fast-csv');
const path = require('path');
const fs = require('fs');

var interval_handle;
var motorname = "livetest";
var aedes_port = 1880;
var topicVib = `esp32/motor_${motorname}/vib`;
var topicRPM = `esp32/motor_${motorname}/rpm`;
var topicCoef = `esp32/motor_${motorname}/coef`;

console.log("Publishing to" , topicRPM);
console.log("Publishing to" , topicVib);

var client = mqtt.connect(`mqtt://localhost:${aedes_port}`) 

client.on('message', (topic, message) => { 
	console.log('Received: '+ topic + ": " + message);
});

client.on('connect', () => { 
	console.log(`Publishing to ${aedes_port}`);
	client.publish(topicCoef, "0.02932",{retain: true});
	client.subscribe(topicCoef);
	client.subscribe(topicRPM);
	client.subscribe(topicVib);

	let dataCache = [];

    let submit = async () => {
    	for (var i = 0; i < dataCache.length; i++) {
			client.publish(topicRPM, dataCache[i].rpm,{retain: true});
			client.publish(topicVib, dataCache[i].vib,{retain: true});
			await sleep(100);
    	}
    	process.exit(0);
    };

	fs.createReadStream(path.resolve(__dirname, 'testdata.csv'))
    	.pipe(csv.parse({ headers: true }))
    	.on('error', error => console.error(error))
    	.on('data', row => {
    		dataCache.push(row);
    	})
    	.on('end', rowCount => {
    		console.log(dataCache);	
    		submit();
    	});
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
