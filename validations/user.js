const Joi = require('joi');


const userSchema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).required(),
    last_name: Joi.string().alphanum().min(3).max(30).optional(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone_number: Joi.string().pattern(/^\d{10}$/).required(),
    password: Joi.string().required(),

})

const emailPassSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required(),
})

const validateUser = (user) => {
    return userSchema.validate(user)
}
const validateEmailPass = (user) => {
    return emailPassSchema.validate(user)
}


module.exports = {
    validateUser,
    validateEmailPass
}