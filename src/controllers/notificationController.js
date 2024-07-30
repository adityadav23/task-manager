const User = require('../models/User');

// Get notification preferences
exports.getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.notificationPreferences);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update notification preferences
exports.updatePreferences = async (req, res) => {
    const { email, sms } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.notificationPreferences.email = email;
        user.notificationPreferences.sms = sms;

        if (sms && !user.phoneNumber) {
            return res.status(400).json({ msg: 'Phone number is required for SMS notifications' });
        }

        await user.save();
        res.json(user.notificationPreferences);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
