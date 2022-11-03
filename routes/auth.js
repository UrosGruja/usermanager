const express = require('express');
const { register, login, getMe, updateDetails, deleteMe } = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updetedetails', protect, updateDetails);
router.delete('/deleteme', protect, deleteMe);

module.exports = router;