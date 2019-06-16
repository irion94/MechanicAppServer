const User = require('../models/user.model');

module.exports.create = async function(req, res, next){

    if (req.body.password !== req.body.confirmation) {
        let err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
    }

    if (req.body.email && req.body.password) {

        const userData = new User({
            email: req.body.email,
            password: req.body.password,
            permission: req.body.permission,
            userData: {
                companyName: req.body.companyName,
                nip: req.body.nip,
                regon: req.body.regon,
                name: req.body.name,
                surname: req.body.surname,
                phone: req.body.phone,
                email:req.body.email
            }
        });

        userData.save()
            .then(() => {

                res.status(201).json({message: "Created! Please login to continue.", data: {}})
            })
            .catch((error) => res.json({message: `Not created:${error.message}`}))

    }
    else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
};
module.exports.update = async (req, res) => {

};

module.exports.login = function (req, res, next) {
    if (req.query.email && req.query.password) {
        User.authenticate(req.query.email, req.query.password, function (error, user) {
            if (error || !user) {
                return res.status(401).json({message: 'Password not match or user not defined'});
            } else {
                req.session.userId = user._id;
                return res.status(200).json(user);
            }
        });
    }
    else {
        return res.status(400).json({message: 'Login or password not set!'})
    }
};

module.exports.logout = function (req, res, next) {
    // console.log(req)
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                console.log('session close');
                return res.json({loggedOut: true});
            }
        });
    }
};