const mongoose = require('mongoose');

const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.DBURL);
        console.log("Connected to MongoDB!!")
    } catch (error) {
        console.log("Db Connection Error!!")
        
    }
}

module.exports = connectDb;
