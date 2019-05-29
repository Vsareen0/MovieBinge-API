/**
 *  Request Handlers
 */

 // Dependencies
 var _data = require('./data');
 var helpers = require('./helpers'); 

// Define the handlers
var handlers = {};

// Define the user handle  
handlers.users = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback);
    } else {
        callback(405);
    }
}

// Container for user submethods
handlers._users = {};

// Users Post Handler
handlers._users.post = function(data,callback){
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var email = typeof(data.payload.email) == 'string' && data.payload.email.length > 0 ? data.payload.email : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    
    if(firstName && lastName && phone && email && password && tosAgreement){
        _data.read('users',lastName+phone,function(err,data){
            if(err){
                var hashedPassword = helpers.hash(password);

                // Create a  user object
                var userObject = {
                    'firstName' : firstName,
                    'lastName' : lastName,
                    'phone' : phone,
                    'email' : email,
                    'password' : hashedPassword,
                    'tosAgreement' : tosAgreement
                }

                _data.create('users',lastName+phone,userObject,function(err){
                    if(!err){
                        callback(200);
                    } else {
                        callback(500, {'Error' : 'Could not create the new user'});
                    }
                });
            } else {
                console.log(err);
                callback(400, {'Error' : 'A user with that id already exist'});
            }
        });
    } else {
        callback(500, {'Error' : ' Missing required fields'});
    }
}

// Users Get Handler
handlers._users.get = function(data,callback){
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim()  : false;
    var lastName = typeof(data.queryStringObject.lastName) == 'string' && data.queryStringObject.lastName.trim().length > 0 ? data.queryStringObject.lastName : false; 

    if(phone && lastName) {
        _data.read('users',lastName+phone,function(err,data){
            if(!err && data){
                // Remove the hashPassword from the user object before returning returning it to the request
                delete data.hashedPassword;
                callback(200,data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400,{'Error' : 'Missing Required Fields '});
    } 
}

// Users Put Handler
handlers._users.put = function(data,callback){
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var email = typeof(data.payload.email) == 'string' && data.payload.email.length > 0 ? data.payload.email : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
   
    if(phone && lastName){
        if(firstName || email || password){
            _data.read('users',lastName+phone,function(err,data){
                if(!err && data){
                    if(firstName){
                        data.firstName = firstName;
                    }
                    if(email){
                        data.email = email;
                    }
                    if(password){
                        data.password = helpers.parseJsonToObject(password);
                    }

                    // Store the new updates
                    _data.update('users',lastName+phone,data,function(err){
                        if(!err){
                            callback(200);
                        } else {
                            callback(500,{'Error' : 'Could not update the user'});
                        }
                    });
                } else {
                    callback(400, {'Error' : 'The specified user does not exist'});
                }
            });
        } else {
            callback(400,{'Error' : 'Missing fields to update'});
        } 
    } else {
        callback(400,{'Error' : 'Missing Required Fields'})
    }
}

// Users Delete Handler
handlers._users.delete = function(data,callback){
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    
    if(phone && lastName){
        _data.read('users',lastName+phone,function(err,data){
            if(!err && data){
              
                // Delete the record
                _data.delete('users',lastName+phone,function(err){
                    if(!err){
                        callback(200);
                    } else {
                        callback(500,{'Error' : 'Could not update the user'});
                    }
                });
            } else {
                callback(400, {'Error' : 'The specified user does not exist'});
            }
        });
    } else {
        callback(400,{'Error' : 'Missing Required Fields'})
    }

}

// Sample handler
handlers.sample = function(data,callback){
	callback(406,{'name' : 'sample handler'});
};

// Not Found Handler
handlers.notFound = function(data,callback){
	callback(404);
};


// Export the handlers
module.exports = handlers;