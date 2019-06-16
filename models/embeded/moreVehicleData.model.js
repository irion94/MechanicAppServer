/**
 *
 * @type {*|Mongoose}
 */

let mongoose = require('mongoose');
let Schema =  mongoose.Schema;
const PhotoSchema = require('./photo').Schama;
const PostSchema = require('../embeded/document/post.model').Schema;

const MoreVehicleDataSchema = new Schema(
    {
        avatar: PhotoSchema,
        userPosts:[PostSchema],
        last_oil_change: Date,
        inspection: Date,
        created_at: Date,
        updated_at: Date

    },
    {_id: false}
);


const MoreVehicleData = mongoose.model('MoreVehicleData', MoreVehicleDataSchema);
module.exports = MoreVehicleData;
module.exports.Schema = MoreVehicleDataSchema;