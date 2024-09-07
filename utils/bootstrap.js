// utils/bootstrap.js
const { createHashPass } = require('../helpers');
const userModel = require('../models/user');
const { successResponse, errorResponse } = require('./response');

// This function does not need req or res
const bootstrapAdmin = async () => {
    try {
        let myPassword = 'arjun@123';
        let email= "arjun@yopmail.com";
        // Check if an admin already exists
        let user = await userModel.findOne({ email });
        if (user) {
            console.log('Admin already exists!');
            return;
        }
        
        let hashPass = await createHashPass(myPassword)
        // Prepare admin data
        let adminData = {
            first_name: "Arjun",
            last_name: "Verma",
            email: email,
            phone_number: 1234567895,
            profile_image: null,
            role: 'user',
            password: hashPass,
            status:'offline'
        };

        // Create a new user instance and save it
        const addFirstUser = new userModel(adminData);
        await addFirstUser.save();
        console.log('Admin added successfully!');
    } catch (error) {
        console.error("Error adding admin:", error.message);
    }
};

module.exports = bootstrapAdmin;
