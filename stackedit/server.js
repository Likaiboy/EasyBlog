var cluster = require('cluster');
var http = require('http');
var https = require('https');
var app = require('./app');

var count = require('os').cpus().length;

if(!process.env.NO_CLUSTER && cluster.isMaster) {
	for(var i = 0; i < count; i++) {
		cluster.fork();
	}
	cluster.on('exit', function() {
		console.log('Worker died. Spawning a new process...');
		cluster.fork();
	});
}
else {
	var port = process.env.PORT || 3000;
	
	var httpServer = http.createServer(app);
	httpServer.listen(port, null, function() {
		console.log('HTTP server started: http://localhost:' + port);
	});
}

