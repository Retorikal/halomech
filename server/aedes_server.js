/*
 * Aedes server node. Receives data from IOT sensor and sends them to client node.
 */

const aedes = require('aedes')();
const net = require('net'); 
const ws = require('websocket-stream');
const http = require('http'); 

// Create and start TCP IO
const initNetIOPort = (port, usage) => {
	let broker = net.createServer(aedes.handle) // All acc'ed data will be sent to aedes

	broker.listen(port, () => { 
		console.log(`MQTT via TCP for ${usage} connetction started on port ${port}`);
	})
}

// Create and start websocket IO,
const initWSIOPort = (port, usage) => {
	const httpServer = http.createServer() // websocket seems to need a http server. Dunno why.
	ws.createServer({ server: httpServer }, aedes.handle) // All data from ws will be sent to aedes

	httpServer.listen(port, () => { 
		console.log(`MQTT via ws for ${usage} connetction started on port ${port}`) 
	});
}

initNetIOPort(1880, "motor_d4e5ff4");
initNetIOPort(1881, "InfluxDB");
initWSIOPort(8883, "Client IO");

// Log accepted data to InfluxDB Server