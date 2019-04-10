/**
 * MODEL
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const VehicleSchema = require('./vehicle.model').Schema;

const PersonalitiesSchema = new Schema(
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

const Personalities = mongoose.model('Personalities', PersonalitiesSchema);
module.exports = Personalities;
module.exports.Schema = PersonalitiesSchema;