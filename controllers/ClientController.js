/**
 * CONTROLLER
 */
const Client = require('../models/client');
const Vehicle = require('../models/vehicle');
const User = require('../models/user');

module.exports.create = async function (req, res, next) {
    let {
        imieWlascicielaPojazdu,
        nazwiskoWlascicielaPojazdu,
        nazwaWlascicielaPojazdu,
        numerTelefonu,
        email
    } = req.body;

    if (imieWlascicielaPojazdu &&
        nazwiskoWlascicielaPojazdu &&
        nazwaWlascicielaPojazdu &&
        numerTelefonu && email
    ) {
        //console.log('id', req.session)

        const client = new Client({
            pelneNazwiskoLubNazwaWlascicielaPojazdu: imieWlascicielaPojazdu + ' ' + nazwiskoWlascicielaPojazdu + ' ' + nazwaWlascicielaPojazdu,
            imieWlascicielaPojazdu: imieWlascicielaPojazdu,
            nazwiskoWlascicielaPojazdu: nazwiskoWlascicielaPojazdu,
            nazwaWlascicielaPojazdu: nazwaWlascicielaPojazdu,
            numerPESELLubREGONWlascicielaPojazdu: undefined,
            kodPocztowyWlascicielaPojazdu: undefined,
            miejscowoscWlascicielaPojazdu: undefined,
            gminaWlascicielaPojazdu: undefined,
            ulicaWlascicielaPojazdu: undefined,
            nrDomuWlascicielaPojazdu: undefined,
            nrMieszkaniaWlascicielaPojazdu: undefined,

            userId: req.body.userId,
            ctreated_at: Date.now(),
            updated_at: Date.now(),

            numerTelefonu: numerTelefonu,
            email: email
        });

        let result = await client.save();

        if(result){
            return res.json(client)
        }
        else{
            return next(new Error("404 insert fail!"))
        }

    } else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
};

module.exports.read = function (req, res, next) {  //w użyciu
    if (req.query.userId) {
        Client.find({userId: req.query.userId})
            // .populate('vehicleList')
            // .populate('repairsHistory')
            //.populate({path : 'vehicleList', populate : {path : 'repairsHistory', populate: {path: 'repairsList'}}})
            // .populate([{
            //     path: 'vehicleList'
            // }, {
            //     path: 'repairsHistory'
            // }])
            .select('-userId')
            .exec(function (error, data) {
            if (error) {
                return next(error);
            } else {
                if (data === null) {
                    let err = new Error('Not Found!');
                    err.status = 400;
                    return next(err);
                } else {

                    return res.json(data)
                }
            }
        })
    }
    else { //Nie potrzebne?
        Client.find().exec(function (error, data) {
            if (error) {
                return next(error);
            } else {
                if (data === null) {
                    let err = new Error('Not Found!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.json(data)
                }
            }
        })
    }
};

module.exports.update = async function (req, res, next) {
    let {
        markaPojazdu,
        modelPojazdu,
        numerRejestracyjnyPojazdu,
        numerIdentyfikacyjnyPojazdu,
        wersjaPojazdu,
        rokProdukcji,
        pojemnoscSilnikaCm3,
        maksymalnaMocNettoSilnikaKW,
        rodzajPaliwa,
        dataPierwszejRejestracjiPojazdu,
    } = req.body;

    let client = await Client.findOne({_id: req.query.clientId});
    if (client === null) {
        let err = new Error('Not Found!');
        err.status = 400;
        return next(err);
    } else {
        console.log(client, client.vehicleList)

        const newVeh = new Vehicle({
            markaPojazdu: markaPojazdu,
            modelPojazdu: modelPojazdu,
            numerRejestracyjnyPojazdu: numerRejestracyjnyPojazdu,
            numerIdentyfikacyjnyPojazdu: numerIdentyfikacyjnyPojazdu,
            wersjaPojazdu: wersjaPojazdu,
            rokProdukcji: rokProdukcji,
            pojemnoscSilnikaCm3: pojemnoscSilnikaCm3,
            maksymalnaMocNettoSilnikaKW: maksymalnaMocNettoSilnikaKW,
            rodzajPaliwa: rodzajPaliwa,
            dataPierwszejRejestracjiPojazdu: dataPierwszejRejestracjiPojazdu,


            created_at: Date.now(),
            updated_at: Date.now(),
        })

        console.log(newVeh._id);
        client.vehicleList.push(newVeh._id);
        client.save();
        return res.json(client)
    }

}