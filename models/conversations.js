    const mongoose = require('mongoose');

    // Create Conversation Schema
    const ConversationSchema = new mongoose.Schema({
        participants: [{ type: mongoose.Types.ObjectId, ref: 'user', required: true }], // Array of participants (user IDs)
        last_message: { type: mongoose.Types.ObjectId, ref: 'messages', required: false }, // Reference to the last message in the conversation
        // group_name: { type: String, required: false }, // Optional, for group conversations
        // is_group: { type: Boolean, default: false }, // Indicates if the conversation is a group chat
    },
        { timestamps: true, versionKey: false } // Automatically adds createdAt and updatedAt fields
    );

    // Create Conversation model
    const Conversation = mongoose.model('conversations', ConversationSchema);

    // Create Conversation Indexes
    const createConversationIndexes = async () => {
        try {
            await Conversation.collection.createIndex({ participants: 1 });
            await Conversation.collection.createIndex({ createdAt: 1 });
        } catch (error) {
            console.error("Error creating Conversation indexes:", error);
        }
    };

    module.exports = { Conversation, createConversationIndexes };
