const User = require('../model/users');

exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);

        console.log(user);
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false});
    }
};