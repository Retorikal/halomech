/*
 * MQTT Client that connects and logs accepted informations to database.
 */

const influx = require('influx');
const mqtt = require('mqtt');

// Initialize connection to Database
const motorDB = new influx.InfluxDB({
	host: 'localhost',
	database: 'iot_motor',
	schema: [
	{
		measurement: ['vib', 'rpm'],
		tags: ['host'],
		fields: {
			data: influx.FieldType.FLOAT
		}
	}
	]
});

const motorCache = {};

// Initialize connection to MQTT Server
const mqttDBPort = 1881;
const topicRPM = "esp32/+/rpm";
const topicVib = "esp32/+/vib";
const topicMileage = "esp32/+/mil";
const topicCoef = "esp32/+/coef";
const mqttClient = mqtt.connect(`mqtt://localhost:${mqttDBPort}`);

mqttClient.on('connect', () => {
	console.log("Logger connected to database!");
	mqttClient.subscribe(topicRPM);
	mqttClient.subscribe(topicVib);
	mqttClient.subscribe(topicMileage);
	mqttClient.subscribe(topicCoef);
});

mqttClient.on('message', (topic, message) => {
	let topic_lv = topic.split("/");
	let topic_root = topic_lv[0];
	let host = topic_lv[1];
	let measurement = topic_lv[2];

	if(topic_root === "esp32"){

		// Coef accepted initializes mileage calculation
		if (measurement === 'coef'){
			motorCache[host] = {};
			motorCache[host].coef = parseFloat(message);

			let querystr = `
				select data from mil
				where host = '${host}'
				order by time desc
				limit 1`;

			motorDB.query(querystr).then(result => {
				motorCache[host].mil = result.length > 0 ? result[0].data : 0;
				motorCache[host].ok = true;
			}).catch(err => {
				console.log(err);
			})
		}

		else if (measurement === 'rpm' && (host in motorCache) && motorCache[host].ok){
			let dMile = parseFloat(message) * motorCache[host].coef;
			motorCache[host].mil += dMile; 

			motorDB.writePoints([{
			    measurement: measurement,
			    tags: { host: host },
			    fields: { data: message },
			}]);

			motorDB.writePoints([{
			    measurement: "mil",
			    tags: { host: host },
			    fields: { data: motorCache[host].mil },
			}]);
		}

		else{
			motorDB.writePoints([{
			    measurement: measurement,
			    tags: { host: host },
			    fields: { data: message },
			}]);
		}
	}
});