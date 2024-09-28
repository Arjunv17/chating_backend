let activeUsers = {};

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Add user to active users when they join
        socket.on('joinChat', (userId) => {
            activeUsers[userId] = socket.id;
            console.log(`User ${userId} connected to socket: ${socket.id}`);

             // Notify all users that this user is online
             io.emit('userStatusUpdate', { userId, status: 'online' });
        });

        // Handle message sending
        socket.on('sendMessage', (messageData) => {
            const receiverSocket = activeUsers[messageData.receiver_id];
            if (receiverSocket) {
                io.to(receiverSocket).emit('receiveMessage', messageData);
            }
        });
        socket.on('messageSent', (message, callback) => {
            console.log('Custom event messageSent received:', message);
            // Broadcast the message to other clients or update the conversation thread
            socket.broadcast.emit('messageSent', message);

            // Send acknowledgment back to client
            callback('messageSent event received');
        });

        socket.on('messageStart', (message, callback) => {
            console.log('Custom event messageStart received:', message);
            // Broadcast the message to other clients or update the conversation thread
            socket.broadcast.emit('messageStart', message);

            // Send acknowledgment back to client
            callback('messageStart event received');
        });

        // Handle user logout and status update
        socket.on('logout', (userId) => {
            console.log(`User ${userId} logged out`);

            // Broadcast status update to all users
            io.emit('userStatusUpdate', { userId, status: 'offline' });

            // Remove the user from active users list
            delete activeUsers[userId];
        });
        // Handle user disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            Object.keys(activeUsers).forEach((userId) => {
                if (activeUsers[userId] === socket.id) {
                    delete activeUsers[userId];
                    io.emit('userStatusUpdate', { userId, status: 'offline' }); // Broadcast disconnect
                }
            });
        });
    });
};

module.exports = { setupSocket };
