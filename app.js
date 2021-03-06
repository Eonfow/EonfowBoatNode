var http = require('http');
var express = require('express');
var path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(process.cwd() + '/view'));
var views = path.join(__dirname + '/view');

var irc = require("tmi.js");
var EventHandler = require("./eventHandler.js");

var options = require('./resources/config.json');
var statsJson = {client: {connected: false}, started: false, ended: false};

var client = new irc.client(options.client.aws);
var resolve = new EventHandler(client, options, statsJson);

function start(callback){
	
	if(!statsJson.client.connected){
		client.connect().then(function(data){
			resolve.connection.open(data[0], data[1], callback);
		});
	}
}

function end(callback){
	
	if(statsJson.client.connected){
		client.disconnect().then(function(data){
			resolve.connection.closed('Requested disconnect', callback);
		});
	}
}

client.on("chat", function(channel, user, message, self){
	resolve.chat.handler(channel, user, message, self);
});

app.get('/bot', function(req, res){
	res.sendFile(views + '/bot.html');
});

app.get('/bot/start', function(req, res){
	res.type('json');
	start(function(json){
		res.end(JSON.stringify(json));
	});
});

app.get('/bot/end', function(req, res){
	res.type('json');
	end(function(json){
		res.end(JSON.stringify(json));
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports.statsJson = statsJson;