let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const PhotoSchema = require('../photo').Schama;

const PostSchema = new Schema(
    {
        title: String,
        description: String,
        photos: [String],
        created_by: {type: Schema.Types.ObjectId, ref: 'User'},
        created_at: Date,
        updated_at: Date
    }
);
const PostModel = mongoose.model('Repair', PostSchema);
module.exports = PostModel;
module.exports.Schema = PostSchema;

