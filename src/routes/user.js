const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const taskController = require('../controllers/taskController');
const userController = require('../controllers//userController');

const router = express.Router();

router.use(authMiddleware);
router.use(checkRole(['User'])); // Ensure only Users have access

router.get('/profile', userController.getProfile); // Users can view their profile
router.get('/tasks', taskController.getUserTasks); // Users can manage their own tasks

module.exports = router;
