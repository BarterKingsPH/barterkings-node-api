var itemModel = require('../models/items');


exports.getItems = function(req, res){
    var response = {};

    itemModel.find({}, function(err, data){
        if(err){
            response = { 'error' : true, 'message' : 'Error fetching data.' } ;
        } else{
            response = { 'error' : false, 'message' : data }
        }

        res.json(response);
    })
}

exports.createItem = function(req, res){
    var response = {};

    var db = new itemModel();
    var itemName = req.body.itemName;
    var itemOwnerId = req.body.itemOwnerId;
    var itemValue = req.body.itemValue;
    var itemTags = req.body.itemTags;

    db.itemName =  itemName;
    db.itemOwnerId = req.session.userId;
    db.itemValue = itemValue;
    db.itemTags = itemTags;

    db.save(function(err){
        if(err){
            response = { 'error' : true, 'message' : 'Error adding an item.' };
        }else{
            response = { 'error' : false, 'message' : 'Item added.' };
        }

        res.json(response);
    });
}

exports.getItemsById = function(req, res){

    var response = {};
    var id = req.params.id;

    itemModel.findById(id, function(err, data){
        if (err) {
            response = {  'error' : true, 'message' : 'Error fetching item.' }
        }else{
            response = { 'error' : false, 'message' : data }
        };

        res.json(response);
    });

}

exports.updateItemById = function(req, res){

    var response = {};
    var id = req.params.id;
    var name = req.body.name;
    var value = req.body.value;
    var tags = req.body.tags;

    itemModel.findById(id, function(err, data){
        if (err) {
            response = { 'error' : true, 'message' : 'Error fetching item.' };
        }else{

            if (name) {
                data.itemName = name;
            };

            if (value) {
                data.itemValue = value;
            };

            if (tags) {
                data.itemTags = tags;
            };

            data.save(function(err){
                if (err) {
                    response = { 'error' : true, 'message' : 'Error updating item.' };
                }else{
                    response = { 'error' : false, 'message' : 'Item has been updated.' }
                };

                res.json(response);
            });

        };
    });

}

exports.deleteItemById = function(req, res){

    var response = {};
    var id = req.params.id;

    itemModel.findById(id, function(err, data){

        if (err) {
            response = { 'error' : true, 'message' : 'Error fetching data.' }
        }else {
            itemModel.remove({'_id' : id}, function(err){
                if (err) {
                    response = { 'error' : true, 'message' : 'Error deleting item.' }
                }else{
                    response = { 'error': false, 'message' : 'Item associated with '+id+' has been deleted.' }
                };

                res.json(response);
            });
            
        };

    });

}
