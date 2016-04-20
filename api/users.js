var userModel = require('../models/users');
var bcrypt = require('bcrypt');

exports.getUsers = function(req, res){
    var response = {};

    userModel.find({}, function(err, data){
        if(err) {
            response = {'error' : true, 'message' : 'Error fetching user.'}
        }else {
            response = {'error' : false, 'message' : data}
        }

        res.json(response);
    });
}

exports.createUser = function(req, res){
    var response = {};
    var db = new userModel();
    var email = req.body.email;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(10);

    db.userEmail = email;
    db.userPassword = bcrypt.hashSync(password, salt); 
    db.userPrivilege = req.body.privilege;

    db.save(function(err, data){
        if(err) {
            response = { 'error' : true, 'message' : 'Error adding user.'};
        }else{
            response = { 'error' : false, 'message' : 'User has been added.' }
        }

        res.json(response);
    });
}

exports.loginUser = function (req, res){
    var response = {};
    var db = new userModel();
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;

    userModel.findOne( { userEmail : email } , function(err, data){

        if (err) {
            response = { 'error' : true, 'message' : 'Error fetching user.' }
        } else{

            bcrypt.compare(password, data.userPassword, function(err, isMatch){

                if (err) {
                    response = { 'error' : true, 'message' : 'Authentication error.' };
                }else{

                    if (isMatch) {
                        req.session.auth = true;
                        req.session.userId = data._id;
                        req.session.email = data.userEmail;
                        req.session.userPrivilege = data.userPrivilege;
                        response = { 'error' : false, 'message' : 'User authenticated'};
                    }else{
                        response = { 'error' : true, 'message' : 'Incorrect username or password.' }
                    };

                };

                res.json(response);

            });

        };

    });

}

exports.logoutUser = function(req, res){
    var response = {};

    req.session.destroy(function(err){
        if (err) {
            response = { 'error' : true, 'message' : 'Error in logging out.' }
        }else{
            response = { 'error' : false, 'message' : 'Logout successful.' }
        };
        res.json(response);
    });

}

exports.getUserById = function(req, res){
    var response = {};
    var id = req.params.id;
    
    userModel.findById(id, function(err, data){
        if(err){
            response = { 'error' : true, 'message' : 'Error fetching user.' }
        } else{

            var userdata = data;
            delete userdata.userPassword;

            response = { 'error' : false, 'message' : userdata }
        }

        res.json(response);
    });

}

exports.updateUserById = function(req, res){
    var response = {};
    var id = req.params.id;
    var email = req.body.email;
    var password = req.body.password;
    var privilege = req.body.privilege;
    var salt = bcrypt.genSaltSync(10);

    userModel.findById(id, function(err, data){
        if(err) {
            response = { 'error' : true, 'message' : 'Error fetching user.' } ;
        }else{
            if(email !== undefined){
                data.userEmail = email;
            } 
            if(password !== undefined){
                data.userPassword = bcrypt.hashSync(password, salt); 
            }
            if(privilege !== undefined){
                data.userPrivilege = privilege;
            }

            data.save(function(err){
                if(err){
                    response = { 'error' : true, 'message' : 'Error updating user' };
                } else {
                    response = { 'error' : false, 'message' : 'User is updated.' };
                }

                res.json(response);
            });
        }
    });
}

exports.deleteUserById = function(req, res){
    var response = {};
    var id = req.params.id;

    userModel.findById(id, function(err, data){
        if(err) {
            response = { 'error' : true, 'message' : 'Error fetching user.' } ;
        }else {
        
            userModel.remove({ _id : id }, function(err){
                if(err){
                    response = { 'error' : true, 'message' : 'Error deleting user.' };
                } else{
                    response = { 'error' : false, 'message' : 'User associated with ' + id + ' is deleted.' };
                }

                res.json(response);
            });

        }

    });
};
