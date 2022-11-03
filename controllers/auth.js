const ErrorResponse = require('../utils/errorResponse');
const User = require('../model/users');

exports.register = async (req, res, next) => {
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

    sendTokenResponse(user, 200, res);
};

const sendTokenResponse = (user, statusCode, res) => {

    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
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

    res.status(200).json({success: true, data:{}});
};

exports.updateDetails = async (req, res, next) => {
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