var http = require('http');
var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

var irc = require("tmi.js");
var EventHandler = require("./eventHandler.js");

var options = require('./resources/config.json');

var client = new irc.client(options.client.aws);
var resolve = new EventHandler(client, options);

var onConnected = false;
var statsJson = {};

function joinChannles(){
	var joinedChannels = [];
	options.channels.forEach(function(name) {
		client.join(name);
		joinedChannels.push(name);
	});
	
	return joinedChannels;
}

function start(callback){
	
	if(!onConnected){
		client.connect();
		
		client.on("connected", function (address, port) {
			statsJson.client = {server: address, port: port};
			statsJson.channels = joinChannles();
			
			callback(statsJson);
			onConnected = true;
		});
	}else{
		callback(statsJson);
	}
}

client.on("chat", function(channel, user, message, self){
	resolve.chat.handler(channel, user, message, self);
});

app.get('/bot/start', function(req, res){
	start(function(json){
		res.json(json);
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports.statsJson = statsJson;