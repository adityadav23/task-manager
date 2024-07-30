const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const { notifyUser } = require('../utils/notifications');

// Schedule to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    try {
        const tasks = await Task.find({
            dueDate: {
                $gte: today,
                $lt: tomorrow
            }
        });

        for (const task of tasks) {
            if (task.assignedTo) {
                const user = await User.findById(task.assignedTo);
                await notifyUser(
                    task.assignedTo,
                    'Task Due Tomorrow',
                    `Reminder: The task "${task.title}" is due tomorrow.`,
                    `Reminder: Your task "${task.title}" is due on ${task.dueDate}.`
                );
            }
        }

        console.log('Due date reminders sent.');
    } catch (err) {
        console.error('Error sending due date reminders:', err.message);
    }
});
