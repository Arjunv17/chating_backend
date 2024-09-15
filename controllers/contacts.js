const  mongoose = require('mongoose');
const { findOne } = require('../helpers/index'); // Ensure findOne function is correctly implemented
const { Contact } = require('../models/contacts');
const { successResponse, errorResponse } = require('../utils/response');
const { validateContact } = require('../validations/contacts');

// Saved Contacts by Users 
const save = async (req, res) => {
    const { name, phone_number } = req.body;
    try {
        // Get User Id By Token
        let userId = req.user ? req.user.id : null; // Ensure req.user is set by authentication middleware

        // Validate Contacts
        const contactValidation = validateContact({ name, phone_number });

        if (contactValidation.error) {
            return errorResponse(res, 400, contactValidation.error.message);
        }

        // Check if phone number already exists
        const phoneExists = await findOne(Contact, { phone_number, user_id: userId });
        if (phoneExists) {
            return errorResponse(res, 400, 'Number already added in your list!!');
        }

        // Create new contact
        const newContact = new Contact({ name, phone_number, user_id: userId });

        // Save response
        let saveRes = await newContact.save();
        return successResponse(res, 201, saveRes);

    } catch (error) {
        return errorResponse(res, 500, `Internal Server Error: ${error.message}`);
    }
};


const getverify_contacts = async (req, res) => {
    try {
        let userId = req.user ? req.user?.id : null;

        if (!userId) {
            return res.status(400).send('User ID is missing');
        }

        // Aggregation pipeline for matching contacts with users
        let pipeline = [
            {
                $match: { user_id: new mongoose.Types.ObjectId(userId) }  // Match contacts by user_id
            },
            {
                $lookup: {
                    from: "users",  // Ensure this matches the collection name of your userModel
                    localField: "phone_number",  // Field in the Contact model
                    foreignField: "phone_number",  // Field in the userModel
                    as: "matchedUser",  // The resulting matched user will be stored here
                    pipeline: [
                        {
                            $project: {
                                _id: 1,  // Exclude _id (optional)
                                first_name: 1,  
                                last_name: 1,
                                phone_number:1,
                                profile_image:1,
                                status:1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    matched: { $gt: [{ $size: "$matchedUser" }, 0] },  // Check if there's a match
                }
            },
            {
                $facet: {
                    matchUser: [
                        { $match: { matched: true } },  // Only contacts with matched users
                        {
                            $project: {
                                _id: 0,
                                phone_number: 1,
                                user_id: 1,
                                name: 1,
                                matchedUser:"$matchedUser"
                            }
                        }
                    ],
                    unMatchUser: [
                        { $match: { matched: false } },  // Only contacts without matched users
                        { $project: { _id: 0, phone_number: 1, user_id: 1, name: 1 } }
                    ]
                }
            }
        ];

        // Run the aggregation query
        let result = await Contact.aggregate(pipeline);

        // Extract matched and unmatched users from the result
        let { matchUser, unMatchUser } = result[0];  // First result since $facet returns an array

        // Send response with both matched and unmatched users
        successResponse(res, 200, { matchUser, unMatchUser });
    } catch (error) {
        console.error("Error processing contacts:", error);
        res.status(500).send('Internal Server Error');
    }
};




module.exports = {
    save,
    getverify_contacts
};


