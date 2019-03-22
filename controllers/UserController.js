const User = require('../models/user');

module.exports.create = async function(req, res, next){
    if (req.body.password !== req.body.passwordConf) {
        let err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

        const userData = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        });
        // console.log(userData)

        await userData.save()
            .then( result => {
                console.log('res',result)
                if (result) {
                    req.session.userId = result._id;
                    return res.json(result)
                } else {
                    return next(new Error('Insert Error'));
                }
            });
    } else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
};

module.exports.login = function (req, res, next) {
    console.log(req.query.email , req.query.password)
    if (req.query.email && req.query.password) {
        User.authenticate(req.query.email, req.query.password, function (error, user) {
            console.log("login", req.query)
            if (error || !user) {
                let err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                // console.log("session start", req.session)
                return res.json(user);
            }
        });
    }
    else {
        let err = new Error('Login or password not set!');
        err.status = 400;
        return next(err)
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