/**
 * Created by wilker_j on 13/09/2016.
 */
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const morgan = require('morgan');

const env = process.env.NODE_ENV || 'development';

module.exports = function (app) {

    app.use(compression({
        threshold: 512
    }));

    app.use(cors());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(methodOverride(function (req) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));

    if (env === 'development') {
        app.locals.pretty = true;
    }

    // logs
    app.use(morgan('combined'))

    app.use(passport.initialize());
    app.use(passport.session());

    require('./auth/auth-passaport');

}