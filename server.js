var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();

var connect = require('./models/connect');
var session = require('express-session');
var logger = require('express-logger');
var store = require('connect-mongo')(session);

var usersApi = require('./api/users');
var itemsApi = require('./api/items');

var privileges = require('./functions/privileges');

app.use(logger(
    { path : "./logfile.txt" }
));

app.use(session({
    secret: 'BarterKings_Web',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: new store( { mongooseConnection: connect.connection } )
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get('/', function(req, res){
    res.json({'error' : false, 'message' : 'API SERVER IS ALIVE'});
});

//User Routes

router.route('/users/logout')
    .get(privileges.checkUser, usersApi.logoutUser);

router.route('/users')
    .get(usersApi.getUsers)
    .post(usersApi.createUser)    

router.route('/users/:id')
    .get(usersApi.getUserById)
    .put(privileges.checkUser, usersApi.updateUserById)
    .delete(privileges.checkSuperAdmin, privileges.checkAdmin, usersApi.deleteUserById)

router.route('/users/login')
    .post(usersApi.loginUser);

//Item Routes
router.route('/items')
    .get(itemsApi.getItems)
    .post(itemsApi.createItem)

router.route('/items/:id')
    .get(itemsApi.getItemsById)
    .put(itemsApi.updateItemById)
    .delete(itemsApi.deleteItemById)

router.route('*', function(req, res){
    res.send(404);
});

app.use('/', router);

app.listen(5000);
console.log('Listening to PORT 5000');
