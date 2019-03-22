let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const PhotoSchema = require('../models/photo').PhotoSchema;

const RepairsSchema = new Schema(
    {
        title: String,
        description: String,
        photos: [String]
    }
);
const Repair = mongoose.model('Repair', RepairsSchema);
module.exports = Repair;
module.exports.Schema = RepairsSchema;

