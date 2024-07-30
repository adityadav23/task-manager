const User = require('../models/User');

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password field
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get Team Members (Manager Only)
exports.getTeamMembers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        if (!user.roles.includes('Manager')) {
            return res.status(403).json({ msg: 'Access denied' });
        }
        
        // Assuming 'team' field in User model to get team members; adjust according to your model
        const teamMembers = await User.find({ _id: { $in: user.team } }).select('-password');
        res.json(teamMembers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
