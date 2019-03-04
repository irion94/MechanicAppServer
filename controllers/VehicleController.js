/**
 *
 */
const Vehicle = require('../models/vehicle');
const Client = require('../models/client');

module.exports.create = async function (req, res, next) {
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
        clientId
    } = req.body;

    if (markaPojazdu &&
        modelPojazdu &&
        numerRejestracyjnyPojazdu &&
        numerIdentyfikacyjnyPojazdu
    ) {
        const vehicle = new Vehicle({
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
            clientId : clientId,
            //repairsHistory: [],
            created_at: Date.now(),
            updated_at: Date.now(),
        });

        const result = await vehicle.save();
        if(result){
            let client = await Client.findOne({_id: req.body.clientId});
            if(client.vehicleList){
                client.vehicleList.push(result._id);
                client.save();
                return res.json()
            }
            else{
                return next(new Error('Client id not found'))
            }
        }

    } else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
};

/**
 *  If return all objects belonging to given client
    Else return all objects belonging to given user

    According to documentation, every client has array of objects called userId, (cause many users may own that client)
    and every vehicle has field userID and clientID
 * @param req
 * @param res
 * @param next
 */

module.exports.read = async function (req, res, next) {
    if(req.query._id){
        const vehicle = await Vehicle.findOne({_id: req.query._id});
        if(vehicle !== null){
            return res.json(vehicle);
        }
        else{
            let err = new Error('Not Found')
            return next(err)
        }
    }
    else{
        const vehicle = await Vehicle.find();
        if(vehicle !== null){
            return res.json(vehicle);
        }
        else{
            let err = new Error('Not Found');
            return next(err)
        }
    }
};
