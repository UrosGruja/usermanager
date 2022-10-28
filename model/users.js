const mongoose = require('mongoose');
const geocoder = require('../geocoder');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    destination: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        city: String
    }
});



userSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.location);
    this.destination = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        city: loc[0].city
    }
    this.location = undefined;
    next();
});

userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign( {id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

module.exports = mongoose.model('User', userSchema);
