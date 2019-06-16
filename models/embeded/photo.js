let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const PhotoSchema = new Schema(
    {
        title: String,
        path: String,
        created_at: Date,
    }
);

module.exports.Schama = PhotoSchema;
module.exports.Photo = mongoose.model('Photo', PhotoSchema);