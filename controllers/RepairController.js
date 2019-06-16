// /**
//  * CONTROLLER
//  */
// const Repair = require('../models/repair');
//
// module.exports.create = function (req, res, next) {
//     let {
//         title,
//         description
//     } = req;
//
//     console.log(req.params, req);
//
//     if (tytul && opis) {
//
//         const repairData = {
//             tytul: title,
//             opis: description,
//         };
//
//         Repair.insertMany(repairData, function (error, data) {
//             if (error) {
//                 return next(error);
//             } else {
//                 return res.json({ctreated: true, ...data})
//             }
//         });
//
//     } else {
//         let err = new Error('All fields required.');
//         err.status = 400;
//         return next(err);
//     }
// };
//
//
// module.exports.get = function () {
//     const object = new Repair({tytul: 'title', opis: 'opissss',})
//         console.log(object);
//     console.log(JSON.stringify(object))
// }
