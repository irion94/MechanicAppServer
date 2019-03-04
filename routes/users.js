const express = require('express');
const router = express.Router();
const User = require('../models/user');
const createUser  = require( '../controllers/UserController').create;
const loginUser  = require( '../controllers/UserController').login;
const logoutUser = require( '../controllers/UserController').logout;

//POST Create New User (NOT CUSTOMER!)
router.post('/', createUser);

// GET Login User
router.get('/', loginUser);

// GET for logout User
router.get('/logout', logoutUser);

// GET All users :)
router.get('/all', function (req, res, next) {
    User.find().exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                let err = new Error('Not authorized! Go back!');
                err.status = 400;
                return next(err);
            } else {
                return res.json(user)
            }
        }
    })
});




// // GET route after registering
// router.get('/:username', function (req, res, next) {
//     User.find(req.params)
//         .exec(function (error, user) {
//             if (error) {
//                 return next(error);
//             } else {
//                 if (user === null) {
//                     var err = new Error('Not authorized! Go back!');
//                     err.status = 400;
//                     return next(err);
//                 } else {
//                     return res.json({username:user.username ,email:user.email})
//                 }
//             }
//         });
// });


module.exports = router;