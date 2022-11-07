const User = require('../model/users');
const ErrorResponse = require('../utils/errorResponse');

exports.getUsers = async (req, res, next) => {
    res.status(200).json(res.advancedResults);
};

exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);

        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token: token
        });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorResponse(`User not found with this id ${req.params.id}`, 400));
        }
        res.status(200).json({ success: true, data: user });
    } catch(err) {
        next(new ErrorResponse(`User not found with this id ${req.params.id}`, 400));
    }
};

exports.updateUser = async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
};

exports.deleteUser = async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    })
}