const influx = require('influx');
var data = [];
var mildata = [];
var currentmil = 0;

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

var querystr = `
	select time,data from rpm
	where host = 'motor_tes'
	order by time desc
	limit 500`;

motorDB.query(querystr).then(result => {
	data = result.reverse();

	for (var i = 0; i < data.length; i++) {
		currentmil += data[i].data * 0.02932;
		console.log(data[i].data, currentmil);
		
		motorDB.writePoints([{
		    measurement: 'mil',
		    tags: { host: 'motor_tes' },
		    fields: { data: currentmil },
		}]);
	}

	console.log(mildata);
}).catch(err => {
	console.log(err);
})


//select time,data from rpm where host = 'motor_tes' order by time desc limit 500