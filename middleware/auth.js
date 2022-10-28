const jwt = require('jsonwebtoken');
const User = require('../model/users');
const ErrorResponse = require('../utils/errorResponse');


exports.protect = async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new ErrorResponse('Not authorize to access this route', 401));
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();

    }catch(err){
        return next(new ErrorResponse('Not authorize to access this route', 401));

    }
}

