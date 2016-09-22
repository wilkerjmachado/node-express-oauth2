'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    nome: {type: String, required : [true, 'Nome é obrigatorio']},
    email: {type: String, required : [true, 'Email é obrigatorio']},
    senha: {type: String, required : [true, 'Senha é obrigatorio']},
    dataCriacao: Date,
    dataAtualizacao: Date
});

UsuarioSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.dataAtualizacao = currentDate;
    if (!this.dataCriacao){
        this.dataCriacao = currentDate;
    }
    next();
});

UsuarioSchema.path('email').validate(function (email, fn) {
    const Usuario = mongoose.model('Usuario');
    if (this.isNew || this.isModified('email')) {
        Usuario.find({ email: email }).exec(function (err, users) {
            fn(!err && users.length === 0);
        });
    } else fn(true);
}, 'Email já existente.');

UsuarioSchema.methods = {
    comparePassword : function (senha) {
        return this.senha === senha;
    }
}

UsuarioSchema.statics = {
    load: function (options, cb) {
        options.select = options.select || 'nome email';
        return this.findOne(options.criteria).select(options.select).exec(cb);
    },
    authenticate : function (email, senha, cb) {
        this.findOne({email: email}, function (err, usuario) {
            if (err) {
                return cb(500, 'Internal service error');
            }
            if (!usuario || !usuario.comparePassword(senha)){
                return cb(403, 'E-mail or password invalid');
            }
            return cb(err, usuario);
        });
    },
    getUser : function(email, password, cb) {
        Usuario.authenticate(email, password, function(err, user) {
            if (err || !user) return cb(err);
            cb(null, user);
        });
    }
};

var Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;
