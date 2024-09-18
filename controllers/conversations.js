// Add Models
const mongoose  = require('mongoose');
const { findOne } = require('../helpers');
const { Conversation } = require('../models/conversations');
const { successResponse, errorResponse } = require('../utils/response');

// Save Conversation 
const save = async (req, res) => {
    try {
        const { receiver_id } = req.body;
        const userId = req.user ? req.user.id : null;

        // Check if a conversation between the two users exists
        let conversation = await findOne(Conversation, {
            participants: { $all: [userId, receiver_id] }
        });

        // If conversation doesn't exist, create it
        if (!conversation) {
            conversation = new Conversation({ participants: [userId, receiver_id] });
            await conversation.save();
        }

        return successResponse(res, 200, conversation);

    } catch (error) {
        return errorResponse(res, 500, `Internal Server Error ${error.message}`)
    }
}

// Get Conversation 
const getConversation = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        const conversationData = await Conversation.aggregate([
            {
                $match: { participants: new mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'messages',
                    let: { lastMessageId: '$last_message' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$lastMessageId'] // Match message with the last_message field
                                }
                            }
                        }
                    ],
                    as: 'lastMessage'
                }
            },
            {
                $unwind: {
                    path: '$lastMessage',
                    preserveNullAndEmptyArrays: true // Preserve conversations without a last message
                }
            },
            {
                // Determine the other participant based on the logged-in user
                $addFields: {
                    actualReceiverId: {
                        $cond: [
                            { $eq: [{ $arrayElemAt: ['$participants', 0] }, new mongoose.Types.ObjectId(userId)] },
                            { $arrayElemAt: ['$participants', 1] }, // If logged in user is the first participant, pick the second
                            { $arrayElemAt: ['$participants', 0] }  // Otherwise, pick the first
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'actualReceiverId',
                    foreignField: '_id',
                    as: 'receiverDetails'
                }
            },
            {
                $unwind: {
                    path: '$receiverDetails',
                    preserveNullAndEmptyArrays: true // Preserve conversations with no receiver details
                }
            },
            // Add lookup to get contact details by phone number
            {
                $lookup: {
                    from: 'contacts', // Assuming the collection name is 'contacts'
                    localField: 'receiverDetails.phone_number', // The phone number from receiver details
                    foreignField: 'phone_number', // The phone number field in the contacts collection
                    as: 'contactDetails'
                }
            },
            {
                $unwind: {
                    path: '$contactDetails',
                    preserveNullAndEmptyArrays: true // Preserve conversations with no matching contacts
                }
            },
            {
                $project: {
                    _id: 1,
                    participants: 1,
                    lastMessage: {
                        _id: 1,
                        message: 1,
                        status: 1,
                        receiver_id: 1,
                        sender_id: 1,
                        createdAt: 1,
                        conversation_id: 1
                    },
                    receiverDetails: {
                        _id: 1,
                        first_name: 1,
                        last_name: 1,
                        profile_image: 1,
                        status: 1,
                        phone_number: 1
                    },
                    // Add contact details in the response
                    contactDetails: {
                        _id: 1,
                        name: 1, // Assuming the contact has a 'name' field
                        phone_number: 1,
                        user_id: 1
                    }
                }
            },
            {
                $sort: { 'lastMessage.createdAt': -1 } // Sort by the latest message
            }
        ]);

        return successResponse(res, 200, conversationData);

    } catch (error) {
        return errorResponse(res, 500, `Internal Server Error ${error.message}`);
    }
};


module.exports = {
    save,
    getConversation
}