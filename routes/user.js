const express = require('express');
const {protect} = require('../middleware/auth')
const {createUser, getUser} = require('../controllers/user');
const router = express.Router();


router.route('/').post(createUser);
router.route('/:id').get(protect, getUser);

module.exports = router;