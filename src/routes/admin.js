const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
const { adminLimiter } = require('../middleware/rateLimiter');

// Apply admin rate limiter to all admin routes
const router = express.Router();
router.use(adminLimiter);

router.use(authMiddleware);
router.use(checkRole(['Admin'])); // Ensure only Admins have access

router.get('/users', userController.getAllUsers); // Admins can manage users
router.post('/tasks', taskController.createTask); // Admins can assign tasks

module.exports = router;
