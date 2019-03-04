let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

exports.UserSchema = UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        vehicleIds: [{type: Schema.Types.ObjectId, ref: 'Vehicle'}],
        clientIds: [{type: Schema.Types.ObjectId, ref: 'Client'}]
    }
);

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({email: email})
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
}

UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

const User = mongoose.model('User', UserSchema);
module.exports = User;