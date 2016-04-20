var mongoose = require('./connect');

var mongoSchema = mongoose.Schema;

var userSchema = {
    'userEmail' : { type: String, require: true, index: { unique: true } },
    'userPassword' : { type: String, require: true },
    'dateAdded' : { type : Date, default : Date.now }
};

module.exports = mongoose.model('users', userSchema);
