module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager'
};
