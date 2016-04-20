var userModel = require('../models/users');
var bcrypt = require('bcrypt');

exports.getUsers = function(req, res){
    var response = {};
    userModel.find({}, function(err, data){
        if(err) {
            response = {'error' : true, 'message' : 'Error fetching data.'}
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
    db.userLevel = req.body.level;
    db.save(function(err, data){
        if(err) {
            response = { 'error' : true, 'message' : 'Error adding user.'};
        }else{
            response = { 'error' : false, 'message' : 'User has been added.' }
        }

        res.json(response);
    });
}

exports.verifyUser = function (req, res){
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
                        req.session.userId = data._id;
                        req.session.email = data.userEmail;
                        req.session.userLevel = data.userLevel;
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

exports.getUserById = function(req, res){
    var response = {};
    var id = req.params.id;
    
    userModel.findById(id, function(err, data){
        if(err){
            response = { 'error' : true, 'message' : 'Error fetching data.' }
        } else{
            response = { 'error' : false, 'message' : data }
        }

        res.json(response);
    });

}

exports.updateUserById = function(req, res){
    var response = {};
    var id = req.params.id;
    var email = req.body.email;
    var password = req.body.password;
    var level = req.body.level;
    var salt = bcrypt.genSaltSync(10);

    userModel.findById(id, function(err, data){
        if(err || data === null ) {
            response = { 'error' : true, 'message' : 'Error fetching data.' } ;
        }else{
            if(email !== undefined){
                data.userEmail = email;
            } 
            if(password !== undefined){
                data.userPassword = bcrypt.hashSync(password, salt); 
            }
            if(level !== undefined){
                data.userLevel = level;
            }

            data.save(function(err){
                if(err){
                    response = { 'error' : true, 'message' : 'Error updating data.' };
                } else {
                    response = { 'error' : false, 'message' : 'Data is updated.' };
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
            response = { 'error' : true, 'message' : 'Error fetching data.' } ;
        }else {
        
            userModel.remove({ _id : id }, function(err){
                if(err){
                    response = { 'error' : true, 'message' : 'Error deleting user.' };
                } else{
                    response = { 'error' : false, 'message' : 'Data associated with ' + id + ' is deleted.' };
                }

                res.json(response);
            });

        }

    });
};
