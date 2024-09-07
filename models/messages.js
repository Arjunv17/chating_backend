const mongoose = require('mongoose');

// Create Message Schema
const MessageSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    recipient_id: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    conversation_id: { type: mongoose.Types.ObjectId, ref: 'conversations', required: true },
    message: { type: String, required: true },
    attachments: { type: Array, required: false },
    status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' }
},
    { timestamps: true, versionKey: false }
);

// Create Message model
const Message = mongoose.model('messages', MessageSchema);

// Create Message Indexes
const createMessageIndexes = async () => {
    try {
        await Message.collection.createIndex({ conversation_id: 1 });
        await Message.collection.createIndex({ sender_id: 1 });
        await Message.collection.createIndex({ createdAt: 1 });
    } catch (error) {
        console.error("Error creating Message indexes:", error);
    }
};

module.exports = { Message, createMessageIndexes };