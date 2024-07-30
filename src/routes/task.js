const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Apply middleware
router.use(authMiddleware);

// Routes
router.post('/', checkRole(['Admin', 'Manager', 'User']), taskController.createTask);
router.get('/', checkRole(['Admin', 'Manager', 'User']), taskController.getTasks);
router.get('/my-tasks', checkRole(['Admin', 'Manager', 'User']), taskController.getUserTasks);
router.put('/:id', checkRole(['Admin', 'Manager', 'User']), taskController.updateTask);
router.delete('/:id', checkRole(['Admin']), taskController.deleteTask);
router.post('/assign', checkRole(['Manager']), taskController.assignTask); // Manager assigns tasks
router.get('/assigned/:userId', checkRole(['Manager']), taskController.getAssignedTasks); // Managers view assigned tasks

module.exports = router;
