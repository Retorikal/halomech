// HTML node. Serves webpage file to allow a client node.

const influx = require('influx');
const express = require('express'); 
const path = require('path');

// Init app
const app = express();
app.use(express.json());
app.use(express.static("public"));

// Initialize connection to Database
const motorDB = new influx.InfluxDB({
	host: 'localhost',
	database: 'iot_motor',
	schema: [
	{
		measurement: ['vib', 'rpm', 'mil'],
		tags: ['host'],
		fields: {
			data: influx.FieldType.FLOAT
		}
	}
	]
});

// Init root app
app.get('/', function(req,res){ 
	res.sendFile(path.join(__dirname+'/public/index.html')); 
});

app.post('/api/rpm', (req, res) => {
	console.log(`Requested rpm for ${req.body.motor}`);
	let querystr = `
		select time,data from rpm
		where host = 'motor_${req.body.motor}'
		order by time desc
		limit 500`;

	motorDB.query(querystr).then(result => {
		res.json(result)
	}).catch(err => {
		res.status(500).send(err.stack)
	})
})

app.post('/api/vib', (req, res) => {
	console.log(`Requested vib for ${req.body.motor}`);
	let querystr = `
		select time,data from vib
		where host = 'motor_${req.body.motor}'
		order by time desc
		limit 500`;

	motorDB.query(querystr).then(result => {
		res.json(result)
	}).catch(err => {
		res.status(500).send(err.stack)
	})
})

app.post('/api/mil', (req, res) => {
	console.log(`Requested mil for ${req.body.motor}`);
	let querystr = `
		select time,data from mil
		where host = 'motor_${req.body.motor}'
		order by time desc
		limit 500`;

	motorDB.query(querystr).then(result => {
		res.json(result)
	}).catch(err => {
		res.status(500).send(err.stack)
	})
})

// Listen
const http = require('http');
const server = http.createServer(app);
server.listen(3000, 'localhost', () => {console.log("Server is running..")});


/*
	curl --header "Content-Type: application/json" \
	--request POST \
	--data '{"motor":"tes"}' \
	http://localhost:3000/api/rpm
*/