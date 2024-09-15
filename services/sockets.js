const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
    
        // Listen for incoming messages
        socket.on('sendMessage', (messageData) => {
          // Broadcast the message to all connected clients
          io.emit('receiveMessage', messageData);
        });
    
        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
        });
      });
};

module.exports = { setupSocket };
