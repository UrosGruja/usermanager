const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../model/users');
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const fs = require('fs');
const Axios = require('axios');
const { rejects } = require('assert');


exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const { name, email, password, role, phoneNumber, location } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role,
            phoneNumber,
            location
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.log(err);
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid crdentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    };

    const timeNow = Date.now();
    const today = new Date(timeNow);

    const message = `You are logged at ${today}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "notification",
            message
        });
        sendTokenResponse(user, 200, res);

    } catch (err) {
        console.log(err);
        return next(new ErrorResponse('Email could not be sent', 500));
    }
};

const sendTokenResponse = (user, statusCode, res) => {

    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res
        .status(statusCode)
        // .cookie('token', token, options)
        .json({
            success: true,
            token
        });
};

exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
};
exports.deleteMe = async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ success: true, data: {} });
};

exports.updateDetails = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
};

exports.updatePhoto = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorResponse(`User not found with id of ${req.user.id}`, 404))
        }

        if (!req.files) {
            return next(new ErrorResponse('Please upload a file', 400));
        }
        const file = req.files.file;

        if (!file.mimetype.startsWith('image')) {
            return next(new ErrorResponse('Please upload an image file', 400))
        }
        if (file.size > process.env.MAX_FILE_UPLOAD) {
            return next(new ErrorResponse(`Please upload an image less then ${process.env.MAX_FILE_UPLOAD}`, 400));
        }
        file.name = `photo_${user._id}${path.parse(file.name).ext}`;

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if (err) {
                console.log(err);
                return next(new ErrorResponse(`Problem with file upload`, 500));
            }
            await User.findByIdAndUpdate(user.id, { photo: file.name });

            res.status(200).json({
                success: true,
                date: file.name
            });
        });
        console.log(file.name);
    } catch (err) {
        console.log(err);
    }
};
function imageExists(url){
    return new Promise((resolve, reject) => {
        Axios({
            method: 'HEAD',
            url: url,
        }).then((response) => {
            const mimeTypes = ['image/jpeg', 'image/png'];
            if (mimeTypes.includes(response.headers['content-type']?.toLowerCase())) {
                return resolve(true);
            }
            return resolve(false);
        }).catch((err) => {
            reject(err);
        });
    })
}


async function download(url, pat) {

    return new Promise((resolve, reject) => {
        Axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
        }).then((response) => {
            response.data.pipe(fs.createWriteStream(pat))

            response.data.on('end', err => {
                console.log('download done')
                resolve()
            });

            response.data.on('error', err => {
                reject(err)
            });
        }).catch((err) => {
            reject(err);
        });
    })
};

exports.updatePhotoWithUrl = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorResponse(`User not found with id of ${req.user.id}`, 404))
        }

        if (!req.body.url) {
            return next(new ErrorResponse('Please add url photo', 400));
        }
        const url = req.body.url;

        const isImage = await imageExists(url);
        if (!isImage) {
            return res.status(400).json({
                success: false,
                msg: 'Provided URL is not a valid image'
            });
        }

        const pat = path.resolve(`${process.env.FILE_UPLOAD_PATH}`, `photo_${user.id}${path.parse(req.body.url).ext}`);


        console.log('pre download')
        await download(url, pat);
        console.log('after download')
        await User.findByIdAndUpdate(user.id, { photo: `photo_${user.id}${path.parse(req.body.url).ext}` });

        res.status(200).json({
            success: true
        });
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}