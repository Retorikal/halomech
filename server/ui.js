
const express = require('express'); 
const path = require('path');

// Init app
const app = express();
app.use(express.json());
app.use(express.static("public"));

// init root
app.get('/', function(req,res){ 
	res.sendFile(path.join(__dirname+'/ui/index.html')); 
	console.log(crypt.cache);
});