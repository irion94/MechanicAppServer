let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const PhotoSchema = require('../models/photo').PhotoSchema;

const RepairsSchema = new Schema(
    {
        tytul: String,
        opis: String,
        photos: [PhotoSchema],
        created_at: Date,
        updated_at: Date
    }
);
const Repair = mongoose.model('Repair', RepairsSchema);
module.exports = Repair;
module.exports.Schema = RepairsSchema;

