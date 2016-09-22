/**
 * Created by wilkerjmachado on 31/08/16.
 */
const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const models = join(__dirname, 'app/model');

var app = express();
module.exports = app;

require('./config/express')(app);
require('./config/routes')(app);
require('./config/errors')(app);

connect()
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);

function listen () {
    if (app.get('env') === 'test') return;
    app.listen(config.port);
    console.log('> NODE_ENV:', app.settings.env);
    console.log('> Express app started on port ' + config.port);
}

function connect () {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    mongoose.Promise = global.Promise;
    return mongoose.connect(config.db, options).connection;
}