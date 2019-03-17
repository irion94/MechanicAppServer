/**
 *
 */
const R = require("ramda");

const Vehicle = require('../models/vehicle.model');
const Client = require('../models/client.model');

//Create and update clients vehicleList
module.exports.create = async  (req, res, next) => {
    const args = JSON.parse(req.query.args); //parse array of args
    const merged = R.mergeAll(args); //merge into one object
    if (args.markaPojazdu &&
        args.modelPojazdu &&
        args.numerRejestracyjnyPojazdu &&
        args.numerIdentyfikacyjnyPojazdu
    ) {
        let doc = await Vehicle.findOne(merged);
        if (!doc) {
            const vehicle = new Vehicle({
                ...merged,
                //userId: req.session.userId,
                ctreated_at: Date.now(),
                updated_at: Date.now(),
            });

            let cli = await Client.findOne({_id: vehicle.clientId});
            cli.vehicleList.push(vehicle);
            if (await vehicle.save() && await cli.save()) {
                res.json(vehicle)
            }
            else {
                res.status(404).json({message: "save error"})
            }
        }
        else {
            res.status(404).json({message: "item exist"})
        }

    } else {
        res.status(404).json({message: "all params needed"})
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
        const doc = await Client.find({userId: userId})
            .populate({path: 'vehicleList', populate: {path: 'repairsHistory'}});
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
