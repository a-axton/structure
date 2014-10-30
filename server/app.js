'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    path = require('path');

var app = express();
var server = http.createServer(app);
var routes = require('./routes');


// configure express app
app.set('port', 9000);
app.use(bodyParser());

// mount static files for use on client side
app.use(express.static( path.join( __dirname, '../app') ));
app.use(express.static( path.join( __dirname, '../build') ));
app.use('/bower_components',  express.static( path.join( __dirname, '../bower_components' ) ));
app.use('/vendor',  express.static( path.join( __dirname, '../vendor' ) ));


app.get('/build-selector-list', routes.selectorList);
app.post('/edit-source', routes.editSource);
app.post('/get-source-from-selector', routes.getSource);

app.get('/edit', function(req, res){
    res.sendfile( path.join( __dirname, '../app/edit-page.html' ) );
});

// serve static index
app.get('/', function(req, res){
    res.sendfile( path.join( __dirname, '../app/index.html' ) );
});

server.listen(app.get('port'), function(){
    console.log('its go time');
});