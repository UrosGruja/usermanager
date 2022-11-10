const express = require('express');
const { register, login, getMe, updateDetails, deleteMe, updatePhoto} = require('../controllers/auth');

const { userDataValidator } = require("../middleware/validator");

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', userDataValidator, register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updetedetails', userDataValidator, protect, updateDetails);
router.delete('/deleteme', protect, deleteMe);
router.put('/updatephoto', protect, updatePhoto);


module.exports = router;