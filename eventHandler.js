var ChatHandler = require("./chatHandler.js");
var ConnectionHandler = require("./connectionHandler.js");

var EventHandler = function(client, options, statsJson){
	this.chat = new ChatHandler(client, options);
	this.connection = new ConnectionHandler(client, options, statsJson);
};

module.exports = EventHandler;