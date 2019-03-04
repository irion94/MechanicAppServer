/**
 * CONTROLLER
 */
const RepairList = require('../models/repairList');
const Vehicle = require('../models/vehicle');
const Repair = require('../models/repair');
const R = require('ramda');

module.exports.create = async function (req, res, next) {
    let {
        repairsList,
        vehicleID
    } = req.body;

    repairsList  = JSON.parse(repairsList);

    let vehicle = await Vehicle.findOne({_id: vehicleID});

    if (repairsList && vehicleID) {
        if (vehicle) {
            const array = R.map(object => new Repair({...object}))(repairsList);
            //const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            const dateOptions = { day: 'numeric', month: 'numeric', year: 'numeric', hour:'numeric', minute:'numeric'};
            const date = new Date().toLocaleString('eu-PL',dateOptions);
            let list = new RepairList(
                {
                    repairsList: array,
                    finished:false,
                    created_at: date,
                    updated_at: date
                });
            const confirm = await list.save();
            if(confirm){
                vehicle.repairsHistory.push(list._id);
                vehicle.save();
                return res.json({ctreated: true, vehicle})
            }
            else{
                return next(new Error('Save error'));
            }
        }
    }
    else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
};


module.exports.read = async function (req, res, next) {
    // let {_id, repairId} = req.query._id
    // console.log(_id);
    // if (_id) {
    const repairList = await Vehicle.find({_id:req.query.vehicleId})
        .populate('repairsHistory')
    //let result = R.map(item => item.repairsHistory, repairList);

    if (repairList === null) {
        let err = new Error('Not Found!');
        err.status = 400;
        return next(err);
    } else {
        return res.json(repairList)
        //data.repairsList.push(repairId)
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