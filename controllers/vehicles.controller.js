/**
 *
 */
const R = require("ramda");
const Vehicle = require('../models/vehicle.model');
const Client = require('../models/document.model');

//Create and update clients vehicleList
module.exports.create = async  (req, res, next) => {
    const args = req.body;
    console.log(args)
    let doc = await Client.findOne({'vehicleList.markaPojazdu': args.data.markaPojazdu});
        if (!doc) {
            const vehicle = new Vehicle({
                ...args.data,
                //userId: req.session.userId,
                created_at: Date.now(),
                updated_at: Date.now(),
            });

            let update = await Client.findOneAndUpdate({_id: args.clientId}, {$push: {vehicleList: vehicle}});
            if (update) {
                res.json({message: "Create new vehicle", data: vehicle})
            }
            else {
                res.status(404).json({message: "save error"})
            }
        }
        // podmianka!
        else {
            if(R.identical(doc._id.toString(),args.clientId.toString())){
                res.status(200).json({message: "Vehicle found, owner mach!.", data:R.filter(item => args.data.numerIdentyfikacyjnyPojazdu === item.numerIdentyfikacyjnyPojazdu, doc.vehicleList).pop()})
            }
            else{
                await Client.findOneAndUpdate({_id: args.clientId}, { "$push": { "vehicleList": doc} }).exec();
                await Client.findOneAndUpdate({_id: doc.clientId}, {"$pull": {"vehicleList": doc}}).exec();
                doc.clientId = args.clientId;
                await doc.save();
                res.status(200).json({message: "Vehicle found, owner change!.", data:doc})
            }
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

//Zwraca listę wszystkich pojazdów dla danego Usera
module.exports.read = async function (req, res, next) {
    const userId = req.query.userId;
    if (userId) {
        const doc = await Vehicle.find({"repairsHistory.finished": true})
        console.log(doc)
        //.populate({path: 'vehicleList', populate: {path: 'repairsHistory'}});
        if (!doc) {
            res.status(404).json({message: "doc not exist"})
        }
        const vehicleList =
            R.pipe(
                R.map(R.path(["vehicleList"])),
                R.flatten
            )(doc);
         res.status(200).json(vehicleList);
    }
    else {
        res.status(404).json({message: "require parameters"})
    }
};
