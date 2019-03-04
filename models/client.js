/**
 * MODEL
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const VehicleSchema = require('../models/vehicle').Schema;

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

        numerTelefonu: String,
        email: String,

         vehicleList: [{type: Schema.Types.ObjectId, ref: 'Vehicle'}],
        //vehicleList: [{VehicleSchema}],

        userId: [{type: Schema.Types.ObjectId, ref: 'User'}],
        ctreated_at: Date,
        updated_at: Date
    }
);

const Client = mongoose.model('Client', ClientSchema);
module.exports = Client;
module.exports.Schema = ClientSchema;