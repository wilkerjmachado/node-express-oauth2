/**
 * Created by wilker_j on 19/09/2016.
 */
const oauth2orize = require('oauth2orize');
const passport = require('passport');
const Token = require('../../app/model/token');
const Usuario = require('../../app/model/usuario');
const Client = require('../../app/model/client');
const util = require('../../app/util');

var server = oauth2orize.createServer();

server.serializeClient(function(client, callback) {
    return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
    Client.findOne({ _id: id }, function (err, client) {
        if (err) { return callback(err); }
        return callback(null, client);
    });
});

server.grant(oauth2orize.grant.token(function(client, user, ares, done) {

    var token = new Token({
        value: util.uuid(256),
        clientId: client.id,
        userId: user._id
    });

    token.save(function (err, token) {
        if (err) { return done(err); }
        done(null, token);
    });
}));

server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {

    var params = { id: client.id};
    if (client.secret != null) {
        params.secret = client.secret;
    }

    Client.findOne(params, function (err, localClient) {
        if (err) {
            return done(err);
        }
        if(localClient === null) {
            return done(null, false);
        }
        Usuario.authenticate(username, password, function(err, user) {
            if (err) { return done(err); }
            if(user === null) {
                return done(null, false);
            }
            //Everything validated, return the token
            var token = new Token({
                value: util.uuid(256),
                clientId: localClient._doc.id,
                userId: user._doc._id
            });

            token.save(function (err, token) {
                if (err) { return done(err); }
                done(null, token);
            });
        });
    });
}));

exports.authorization = [
    server.authorization(function(clientId, redirectUri, callback) {

        Client.findOne({ id: clientId }, function (err, client) {
            if (err) {
                return callback(err);
            }

            return callback(null, client, redirectUri);
        });
    }),
    function(req, res){
        res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    }
]

exports.decision = [
    server.decision()
]

exports.token = [
    passport.authenticate(['oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
]