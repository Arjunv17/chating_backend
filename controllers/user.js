// Add Models
const { findOne, createHashPass, comparePass, findAll } = require('../helpers');
const userModel = require('../models/user');
const { createToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');
const { validateUser, validateEmailPass } = require('../validations/user');

// Save User 
const saveUser = async (req, res) => {
    const { first_name, last_name, email, phone_number , password} = req.body;
    try {
        // Image File
        let profileImage = req.file.originalname;
        
        // Validate User
        const userValidation = validateUser({ first_name, last_name, email, phone_number ,password});
        if (userValidation.error) {
            return errorResponse(res, 404, userValidation.error.message)
        }
        
        // Check if email already exists
        const emailExists = await findOne(userModel,{ email });
        if (emailExists) {
            return errorResponse(res, 400, 'Email already exists!!');
        }

        // Check if phone number already exists
        const phoneExists = await findOne(userModel,{ phone_number });
        if (phoneExists) {
            return errorResponse(res, 400, 'Phone Number already exists!!');
        }
        
        // Hash password
        let hashPassword = await createHashPass(password)

        // Create new user
        const newUser = new userModel({
            first_name, last_name, email, phone_number, profile_image:profileImage, password:hashPassword
        })
        // Save response
        let saveRes = await newUser.save();
        return successResponse(res, 200 , saveRes)

    } catch (error) {
        return errorResponse(res, 500, `Internal Server Error ${error.message}`)
    }
}

// Login User
const login = async (req, res) => {
    const {  email, password } = req.body;
    try {
        
        // Validate Email Password
        const emailPassValidation = validateEmailPass({ email, password });
        if (emailPassValidation.error) {
            return errorResponse(res, 404, emailPassValidation.error.message)
        }
        
        // Check email  
        const emailExists = await findOne(userModel,{ email });
        if (!emailExists) {
            return errorResponse(res, 400, 'Incorrect email!!');
        }

        // Compare Password
        let passMatch = await comparePass(password, emailExists.password)
        if (!passMatch) return errorResponse(res, 404, 'Incorrect Password')

        //Create Token
        let token =  await createToken(emailExists , '60min')
        
        return successResponse(res, 200 , {...emailExists.toObject(), token})

    } catch (error) {
        return errorResponse(res, 500, `Internal Server Error ${error.message}`)
    }
}


// Get User
const getalluser = async (req, res) => {
    try {
        // Find All Users
        const allUsers = await findAll(userModel,{});
        if (!allUsers) {
            return errorResponse(res, 400, 'No user found!!');
        }

        // Sent Response
        return successResponse(res, 200 , allUsers)

    } catch (error) {
        return errorResponse(res, 500, `Internal Server Error ${error.message}`)
    }
}
module.exports = {
    saveUser,
    login,
    getalluser
}