const Task = require('../models/Task');
const User = require('../models/User');

// Get task statistics
exports.getTaskStats = async (req, res) => {
    try {
        const completedCount = await Task.countDocuments({ status: 'Completed' });
        const pendingCount = await Task.countDocuments({ status: 'Pending' });
        const overdueCount = await Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: 'Completed' } });

        res.json({
            completed: completedCount,
            pending: pendingCount,
            overdue: overdueCount
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get task completion statistics by user
exports.getUserStats = async (req, res) => {
    try {
        const users = await User.find();

        const userStats = await Promise.all(users.map(async (user) => {
            const completedCount = await Task.countDocuments({ assignedTo: user._id, status: 'Completed' });
            const pendingCount = await Task.countDocuments({ assignedTo: user._id, status: 'Pending' });
            const overdueCount = await Task.countDocuments({
                assignedTo: user._id,
                dueDate: { $lt: new Date() },
                status: { $ne: 'Completed' }
            });

            return {
                user: user.username,
                completed: completedCount,
                pending: pendingCount,
                overdue: overdueCount
            };
        }));

        res.json(userStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get task completion statistics by team (assuming team info is part of user model)
exports.getTeamStats = async (req, res) => {
    try {
        const teams = await User.aggregate([
            { $group: { _id: '$team', users: { $push: '$username' } } }
        ]);

        const teamStats = await Promise.all(teams.map(async (team) => {
            const completedCount = await Task.countDocuments({
                assignedTo: { $in: await User.find({ team: team._id }).select('_id') },
                status: 'Completed'
            });
            const pendingCount = await Task.countDocuments({
                assignedTo: { $in: await User.find({ team: team._id }).select('_id') },
                status: 'Pending'
            });
            const overdueCount = await Task.countDocuments({
                assignedTo: { $in: await User.find({ team: team._id }).select('_id') },
                dueDate: { $lt: new Date() },
                status: { $ne: 'Completed' }
            });

            return {
                team: team._id,
                completed: completedCount,
                pending: pendingCount,
                overdue: overdueCount
            };
        }));

        res.json(teamStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
