const Joi = require('joi');


const contactSchema = Joi.object({
    name: Joi.string().required(),
    phone_number: Joi.string().pattern(/^\d{10}$/).required()
})

const validateContact = (contact) => {
    return contactSchema.validate(contact)
}

module.exports = {
    validateContact
}