/**
 * MODEL
 * @type {Mongoose|*}
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const DocumentOwnerSchema = new Schema(
    {
        pelneNazwiskoLubNazwaPosiadaczaDowoduRejestracyjneg: String,
        imiePosiadaczaDowoduRejestracyjnego: String,
        nazwiskoPosiadaczaDowoduRejestracyjnego: String,
        nazwaPosiadaczaDowoduRejestracyj: String,
        numerPESELLubREGONPosiadaczaDowoduRejestracyjnego: String,
        kodPocztowyPosiadaczaDowoduRejestracyjnego: String,
        miejscowoscPosiadaczaDowoduRejestracyjnego: String,
        gminaPosiadaczaDowoduRejestracyjnego: String,
        ulicaPosiadaczaDowoduRejestracyjnego: String,
        nrDomuPosiadaczaDowoduRejestracyjnego: String,
        nrMieszkaniaPosiadaczaDowoduRejestracyjneg: String,

        created_at: Date,
        updated_at: Date
    }
);

const DocumentOwner = mongoose.model('DocumentOwner', DocumentOwnerSchema);
module.exports = DocumentOwner;
module.exports.Schema = DocumentOwnerSchema;