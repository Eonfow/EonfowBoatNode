var ChatHandler = require("./chatHandler.js");

var EventHandler = function(client, options){
	this.chat = new ChatHandler(client, options);
};

module.exports = EventHandler;