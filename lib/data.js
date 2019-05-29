/*
*
* Library for Performing CRUD Ops
*/
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

// Container for the module to be exported
var lib = {};

 lib.baseDir = path.join(__dirname,'/../data/');

// Write data to file
lib.create = function(dir,file,data,callback){
	// open the file for writing
	fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
		if(!err && fileDescriptor){
			// COnvert the data to string
			var stringData = JSON.stringify(data);

			// Write to file and close it
			fs.writeFile(fileDescriptor,stringData,function(err){
				if(!err){
					fs.close(fileDescriptor,function(err){
						if(!err){
							callback(false);
						} else {
							callback("Error closing the file");
						}
					});
				} else {
					callback("Error writing to file");
				}
			});
		} else {
			callback(err);
		}
	});
};

// Read a file
lib.read = function(dir,file,callback){
	fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
		if(!err && data){
			var parsedData = helpers.parseJsonToObject(data);
			callback(false,parsedData);
		} else {
			callback(err,data);
		}
		
	});
}; 

// Update the file
lib.update = function(dir,file,data,callback){
	// open the file for writing
	fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
		if(!err && fileDescriptor){	
			var stringData = JSON.stringify(data);

			fs.truncate(fileDescriptor,function(err){
				if(!err){

					fs.writeFile(fileDescriptor,stringData,function(err){
						if(!err){
							fs.close(fileDescriptor,function(err){
								if(!err){
									callback(false);
								} else {
									callback("Error closing the file");
								}
							});
						} else{
							callback("Error writing to existing file");
						}
					});
				} else {
					callback("Error truncating file");
				}
			});
		} else {
			callback("Could not open the file");
		}
	});
};


// Delete a record
lib.delete = function(dir,file,callback){
	fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
		if(!err){
			callback(false);
		} else {
			callback('Error Deleting file');
		}
	});	
};


module.exports = lib;