var ConnectionHandler = function(client, options, statsJson){
    
    function joinChannles(){
    	var joinedChannels = [];
    	options.channels.forEach(function(name) {
    		client.join(name);
    		joinedChannels.push(name);
    	});
    	
    	return joinedChannels;
    }
    
    this.open = function (address, port, callback) {
        statsJson.client = {
            connected: true, 
            reason: 'none', 
            server: address, 
            port: port
        };
        
        statsJson.started = true;
        statsJson.channels = joinChannles();
        
        callback(statsJson);
	};
	
	this.closed = function (reason, callback) {
	    statsJson.client = {
            connected: false, 
            reason: reason, 
            server: 'none', 
            port: 'none'
        };
		
		statsJson.ended = true;
    	statsJson.channels = ['none'];
    	
    	callback(statsJson);
    };
    
};

module.exports = ConnectionHandler;