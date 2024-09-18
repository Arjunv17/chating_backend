// Add Models
const io = require('../server');
const { Message } = require('../models/messages');
const { Conversation } = require('../models/conversations');
const { successResponse, errorResponse } = require('../utils/response');
const { validateMessage } = require('../validations/message');
const { findOne, findAll } = require('../helpers');

// Sent Messages to User 
const sentMessage = async (req, res) => {
    try {
        const { sender_id,receiver_id, message } = req.body;
        // Get User ID by Token
        const userId = req.user ? req.user.id : null;

        // Image File
        let attachmentFiles = req.files;
        let fileArr = [];
        attachmentFiles?.map((value) => fileArr.push(value?.originalname));

        // Validate Messages
        const messageValidation = validateMessage({ sender_id,receiver_id, message });
        if (messageValidation.error) {
            return errorResponse(res, 404, messageValidation.error.message)
        }
        // Find existing conversation or create a new one
        let conversation = await findOne(Conversation, {
            participants: { $all: [sender_id, receiver_id] }
        });

        // Create new conversation
        if (!conversation) {
            conversation = new Conversation({ participants: [sender_id, receiver_id] });
            await conversation.save();
        }

        // Create a new message
        const newMessage = new Message({
            sender_id: sender_id,
            receiver_id,
            conversation_id: conversation._id,
            message,
            status: 'sent',
            attachments: fileArr
        });
        await newMessage.save();

        // Update last message in the conversation
        conversation.last_message = newMessage._id;
        await conversation.save();

        return successResponse(res, 201, newMessage);
    } catch (error) {
        console.error(error);
        return errorResponse(res, 500, `Internal Server Error ${error.message}`);
    }
}

// Get Messages
const getMessage = async (req, res) => {
    try {
        const { conversationId } = req.query;
        // Fetch messages that match the conversation ID
        const messages = await findAll(Message, { conversation_id: conversationId }) // Use .find() instead of findAll
            .sort({ createdAt: 1 }) // Sort by timestamp in ascending order
            .exec();

        // If no messages found, return a 404 response
        if (!messages) {
            return errorResponse(res, 404, 'No messages found for this conversation.');
        }

        return successResponse(res, 200, messages);

    } catch (error) {
        console.error(error);
        return errorResponse(res, 500, `Internal Server Error ${error.message}`);
    }
}


module.exports = {
    sentMessage,
    getMessage
}