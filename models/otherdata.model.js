/**
 * MODEL
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


const OtherDataSchema = new Schema(
    {
        base64: String,
        last_oil_change: Date,
        inspection: Date,
        created_at: Date,
        updated_at: Date
    },
    { _id : false }
);

const OtherData = mongoose.model('OtherData', OtherDataSchema);
module.exports = OtherData;
module.exports.Schema = OtherDataSchema;