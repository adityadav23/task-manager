const { notifyUser } = require('../utils/notifications');
const Task = require('../models/Task');
const User = require('../models/User');

// Emit task update event
const emitTaskUpdate = (task) => {
    const io = require('socket.io-client'); // Importing socket.io-client here

    // You might need to replace this with your actual socket instance if you use multiple instances
    io.emit('task:update', task);
};

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    try {
        if (assignedTo) {
            const user = await User.findById(assignedTo);
            if (!user) {
                return res.status(404).json({ msg: 'Assigned user not found' });
            }
        }

        const newTask = new Task({
            title,
            description,
            dueDate,
            priority,
            status,
            createdBy: req.user.id,
            assignedTo: assignedTo || null
        });

        const task = await newTask.save();

        // Emit task creation event
        emitTaskUpdate(task);

        // Notify assigned user
        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo);
            await notifyUser(
                assignedTo,
                'New Task Assigned',
                `You have been assigned a new task: ${title}.`,
                `You have a new task: ${title}. Due by ${dueDate}.`
            );
        }

        res.status(201).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update an existing task
exports.updateTask = async (req, res) => {
    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (task.createdBy.toString() !== req.user.id && !req.user.roles.includes('Admin')) {
            return res.status(403).json({ msg: 'Not authorized to update this task' });
        }

        const previousAssignedTo = task.assignedTo;

        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.assignedTo = assignedTo || task.assignedTo;

        const updatedTask = await task.save();

        // Emit task update event
        emitTaskUpdate(updatedTask);

        // Notify previous and new assignees
        if (assignedTo && assignedTo !== previousAssignedTo) {
            if (previousAssignedTo) {
                const previousUser = await User.findById(previousAssignedTo);
                await notifyUser(
                    previousAssignedTo,
                    'Task Reassigned',
                    `The task "${task.title}" has been reassigned.`,
                    `The task "${task.title}" has been reassigned.`
                );
            }

            const newAssignedUser = await User.findById(assignedTo);
            await notifyUser(
                assignedTo,
                'Task Assigned',
                `You have been assigned a new task: ${title}.`,
                `You have a new task: ${title}. Due by ${dueDate}.`
            );
        }

        res.json(updatedTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (task.createdBy.toString() !== req.user.id && !req.user.roles.includes('Admin')) {
            return res.status(403).json({ msg: 'Not authorized to delete this task' });
        }

        await task.remove();

        // Emit task deletion event
        emitTaskUpdate(task);

        // Notify the user if the task was assigned
        if (task.assignedTo) {
            const assignedUser = await User.findById(task.assignedTo);
            await notifyUser(
                task.assignedTo,
                'Task Deleted',
                `The task "${task.title}" has been deleted.`,
                `The task "${task.title}" has been removed.`
            );
        }

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTasks = async (req, res) => {
    const { status, priority, sortBy = 'createdAt', sortOrder = 'asc' } = req.query;

    try {
        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const tasks = await Task.find(filter)
            .populate('createdBy', 'username')
            .populate('assignedTo', 'username')
            .sort({ [sortBy]: sortOrder });

        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get tasks for the authenticated user
exports.getUserTasks = async (req, res) => {
    try {
        // Find tasks created by or assigned to the user
        const tasks = await Task.find({
            $or: [
                { createdBy: req.user.id },
                { assignedTo: req.user.id }
            ]
        })
        .populate('createdBy', 'username')
        .populate('assignedTo', 'username');

        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Assign a task to a user
exports.assignTask = async (req, res) => {
    const { taskId, assignedTo } = req.body;

    try {
        // Find the task
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Validate assigned user
        const user = await User.findById(assignedTo);
        if (!user) {
            return res.status(404).json({ msg: 'Assigned user not found' });
        }

        // Check if the current user is a manager and is managing the user being assigned
        const currentUser = await User.findById(req.user.id);
        if (!currentUser.roles.includes('Manager') || !currentUser.team.includes(assignedTo)) {
            return res.status(403).json({ msg: 'Not authorized to assign tasks to this user' });
        }

        // Assign task
        task.assignedTo = assignedTo;
        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get tasks assigned to a specific user (for managers)
exports.getAssignedTasks = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const tasks = await Task.find({ assignedTo: userId })
            .populate('createdBy', 'username')
            .populate('assignedTo', 'username');

        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
