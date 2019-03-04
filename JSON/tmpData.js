var faker = require('faker');
var R = require('ramda')


let vehicle = [
    "markaPojazdu",
    "modelPojazdu",
    "numerRejestracyjnyPojazdu",
    "numerIdentyfikacyjnyPojazdu",
    //"wariantPojazdu",
    "wersjaPojazdu",
    //"typPojazdu",
    "rokProdukcji",
    "pojemnoscSilnikaCm3",
    "maksymalnaMocNettoSilnikaKW",
    //"masaWlasnaPojazduKg",
    //"rodzajPojazdu",
    // "liczbaMiejscSiedzacych",
    // "liczbaMiejscStojacych",
    "rodzajPaliwa",
    // "przeznaczenie",
    // "dopuszczalnaLadownosc",
    "dataPierwszejRejestracjiPojazdu",
];
let vehicleOwner = [
    "pelneNazwiskoLubNazwaWlascicielaPojazdu",
    "imieWlascicielaPojazdu",
    "nazwiskoWlascicielaPojazdu",
    "nazwaWlascicielaPojazdu",
    "numerPESELLubREGONWlascicielaPojazdu",
    "kodPocztowyWlascicielaPojazdu",
    "miejscowoscWlascicielaPojazdu",
    "gminaWlascicielaPojazdu",
    "ulicaWlascicielaPojazdu",
    "nrDomuWlascicielaPojazdu",
    "nrMieszkaniaWlascicielaPojazdu",
    "phoneNumber",
    "email"
];

let documentOwner = [
    "pelneNazwiskoLubNazwaPosiadaczaDowoduRejestracyjnego",
    "imiePosiadaczaDowoduRejestracyjnego",
    "nazwiskoPosiadaczaDowoduRejestracyjnego",
    "nazwaPosiadaczaDowoduRejestracyjnego",
    "numerPESELLubREGONPosiadaczaDowoduRejestracyjnego",
    "kodPocztowyPosiadaczaDowoduRejestracyjnego",
    "miejscowoscPosiadaczaDowoduRejestracyjnego",
    "gminaPosiadaczaDowoduRejestracyjnego",
    "ulicaPosiadaczaDowoduRejestracyjnego",
    "nrDomuPosiadaczaDowoduRejestracyjnego",
    "nrMieszkaniaPosiadaczaDowoduRejestracyjnego",
];

let requireInformation = [
    "phoneNumber",
    "email"
]


function createDatabaseObject(){
    let result = {};

    let vehicleInformation = R.map(item => {return {[item]: faker.name.findName()}}, vehicle)

    let vehicleOwnerInformation = R.map(item => {return {[item]: faker.name.findName()}}, vehicleOwner)

    let documentOwnerInformation = R.map(item => {return {[item]: faker.name.findName()}}, documentOwner)

    let otherInformation = R.map(item => {return {[item]: faker.name.findName()}}, requireInformation)

    result = {vehicleInformation,vehicleOwnerInformation, documentOwnerInformation, otherInformation}

    return result

};

module.exports = function createObjectList() {
    let result = [];
    for(let i =0; i<1; i++){
        result.push(createDatabaseObject())
    }
    return result;
}
