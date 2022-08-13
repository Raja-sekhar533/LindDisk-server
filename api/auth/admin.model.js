const mongoose = require('mongoose');
const AdminAuth = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

module.exports = mongoose.model('Admins', AdminAuth);