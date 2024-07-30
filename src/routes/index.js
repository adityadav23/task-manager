const express = require('express');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const managerRoutes = require('./manager');
const userRoutes = require('./user');
const taskRoutes = require('./task'); // Import task routes
const analyticsRoutes = require('./analytics')
const router = express.Router();

// Define routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/manager', managerRoutes);
router.use('/user', userRoutes);
router.use('/tasks', taskRoutes); // Use task routes
router.use('/analytics', analyticsRoutes); // Add the analytics routes

module.exports = router;
