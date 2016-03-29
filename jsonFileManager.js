var fs = require("fs");

function writeJson(filePath, obj){
	fs.writeFile(filePath, JSON.stringify(obj, null, 4), function (err) {
		  if (err){
			  return err;
		  }
	});
}

function readJson(path){
	var jsonContent = require(path);
	
	return jsonContent;
}

var JSONFile = function(){
	this.readJson = readJson;
	this.writeJson = writeJson;
};

module.exports = JSONFile;