let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const PhotoSchema = new Schema(
    {
        tytul: String,
        link: String,
        created_at: Date,
        updated_at: Date
    }
);

module.exports.PhotoSchema = PhotoSchema;
module.exports.Photo = mongoose.model('Photo', PhotoSchema);