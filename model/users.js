const mongoose = require('mongoose');
const geocoder = require('../geocoder');

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
    }
});



userSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.location);
    this.destination = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude]
    }
    this.location = undefined;
    next();
});

module.exports = mongoose.model('User', userSchema);
