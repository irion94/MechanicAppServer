/**
 * CONTROLLER
 */
const Client = require('../models/client.model');
const Vehicle = require('../models/vehicle.model');
const User = require('../models/user');
const R = require('ramda')

/**
 * To push new Owner to database
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>} If pass -> clientId
 */

module.exports.create = async function (req, res, next) {
    const args = JSON.parse(req.body.args); //parse array of args
    //const update = JSON.parse(req.query.update); //parse array of args
    const merged = R.mergeAll(args); //merge into one object
    if (merged.imieWlascicielaPojazdu && merged.nazwiskoWlascicielaPojazdu && merged.numerPESELLubREGONWlascicielaPojazdu) {
        let doc = await Client.findOne({imieWlascicielaPojazdu: merged.imieWlascicielaPojazdu, nazwiskoWlascicielaPojazdu: merged.nazwiskoWlascicielaPojazdu, numerPESELLubREGONWlascicielaPojazdu: merged.numerPESELLubREGONWlascicielaPojazdu});
        if (!doc) {
            const client = new Client({
                ...merged,
                //userId: req.session.userId,
                userId: req.session.userId,
                ctreated_at: Date.now(),
                updated_at: Date.now(),
            });
            if (await client.save()) {
                res.json({message: "Create new client", data: client})
            }
            else {
                res.status(404).json({message: "Save error", data:{}})
            }
        }
        else {
            const userId = req.session.userId;
            if(!R.contains(userId, doc.userId)){
                doc.userId.push(req.session.userId)
                doc.save()
            }
            res.status(200).json({message: "Client found", data:doc})
        }

    } else {
        return res.status(404).send("'All field required!'").end()
    }
};

//Find ONE REST Full
module.exports.readOne = async (req, res, next) => {
    const args = JSON.parse(req.params.args); //parse array of args
    const merged = R.mergeAll(args); //merge into one object
    const doc = await Client.findOne(merged)
        .populate({path: 'vehicleList', populate: {path: 'repairsHistory'}})
        .select('-userId')
        .exec();
    if (!doc) {
        res.status(404).json({message: "doc not exist"})
    }

    res.status(200).json(doc)
};

//FindAll
module.exports.readAll = async (req, res, next) => {
    const docs = await Client.find({userId: req.params.userId})
        .populate({path: 'vehicleList', populate: {path: 'repairsHistory'}})
        .select('-userId').exec();
    if (!docs) {
        res.status(404).json({message: "doc not exist"})
    }
    console.log(docs)
    res.status(200).json(docs)
};


module.exports.update = async (req, res, next) => {
    const client = JSON.parse(req.query.client); //parse array of args
    const merged = R.mergeAll(client); //merge into one object
    const ve = JSON.parse(req.query.vehicle);

    const doc = await Client.findByIdAndUpdate(client,
        {$push: ve},
        function(err, doc) {
            if(err){
                console.log(err);
            }else{
                //do stuff
                doc.vehicleList.push(ve);
                doc.save();
                res.json(doc)
            }
        }
    );
    if (!doc) {
        res.status(400).json({message: "doc not updated"})
    }
};

// module.exports.update = async function (req, res, next) {
//     let {
//         markaPojazdu,
//         modelPojazdu,
//         numerRejestracyjnyPojazdu,
//         numerIdentyfikacyjnyPojazdu,
//         wersjaPojazdu,
//         rokProdukcji,
//         pojemnoscSilnikaCm3,
//         maksymalnaMocNettoSilnikaKW,
//         rodzajPaliwa,
//         dataPierwszejRejestracjiPojazdu,
//     } = req.body;
//
//     let client = await Client.findOne({_id: req.query.clientId});
//     if (client === null) {
//         let err = new Error('Not Found!');
//         err.status = 400;
//         return next(err);
//     } else {
//         console.log(client, client.vehicleList)
//
//         const newVeh = new Vehicle({
//             markaPojazdu: markaPojazdu,
//             modelPojazdu: modelPojazdu,
//             numerRejestracyjnyPojazdu: numerRejestracyjnyPojazdu,
//             numerIdentyfikacyjnyPojazdu: numerIdentyfikacyjnyPojazdu,
//             wersjaPojazdu: wersjaPojazdu,
//             rokProdukcji: rokProdukcji,
//             pojemnoscSilnikaCm3: pojemnoscSilnikaCm3,
//             maksymalnaMocNettoSilnikaKW: maksymalnaMocNettoSilnikaKW,
//             rodzajPaliwa: rodzajPaliwa,
//             dataPierwszejRejestracjiPojazdu: dataPierwszejRejestracjiPojazdu,
//
//
//             created_at: Date.now(),
//             updated_at: Date.now(),
//         })
//
//         console.log(newVeh._id);
//         client.vehicleList.push(newVeh._id);
//         client.save();
//         return res.json(client)
//     }
//
// };


// const createClient = (client) => {
//     if (client.imieWlascicielaPojazdu && client.nazwiskoWlascicielaPojazdu && (client.phoneNumber || client.email)) {
//         return Client.findOne(client, async function (err, doc) {
//             if (!doc) {
//                 const newClient = new Client({
//                     ...client,
//                     //userId: req.session.userId,
//                     ctreated_at: Date.now(),
//                     updated_at: Date.now(),
//                 });
//                 if (newClient) {
//                     await newClient.save();
//                     return client
//                 }
//             }
//         })
//     }
// };
//
// const createVehicle = (vehicle) => {
//     if (vehicle.markaPojazdu &&
//         vehicle.modelPojazdu &&
//         vehicle.numerRejestracyjnyPojazdu &&
//         vehicle.numerIdentyfikacyjnyPojazdu
//     ) {
//         return Client.findOne(vehicle, async function (err, doc) {
//             if (!doc) {
//                 const newVehicle = new Client({
//                     ...vehicle,
//                     //userId: req.session.userId,
//                     ctreated_at: Date.now(),
//                     updated_at: Date.now(),
//                 });
//                 if (newVehicle) {
//                     await newVehicle.save();
//                     return vehicle
//                 }
//             }
//         })
//     }
// };

//***********
// module.exports.createFromScanner = async function (req, res, next) {
//
//     let cl = JSON.parse(req.query.client); //parse array of args
//     let ve = JSON.parse(req.query.vehicle); //parse array of args
//     cl = R.mergeAll(cl); //merge into one object
//     ve = R.mergeAll(ve); //merge into one object
//
//     console.log("cl", cl)
//     console.log("ve", ve)
//
//     let r = createClient(cl);
//     console.log("r", r)
//     let v = createVehicle(ve);
//     console.log("v", v)
//     updateClient(r, "vehicleList", v);
//
// };