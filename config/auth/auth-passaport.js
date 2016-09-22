/**
 * Created by wilker_j on 19/09/2016.
 */
const util = require('../../app/util');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const Token = require('../../app/model/token');
const Usuario = require('../../app/model/usuario');
const Client = require('../../app/model/client');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    Usuario.findOne({ _id: id }, function (err, user) {
        done(err, user);
    });
});

passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
        var params = { id: clientId};
        if (clientSecret != null) {
            params.secret = clientSecret;
        }
        Client.findOne(params, function (err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            return done(null, client._doc);
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, callback) {
        Token.findOne({value: accessToken }, function (err, token) {
            if (err) {
                return callback(err);
            }
            if (!token) {
                return callback(null, false);
            }

            Usuario.findOne({ _id: token.userId }, function (err, user) {
                if (err) {
                    return callback(err);
                }
                if (!user) {
                    return callback(null, false);
                }
                callback(null, user, { scope: '*' });
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate(['bearer'], { session : false });