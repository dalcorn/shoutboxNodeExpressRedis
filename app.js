/**
 * Module dependencies.
 */
var entries = require('./routes/entries');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var register = require('./routes/register');
var messages = require('./lib/messages');
var login = require('./routes/login');
var user = require('./lib/middleware/user');
var validate = require('./lib/middleware/validate');
var page = require('./lib/middleware/page');
var Entry = require('./lib/entry');
var api = require('./routes/api');

var app = express();

// all environments
app.use(express.bodyParser());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use('/api', api.auth);
app.use(user);
app.use(messages);
app.use(app.router);




app.use(express.static(__dirname + '/public'));
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.use(routes.notfound);
app.use(routes.error);

app.get('/post', entries.form);
app.post('/post', validate.required('entry[title]'),
    validate.lengthAbove('entry[title]', 4),
    entries.submit);
app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/:page?', page(Entry.count, 5), entries.list);
app.get('/api/user/:id', api.user);
app.post('/api/entry', entries.submit);
app.get('/api/entries/:page?', page(Entry.count), api.entries);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
