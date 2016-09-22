/**
 * Created by wilker_j on 21/09/2016.
 */
var models = require('./app/model');
const mongoose = require('mongoose');
const config = require('./config');

var options = { server: { socketOptions: { keepAlive: 1 } } };
mongoose.connect(config.db, options).connection;

models.Client.create({
    id: 'client_id',
    secret: '12345',
    name: 'name client_id'
}, function() {

    models.Usuario.create({
        nome: 'teste',
        email: 'teste@teste.com',
        senha: '123',
    }, function() {
        process.exit();
    });

});





