const mongoose = require('mongoose');
const NotificationSchema = mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admins'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    message: {
        type: String,
    },
    read: {
        type: String,
        enum: ['Yes', 'No']
    },
    date: {
        type: Date
    }
})

module.exports = mongoose.model('Notofications', NotificationSchema);