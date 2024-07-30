const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');
const {  sensitiveLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply sensitive rate limiter to manager routes
router.use(sensitiveLimiter);
router.use(authMiddleware);
router.use(checkRole(['Manager'])); // Ensure only Managers have access

router.get('/tasks', taskController.getTasks); // Managers can manage tasks
router.get('/users', userController.getTeamMembers); // Managers can view team members

module.exports = router;
