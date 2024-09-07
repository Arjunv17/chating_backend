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


module.exports = {
    save,
    getverify_contacts
};
