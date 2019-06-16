let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const UserDataSchama = new Schema(
    {
        imieWlascicielaPojazdu: String,
        nazwiskoWlascicielaPojazdu: String,
        kodPocztowyWlascicielaPojazdu: String,
        miejscowoscWlascicielaPojazdu: String,
        gminaWlascicielaPojazdu: String,
        ulicaWlascicielaPojazdu: String,
        nrDomuWlascicielaPojazdu: String,
        nrMieszkaniaWlascicielaPojazdu: String
    },
    {_id: false}
);


const UserData = mongoose.model('UserData', UserDataSchama);
module.exports = UserData;
module.exports.Schema = UserDataSchama;