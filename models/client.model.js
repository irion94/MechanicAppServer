/**
 * MODEL
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const VehicleSchema = require('./vehicle.model').Schema;

const ClientSchema = new Schema(
    {
        pelneNazwiskoLubNazwaWlascicielaPojazdu: String,
        imieWlascicielaPojazdu: String,
        nazwiskoWlascicielaPojazdu: String,
        nazwaWlascicielaPojazdu: String,
        numerPESELLubREGONWlascicielaPojazdu: String,
        kodPocztowyWlascicielaPojazdu: String,
        miejscowoscWlascicielaPojazdu: String,
        gminaWlascicielaPojazdu: String,
        ulicaWlascicielaPojazdu: String,
        nrDomuWlascicielaPojazdu: String,
        nrMieszkaniaWlascicielaPojazdu: String,

        phoneNumber: String,
        email: String,

         vehicleList: [{type: Schema.Types.ObjectId, ref: 'Vehicle'}],
        //vehicleList: [{VehicleSchema}],

        userId: [{type: Schema.Types.ObjectId, ref: 'User'}],
        ctreated_at: Date,
        updated_at: Date
    }
);

const ClientModel = mongoose.model('Client', ClientSchema);
module.exports = ClientModel;
module.exports.Schema = ClientSchema;