var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();

var connect = require('./models/connect');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var usersApi = require('./api/users');
var itemsApi = require('./api/items');

app.use(session({
    secret: 'BarterKings_Web',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: new MongoStore( { mongooseConnection: connect.connection } )
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get('/', function(req, res){
    res.json({'error' : false, 'message' : 'API SERVER IS ALIVE'});
});

//User Routes
router.route('/users')
    .get(usersApi.getUsers)
    .post(usersApi.createUser)    
router.route('/users/:id')
    .get(usersApi.getUserById)
    .put(usersApi.updateUserById)
    .delete(usersApi.deleteUserById)
router.route('/users/verify')
    .post(usersApi.verifyUser);
    
//Item Routes
router.route('/items')
    .get(itemsApi.getItems)
    .post(itemsApi.createItem)
router.route('/items/:id')
    .get(itemsApi.getItemsById)
    .put(itemsApi.updateItemById)
    .delete(itemsApi.deleteItemById)

app.use('/', router);

app.listen(5000);
console.log('Listening to PORT 5000');
