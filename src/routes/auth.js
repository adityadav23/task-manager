const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { generalLimiter } = require('../middleware/rateLimiter');

const router = express.Router();


// Apply general rate limiter to all auth routes
router.use(generalLimiter);

router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    authController.register
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    authController.login
);

router.post('/logout', authMiddleware, authController.logout);

router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
