const Usuario = require('../model/usuario');
const Token = require('../model/token');
const util = require('../util');

exports.inserir = function (req, res) {
    const usuario = new Usuario(req.body);
    usuario.save(function(err){
        util.respond(err, usuario, res);
    })
}

