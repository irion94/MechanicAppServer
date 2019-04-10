/**
 *
 * @type {*|Mongoose}
 */

let mongoose = require('mongoose');
let Schema =  mongoose.Schema;
const PhotoSchema = require('../models/photo').PhotoSchema;
const RepairListSchema = require('../models/repairList').Schema;

const VehicleSchema = new Schema(
    {
        markaPojazdu: String,
        modelPojazdu: String,
        numerRejestracyjnyPojazdu: String,
        numerIdentyfikacyjnyPojazdu: String,
        wersjaPojazdu: String,
        rokProdukcji: String,
        pojemnoscSilnikaCm3: String,
        maksymalnaMocNettoSilnikaKW: String,
        rodzajPaliwa: String,
        dataPierwszejRejestracjiPojazdu: String,

        profilePhoto: PhotoSchema,
        //repairsHistory: [{type: Schema.Types.ObjectId, ref: 'RepairList'}],
        repairsHistory: [RepairListSchema],
        clientId: {type: Schema.Types.ObjectId, ref: 'Client'},

        created_at: Date,
        updated_at: Date
    },
    {_id: false}
);


const VehicleModel = mongoose.model('Vehicle', VehicleSchema);
module.exports = VehicleModel;
module.exports.Schema = VehicleSchema;