/**
 * Created by wilker_j on 14/09/2016.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    value: {type: String, required : true, unique: true},
    userId  : { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required : true },
    clientId: {type: String, required : true},
    dataCriacao: { type: Date }
});

TokenSchema.pre('save', function(next) {
    this.dataCriacao = new Date();
    next();
});

var Token = mongoose.model('Token', TokenSchema);
module.exports = Token;
