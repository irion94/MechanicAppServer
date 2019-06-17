let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const UserData = require('./embeded/document/userData.model').Schema;
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
        userData: {},
        documents: [{type: Schema.Types.ObjectId, ref: 'Document'}],
        clients: [{type: Schema.Types.ObjectId, ref: 'User'}],
    }
);

//authenticate input against database
UserSchema.statics.authenticate = (email, password, callback) => {
    console.log("jestem tutjaj1",email, password)
    UserModel.findOne({email: email})
        .exec(function (err, user) {
            if (err) {
                console.log("jestem tutjaj error")
                return callback(err)
            } else if (!user) {
                let err = new Error('User not found.');
                console.log("jestem tutjaj2")
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    console.log("jestem tutjaj compare true")
                    return callback(null, user);
                } else {
                    console.log("jestem tutjaj compare false")
                    return callback();
                }
            })
        });
};

UserSchema.pre('save', function (next) {
    let user = this;
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