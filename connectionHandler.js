var ConnectionHandler = function(client, options, statsJson){
    
    function joinChannles(){
    	var joinedChannels = [];
    	options.channels.forEach(function(name) {
    		client.join(name);
    		joinedChannels.push(name);
    	});
    	
    	return joinedChannels;
    }
    
    this.open = function (address, port) {
        statsJson.client = {
            connected: true, 
            reason: 'none', 
            server: address, 
            port: port
        };
        
        statsJson.started = true;
        statsJson.channels = joinChannles();
	};
	
	this.closed = function (reason) {
	    statsJson.client = {
            connected: false, 
            reason: reason, 
            server: 'none', 
            port: 'none'
        };
		
		statsJson.ended = true;
    	statsJson.channels = ['none'];
    };
    
};

module.exports = ConnectionHandler;