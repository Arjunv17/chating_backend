const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, require: true, default: '' },
    last_name: { type: String, require: false, default: '' },
    email: { type: String, require: true, default: '' },
    phone_number: { type: String, require: true, default: '' },
    password: { type: String, require: true, default: '' },
    role: { type: String, enum: ['user', 'admin'], require: true, default: 'user' },
    status: { type: String, enum: ['online', 'offline'], require: true, default: 'offline' },
    profile_image: { type: String, require: false, default: '' },
    is_blocked: { type: Boolean, default: false },
},
    { timestamps: true, versionKey: false }
)
const User = mongoose.model('users', UserSchema);

module.exports = User;

