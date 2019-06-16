/**
 * MODEL
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const VehicleSchema = require('./vehicle.model').Schema;

const VehicleOwnerSchema = new Schema(
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

        ctreated_at: Date,
        updated_at: Date
    },
    { _id : false }
);

const VehicleOwner = mongoose.model('VehicleOwner', VehicleOwnerSchema);
module.exports = VehicleOwner;
module.exports.Schema = VehicleOwnerSchema;