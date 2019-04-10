/**
 * MODEL
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const Personalities = require('./personalities.model').Schema;
const VehicleSchema = require('./vehicle.model').Schema;


const DocumentSchema = new Schema(
    {
        personalities: {},
        vehicle:{},
        created_at: Date,
        updated_at: Date
    }
);

const Document = mongoose.model('Document', DocumentSchema);
module.exports = Document;
module.exports.Schema = DocumentSchema;