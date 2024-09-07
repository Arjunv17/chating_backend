const mongoose = require('mongoose');
const { createContactIndexes } = require('../models/contacts');
const { createConversationIndexes } = require('../models/conversations');
const { createMessageIndexes } = require('../models/messages');

const connectDb = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DBURL);
        console.log("Connected to MongoDB!");

        // Create indexes after connection
        await createContactIndexes();
        await createConversationIndexes();
        await createMessageIndexes();

        console.log("Indexes created successfully!");

    } catch (error) {
        console.error("DB Connection or Index Creation Error:", error);
    }
};

module.exports = connectDb;
