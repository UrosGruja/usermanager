const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../model/users');
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const { url } = require('inspector');


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

    const url = `localhost:8080/uploads/${user.photo}`

    res.status(200).json({
        success: true,
        data: user,
        image: url
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