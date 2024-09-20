const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const routes = require('./routes/index');
const { setupSocket } = require('./services/sockets'); // Import socket setup
const dbConnection = require('./config/connection');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Use a specific origin
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Apply CORS middleware before other middleware
const corsOptions = {
  origin: ['http://localhost:5173', "*"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', routes);

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get('/', (req, res) => {
  res.send('Project Running Smoothly!!');
});

setupSocket(io); // Set up socket events

// Exporting the server for Vercel
module.exports = (req, res) => {
  // Initialize database connection
  dbConnection();

  // Use the server to handle requests
  return server(req, res);
};
// module.exports = { io };  // Export io for other files (to avoid circular dependency)
