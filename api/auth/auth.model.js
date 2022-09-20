const mongoose = require('mongoose');
const authSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required: true
    },
    password: {
        type: String
    },
    revenue: { type: Number },
    role: {
        type: String,
        enum: ['ADMINISTRATOR', 'User']

    }
})

module.exports = mongoose.model('Users', authSchema);