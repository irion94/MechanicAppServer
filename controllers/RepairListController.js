/**
 * CONTROLLER
 */
const Client = require('../models/client.model');
const Vehicle = require('../models/vehicle.model');
const RepairList = require('../models/repairList');
const Repair = require('../models/repair');
const R = require('ramda');

module.exports.create = async function (req, res, next) {
    let repairsList = req.body.params;
    if (typeof repairsList === "string") {
        repairsList = JSON.parse(repairsList);
        let vehicle = await Vehicle.findOne({_id: repairsList.vehicleId});
        // const dateOptions = { day: 'numeric', month: 'numeric', year: 'numeric', hour:'numeric', minute:'numeric'};
        // const date = new Date().toLocaleString('eu-PL',dateOptions);
        let list = new RepairList(repairsList);
        await list.save();
        if (vehicle) {
            vehicle.repairsHistory.push(list)
            let confirm = await vehicle.save();
            if (confirm) {
                res.status(200).json({message: "created", data: vehicle})
            }
        }
    }
    else{
        res.status(400).json({message: "Require params!"})
    }
};


getRepairLists = (array) => {
    const vehicles = R.pipe(
        R.map(R.prop('vehicleList')),
    )(array);

    const checkIf = R.ifElse(
        R.has('repairsHistory'),
        R.prop('repairsHistory'),
        R.map(R.prop('finished')),
        R.any(R.identity)
    )


    return R.filter(
        checkIf
    )(vehicles)
}


//TODO: Priority[1] ma zwracać pojazd z listą aktywnych todosów

module.exports.read = async function (req, res, next) {
    if (req.query._id) {
        const client = await Client.find({userId: req.query._id})
            .populate({path: 'vehicleList', populate: {path: 'repairsHistory'}});
        if (client !== null) {
            //zwraca całe drzewo jeśli znajdzie finished:false

            const array = R.pipe(
                R.map(R.prop('vehicleList')),
                R.flatten
            )(client)


            const checkIf = R.pipe(
                R.prop('repairsHistory'),
                R.flatten,
                R.map(R.prop('finished')),
                R.any(R.not)
            );

            const repairsInProgress = R.filter(
                checkIf
            )(array);

            console.log('progress', repairsInProgress)

            return res.json(repairsInProgress);
        }
        else {
            let err = new Error('Not Found')
            return next(err)
        }
    }
    else {
        let err = new Error('User id undefined');
        return next(err)
    }
};


// module.exports.getUser = function (req, res, next) {
//     if (req.query.userId) {
//         Client.find({userId: req.query.userId}).exec(function (error, data) {
//             if (error) {
//                 return next(error);
//             } else {
//                 if (data === null) {
//                     let err = new Error('Not Found!');
//                     err.status = 400;
//                     return next(err);
//                 } else {
//                     return res.json(data)
//                 }
//             }
//         })
//     }
//     else {
//         Client.find().exec(function (error, data) {
//             if (error) {
//                 return next(error);
//             } else {
//                 if (data === null) {
//                     let err = new Error('Not Found!');
//                     err.status = 400;
//                     return next(err);
//                 } else {
//                     return res.json(data)
//                 }
//             }
//         })
//     }
// };