/**
 *
 * @type {*|Mongoose}
 */

let mongoose = require('mongoose');
let Schema =  mongoose.Schema;
const PhotoSchema = require('../models/photo').PhotoSchema;
const RepairList = require('../models/repair').Schema;

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
        repairsHistory: [{type: Schema.Types.ObjectId, ref: 'RepairList'}],
        //repairsHistory: [RepairList],

        clientId: {type: Schema.Types.ObjectId, ref: 'Client'},

        created_at: Date,
        updated_at: Date
    }
);


const VehicleModel = mongoose.model('Vehicle', VehicleSchema);

let veh = new VehicleModel({});
console.log('veh',veh);
module.exports = VehicleModel;
module.exports.Schema = VehicleSchema;