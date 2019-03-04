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


const Vehicle = mongoose.model('Vehicle', VehicleSchema);

let veh = new Vehicle({});
console.log('veh',veh);
module.exports = Vehicle;
module.exports.Schema = VehicleSchema;