/**
 * Created by wilker_j on 19/09/2016.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ClientSchema = new Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    secret: { type: String, required: true }
});

var Client = mongoose.model('Client', ClientSchema);
module.exports = Client;