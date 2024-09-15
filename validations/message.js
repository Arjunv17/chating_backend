const Joi = require('joi');
const  mongoose = require('mongoose');

// Custom Joi validation for ObjectId
const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message(`Invalid ObjectId: ${value}`);
    }
    return value;  // If valid, return the value
}, 'ObjectId validation');

const messageSchema = Joi.object({
    receiver_id: objectId.required(),
    message: Joi.string().required(),
});

const validateMessage = (user) => {
    return messageSchema.validate(user)
}



module.exports = {
    validateMessage
}