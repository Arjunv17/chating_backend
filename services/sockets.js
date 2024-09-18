let activeUsers = {};

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Add user to active users when they join
        socket.on('joinChat', (userId) => {
            activeUsers[userId] = socket.id;
            console.log(`User ${userId} connected to socket: ${socket.id}`);
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

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            // Remove user from active users
            Object.keys(activeUsers).forEach((userId) => {
                if (activeUsers[userId] === socket.id) {
                    delete activeUsers[userId];
                }
            });
        });
    });
};

module.exports = { setupSocket };
