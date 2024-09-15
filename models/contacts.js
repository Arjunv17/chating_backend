const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: { type: String, require: true, default: '' },
    phone_number: { type: String, require: true, default: '' },
    user_id: { type: mongoose.Types.ObjectId, ref:'users' , require: true, default: '' },
    is_blocked: { type: Boolean, default: false },
},
    { timestamps: true, versionKey: false }
)


const Contact = mongoose.model('contacts', ContactSchema)

// Create Indexes
const createContactIndexes = async () => {
    try {
        await Contact.collection.createIndex({ user_id: 1 });
        await Contact.collection.createIndex({ phone_number: 1 });
    } catch (error) {
        console.error("Error creating Contact indexes:", error);
    }
};

module.exports = { Contact, createContactIndexes };

