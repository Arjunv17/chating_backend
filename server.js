// Require Packages
const express = require('express');
const routes = require('./routes/index')
const cors = require('cors');
const path = require('path');
const bootstrapAdmin = require('./utils/bootstrap');
const dbConnection = require('./config/connection')
require('dotenv').config();
const app = express();
app.use(express.json());
app.use('/api', routes)


// Db Connection 
dbConnection()

// Express Static Path to Get Photos Media
app.use('uploads', express.static(path.join(__dirname, 'public/uploads')))

// CORS Policy Enabled
const corsOptions = {
    origin: '*',
    method: 'GET,POST,PUT,DELETE,PATCH',
    credential: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))


// Checking on Browser the Project are Running Fine or Not
app.get('/', (req, res) => {
    res.write("Project Running Smoothly!!");
    res.end();
})


// Server Running Port
const PORT = process.env.PORT || 5800;
app.listen(PORT, () => {
    bootstrapAdmin()
    console.log(`Project is Running on ${PORT}`)
})