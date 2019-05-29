/**
 *  Helpers Methods
 */

 // Dependencies
var helpers = {};
var crypto = require('crypto');
var config = require('./config');

// Create a hash function 
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0 ){
        var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
}

// Create a JSON Parse method
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    } catch(e){
        return {};
    }
}





module.exports = helpers;
