let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

exports.UserSchema = UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            //trim: true
        },
        password: {
            type: String,
            required: true,
        },
        permission: {
            type: Boolean,
            required: true
        },
        documents: [{type: Schema.Types.ObjectId, ref: 'Document'}]
    }
);

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    UserModel.findOne({email: email})
        .exec(function (err, user) {
            if (err) {
                console.log('user',user);
                return callback(err)
            } else if (!user) {
                console.log('user1',user);
                let err = new Error('User not found.');
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
    console.log('user',user);
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;