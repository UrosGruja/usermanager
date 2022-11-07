const { body } = require("express-validator");
const geocoder = require('../geocoder');

const userDataValidator = [
    body("name")
        .exists({ chackFalsy: true })
        .withMessage("User name is required")
        .isString()
        .withMessage("User name should be string"),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Provide valid email"),
    body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password should be string")
        .isLength({ min: 5 })
        .withMessage("Password should be at least 5 characters"),
    body("role")
        .isString()
        .withMessage("Role should be string")
        .isIn(["user", "admin"])
        .withMessage("Role value is invalid"),
    body("phoneNumber")
        .optional()
        .isString()
        .withMessage("Phone number should be string")
        .custom((value) => {
            if (value.length !== 12) {
                return Promise.reject("Phone number should be 12 digits");
            } else {
                return true;
            }
        }),
    body("location")
        .exists()
        .withMessage("City must exist")
        .isString()
        .withMessage("Location should be string")
        .optional()
        .custom(async (value, { req }) => {
            const loc = await geocoder.geocode(value);
            console.log(loc);
            if (loc[0].city === '' || !loc[0] || !loc[0].city) {
                return Promise.reject("City not found")
            }
        }),
];

module.exports = { userDataValidator };
