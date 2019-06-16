/**
 *
 * @type {*|Mongoose}
 */

let mongoose = require('mongoose');
let Schema =  mongoose.Schema;
const RepairListSchema = require('./repairList').Schema;
const MoreVehicleData = require('../moreVehicleData.model').Schema;

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

        // profilePhoto: PhotoSchema,
        //repairsHistory: [{type: Schema.Types.ObjectId, ref: 'RepairList'}],
        moreVehicleData: MoreVehicleData,
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