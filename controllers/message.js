// Add Models
const { findOne, createHashPass, comparePass, findAll } = require('../helpers');
const messageModel = require('../models/messages');
const { createToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');
const { validateUser, validateEmailPass } = require('../validations/user');

// Sent Messages to User 
const sentMessage = async (req, res) => {
    const { sender_id, recipient_id, conversation_id, message , status} = req.body;
    try {
        // Image File
        let attachmentsFiles = req.files;
        console.log(attachmentsFiles)
        // // Validate User
        // const userValidation = validateUser({ first_name, last_name, email, phone_number ,password});
        // if (userValidation.error) {
        //     return errorResponse(res, 404, userValidation.error.message)
        // }
        
        // // Check if email already exists
        // const emailExists = await findOne(userModel,{ email });
        // if (emailExists) {
        //     return errorResponse(res, 400, 'Email already exists!!');
        // }

        // // Check if phone number already exists
        // const phoneExists = await findOne(userModel,{ phone_number });
        // if (phoneExists) {
        //     return errorResponse(res, 400, 'Phone Number already exists!!');
        // }
        
        // // Hash password
        // let hashPassword = await createHashPass(password)

        // // Create new user
        // const newUser = new userModel({
        //     first_name, last_name, email, phone_number, profile_image:profileImage, hashPassword
        // })
        // // Save response
        // let saveRes = await newUser.save();
        // return successResponse(res, 200 , saveRes)

    } catch (error) {
        return errorResponse(res, 500, `Internal Server Error ${error.message}`)
    }
}

module.exports = {
    sentMessage
}