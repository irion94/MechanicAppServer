/**
 * CONTROLLER
 */

const mongoose = require("mongoose");

const Client = require('../models/document.model');
const Vehicle = require('../models/embeded/document/vehicle.model');
const RepairList = require('../models/embeded/document/repairList');
const Repair = require('../models/embeded/document/post.model');
const Document = require('../models/document.model');
const User = require('../models/user.model');
const R = require('ramda');

module.exports.create = async function (req, res, next) {
    let args = req.body;
    let list = new RepairList(args.data);
    console.log(list, args.docId)
    if (await Document.findOneAndUpdate({"_id": args.docId}, {$push: {'vehicle.repairsHistory': list}})) {
        const user = await User.findOneAndUpdate({
            documents: args.docId,
            permission: false
        }, {$addToSet: {clients: mongoose.Types.ObjectId(args.data.userId)}});
        console.log(user)
        res.status(200).json({message: "created"})
    }
    else{
        res.status(400).json({message: "Error"})
    }
};


module.exports.update = async function (req, res, next) {
    console.log(req.body)
    let set = {};
    if (req.body.finished !== undefined) set = {...set, 'vehicle.repairsHistory.$.finished': req.body.finished};
    if (req.body.deadLine !== undefined) set = {...set, 'vehicle.repairsHistory.$.deadLine': req.body.deadLine};

    let doc = await Document.updateOne({"vehicle.repairsHistory": {$elemMatch: {_id: mongoose.Types.ObjectId(req.body.data._id)}}}, {
        $set: set
    });
    if (doc.ok) res.status(200).json({message: "Updated!"});
    else res.status(304)
};

module.exports.delete = async function (req, res, next) {
    console.log(req.body)
    let doc = await Document.updateOne({'vehicle.repairsHistory': {$elemMatch: {_id: mongoose.Types.ObjectId(req.body._id)}}}, {$pull: {'vehicle.repairsHistory': {_id: mongoose.Types.ObjectId(req.body._id)}}});
    console.log(doc)
    if (doc.ok) res.status(200).json({message: "Deleted!"});
    else res.status(304)
};


//______------------------//______------------------//______------------------//______------------------
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

// , $and:{"$_id": mongoose.Types.ObjectId(req.params.clientId)}
//TODO: Priority[1] ma zwracać pojazd z listą aktywnych todosów

module.exports.read = async function (req, res, next) {
    if (req.params.id) {
        let vehicle;
        if (req.params.clientId !== undefined) {
            vehicle = await Client.aggregate([
                {$unwind: "$vehicleList"},
                {$unwind: "$vehicleList.repairsHistory"},
                {
                    $match:
                        {
                            $or: [{"vehicleList.repairsHistory.userId": mongoose.Types.ObjectId(req.params.id)}, {"vehicleList.repairsHistory.finished": true}],
                            $and: [{"_id": mongoose.Types.ObjectId(req.params.clientId)}]
                        }
                },
                {
                    $group: {
                        _id: "$_id",
                        vehicleList: {$mergeObjects: "$vehicleList"},
                        repairsHistory: {$push: "$vehicleList.repairsHistory"}
                    }
                },
                {
                    $project: {
                        "vehicleList._id": 1,
                        "vehicleList.clientId": "$_id",
                        "vehicleList.markaPojazdu": 1,
                        "vehicleList.modelPojazdu": 1,
                        "vehicleList.numerRejestracyjnyPojazdu": 1,
                        "vehicleList.numerIdentyfikacyjnyPojazdu": 1,
                        "vehicleList.wersjaPojazdu": 1,
                        "vehicleList.rokProdukcji": 1,
                        "vehicleList.pojemnoscSilnikaCm3": 1,
                        "vehicleList.maksymalnaMocNettoSilnikaKW": 1,
                        "vehicleList.dataPierwszejRejestracjiPojazdu": 1,
                        "vehicleList.repairsHistory": "$repairsHistory"
                    }
                }
            ])
                .exec();
        }
        else {
            vehicle = await Client.aggregate([
                {$unwind: "$vehicleList"},
                {$unwind: "$vehicleList.repairsHistory"},
                {
                    $match:
                        {
                            $or: [{"vehicleList.repairsHistory.userId": mongoose.Types.ObjectId(req.params.id)}, {"vehicleList.repairsHistory.finished": true}, {"_id": mongoose.Types.ObjectId(req.params.clientId)}],
                        }
                },
                {
                    $group: {
                        _id: "$_id",
                        vehicleList: {$mergeObjects: "$vehicleList"},
                        repairsHistory: {$push: "$vehicleList.repairsHistory"}
                    }
                },
                {
                    $project: {
                        "vehicleList._id": 1,
                        "vehicleList.clientId": "$_id",
                        "vehicleList.markaPojazdu": 1,
                        "vehicleList.modelPojazdu": 1,
                        "vehicleList.numerRejestracyjnyPojazdu": 1,
                        "vehicleList.numerIdentyfikacyjnyPojazdu": 1,
                        "vehicleList.wersjaPojazdu": 1,
                        "vehicleList.rokProdukcji": 1,
                        "vehicleList.pojemnoscSilnikaCm3": 1,
                        "vehicleList.maksymalnaMocNettoSilnikaKW": 1,
                        "vehicleList.dataPierwszejRejestracjiPojazdu": 1,
                        "vehicleList.repairsHistory": "$repairsHistory"
                    }
                }
            ])
                .exec();
        }
        let result = R.map(R.prop('vehicleList'))(vehicle);
        if (result !== null) {
            return res.json(result)
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

// {
//     $project: {
//         personalities: 1,
//         vehicle: {
//             $mergeObjects: [
//                 "$vehicle",
//                 {
//                     "repairsHistory":
//                         {
//                             $filter: {
//                                 input: "$repairsHistory",
//                                 as: "repairsHistory",
//                                 cond: {
//                                     $or: [
//                                         {$and: [{$gt: [{$size: "$repairsHistory"}, 0]}, {$eq: ["$$repairsHistory.userId", mongoose.Types.ObjectId(req.params.ids)]}]},
//                                         {$eq: ["$$repairsHistory.finished", true]}
//                                     ]
//                                 }
//                             }
//                         }
//                 }
//             ]
//         }
//     }
//
// },