const jwt = require('jsonwebtoken');
const User = require('../model/users');
const ErrorResponse = require('../utils/errorResponse');


exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorResponse('Not authorize to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        if(!req.user){
            return next(new ErrorResponse('User not found', 400));
        };

        next();

    } catch (err) {
        return next(new ErrorResponse('Not authorize to access this route', 401));

    }
}

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(`User role ${req.user.role} is not authorize to access this route`, 403)
            );
        }
        next();
    }
};

