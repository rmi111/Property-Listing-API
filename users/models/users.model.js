const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    permissionLevel: Number
});


userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true
});


const User = mongoose.model('Users',userSchema);

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.findById = (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON();
        delete result._id;
        delete result.__v;
        return result;
    });
};

exports.patchUser = (id, userData) => {
    return User.findOneAndUpdate({_id: id}, userData);
};

exports.list = (perPage,page) => {
    return new Promise((resolve, reject) => {
        User
        .find()
        .limit(perPage)
        .skip(perPage * page)
        .exec(function(err,users){
            if (err){
                reject(err);
            }
            else{
                resolve(users);
            }
        });
    });
};

module.exports = mongoose.model('User', userSchema);