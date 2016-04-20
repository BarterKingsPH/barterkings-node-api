var mongoose = require('./connect');

var mongoSchema = mongoose.Schema;

var itemSchema = {
    'itemName' : { type: String, require: true }, 
    'itemOwnerId' : { type: mongoSchema.Types.ObjectId, require: true },
    'itemValue' : { type: Number, require: true },
    'itemTags' : [String],
    'itemDateAdded' : { type : Date, default : Date.now }
}

module.exports = mongoose.model('items', itemSchema);
