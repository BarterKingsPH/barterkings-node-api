var mongoose = require('mongoose');
mongoose.connect('mongodb://barterkings:barterkings@ds023560.mlab.com:23560/barterkings');

module.exports = mongoose;

