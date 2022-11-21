const express = require('express');
const { getUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/user');

const User = require('../model/users');
const router = express.Router({ mergeParams: true });

const { userDataValidator } = require("../middleware/validator");
const { userUpdateDataValidator } = require("../middleware/updateValidator");

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth')

router.use(protect);
router.use(authorize('admin'));


router.route('/').get(advancedResults(User), getUsers);

router.route('/').post(userDataValidator, createUser);


router.route('/:id')
    .get(getUser)
    .put(userUpdateDataValidator, updateUser)
    .delete(deleteUser)

module.exports = router;