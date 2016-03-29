var jsonFileManager = require('./jsonFileManager');
var jsonDAO = new jsonFileManager();
var moment = require('moment');

var options = require('./resources/config.json');
var customCmds = require('./resources/customCommands.json');
var blackListed = require('./resources/blackListed.json');

var lastCustomCmd;
var lastCmd;

var severityOptions = options.severity;
var permittedUsers = options.permitted;
var cooldown = options.cooldown;

var client;

var TRIGGER = '!';

function testBlackListed(message){
	var result = {
			is : false,
			severity : 4,
			time : 0
	};
	
	for(var word in blackListed){
		if (blackListed.hasOwnProperty(word)) {
			var severity = blackListed[word];
			
			var punish = message.indexOf(word) > -1;
			if(punish){
				result.is = true;
				result.severity = severity;
				result.time = severityOptions[severity];
				
				return result;
			}
		}		
	}
	return result;
}

function testCustomCommand(channel, user, message){
	var result = {
			is : false,
			answer : ""
	};
	
	for(var word in customCmds){
		if (customCmds.hasOwnProperty(word)) {
			var answer = customCmds[word];
			word = word.replace("{TRIGGER}", TRIGGER);
			answer = answer.replace("{USER}", user);
			var meme = message.indexOf(word) > -1;
			if(meme){
				result.is = true;
				result.answer = answer;
				
				return result;
			}
		}		
	}
	return result;
}

function testCommand(channel, user, message){
	var msg = message.split(" ");

	if(user.mod){
		if(msg[0] === (TRIGGER+'clear')){
			client.clear(channel);
			lastCmd = moment();
			return;
		}else if(msg[0] === (TRIGGER+'commercial')){
			for(var x = 30; x <= 180; x+=30){
				
				if(msg[1] == x){
					client.commercial(channel, msg[1]).then(
							function(result){
								lastCmd = moment();
								return;
							},
							function(error){
								client.say(channel, error);
								return;
							}
					);
					break;
				}else if(x === 180){
					client.say(channel, 'Accepted values for commercials are {30, 60, 90, 120, 150, 180}');
					return;
				}
			}
		}
	}
	
	if(permittedUsers.indexOf(user['display-name']) !== -1){
		if(msg[0] === (TRIGGER+'addPermit')){
			if(permittedUsers.indexOf(msg[1]) === -1){
				permittedUsers.push(msg[1]);
				
				options.permitted = permittedUsers;
				jsonDAO.writeJson('./resources/config.json', options);
				client.say(channel, msg[1] + " is now permitted.");
				lastCmd = moment();
			}else{
				client.say(channel, msg[1] + " is already permitted.");
			}
			
			return;
		}
	}
}

function handleChat(channel, user, message, self){
	var blackListedResp = testBlackListed(message);
	var customCmdResp = testCustomCommand(channel.substr(1), user['display-name'], message);
	
	if(!self){
		if(blackListedResp.is){
			switch (blackListedResp.severity){
				case 0:
					if(blackListedResp.time == 'ban'){
						client.ban(channel.substr(1), user['display-name']);
					}else{
						client.timeout(channel.substr(1), user['display-name'], blackListedResp.time);
					}
					break;
				default:
					client.timeout(channel.substr(1), user['display-name'], blackListedResp.time);
					break;
			}
		}else if(customCmdResp.is && moment().diff(lastCustomCmd, 's') > cooldown){
			client.say(channel.substr(1), customCmdResp.answer);
			lastCustomCmd = moment();
		}else if(moment().diff(lastCmd, 's') > cooldown){
			testCommand(channel.substr(1), user, message);
		}
	}
}

var ChatHandler = function(clientUsed, options){
	client = clientUsed;
	
	lastCmd = moment().set({'year': 2016, 'month': 2, 'date': 25, 'hour': 23, 'minute': 30});
	lastCustomCmd = moment().set({'year': 2016, 'month': 2, 'date': 25, 'hour': 23, 'minute': 30});
	
	this.handler = handleChat;
};

module.exports = ChatHandler;