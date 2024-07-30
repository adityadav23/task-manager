const http = require('http');
const socketIo = require('socket.io');
const app = require('./app'); // Import the app configuration

const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.io

// Handle real-time events
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
