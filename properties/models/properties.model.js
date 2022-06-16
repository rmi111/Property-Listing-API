const mongoose = require('../../common/services/mongoose.service').mongoose;
const SERVICE_TYPE = require('../../common/config/app.constants').SERVICE_TYPE;
const UserSchema = require('../../users/models/users.model');
const User = require('User');

const Schema = mongoose.Schema;

console.log(SERVICE_TYPE.ELECTRICITY);

const PointSchema = new Schema({
    type:{
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates:{
        type: [Number],
        required: true
    }
});

const AddressSchema = new Schema({
    city: String,
    street: String,
    houseNumber: String,
    zipCode: String,
    country: String,
    coordinate: {
        type: PointSchema,
        required: false
    }
});

const ContactInfoSchema = new Schema({
    tel: [Number],
    email: [String],
    address: {
        type: AddressSchema,
        required: false
    }
});

PropertyFeatureSchema = new Schema({
    size: Number,
    address: {
        type: AddressSchema,
        required: true
    },
    ownerName: String,
    facilities: [String],
    room: Number,
    bathroom: Number,
    kitchen: Number
});

RentInfoSchema = new Schema({
    rent: Number,
    gas: Number,
    water: Number,
    electricity: Number
});

const PropertySchema = new Schema({
    name: String,
    feature: {
        type: PropertyFeatureSchema,
        required: true
    },
    address: {
        type: AddressSchema,
        required: true
    },
    contact: {
        type: ContactInfoSchema,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    } 
});

// userSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });

// // Ensure virtual fields are serialised.
// userSchema.set('toJSON', {
//     virtuals: true
// });

const Property = mongoose.model('Property', PropertySchema);

exports.createProperty = (propertyData) => {
    const property = new Property(propertyData);
    return propertyData.save();
};

exports.findById = (id) => {
    return Property.findById(id).then((result) => {
        result = result.toJSON();
        // delete result._id;
        // delete result.__v;
        return result;
    });
};

exports.findPropertyByUserId = (userId) => {
    return Property.find().populate({
        path: 'owner',
        match: {id: {$id: userId} }
    }).then((result) => {
        result = result.toJSON();
        return result;
    });
};

exports.patchProperty = (id, propertyData) => {
    return User.findOneAndUpdate({_id: id}, propertyData);
};

exports.list = (perPage,page) => {
    return new Promise((resolve, reject) => {
        Property
        .find()
        .limit(perPage)
        .skip(perPage * page)
        .exec(function(err,property){
            if (err){
                reject(err);
            }
            else{
                resolve(property);
            }
        });
    });
};