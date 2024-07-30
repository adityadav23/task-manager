const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Endpoint to get task statistics
router.get('/task-stats', analyticsController.getTaskStats);

// Endpoint to get task completion statistics by user
router.get('/user-stats', analyticsController.getUserStats);

// Endpoint to get task completion statistics by team
router.get('/team-stats', analyticsController.getTeamStats);

module.exports = router;
