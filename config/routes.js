/**
 * Created by wilker_j on 12/09/2016.
 */
const express = require('express');
const passport = require('passport');
const auth = require('./auth');
const controller = require('../app/controller');

module.exports = function (app) {

    var router = express.Router();

    router.get('/', auth.authPassaport.isAuthenticated, function(req, res) {
        res.json({ message: 'You are running dangerously low on beer!' });
    });

    router.route('/oauth/token').post(auth.oauth2.token);

    app.use('/api', router);

}