const mongoose = require('mongoose');
const viewSchema = mongoose.Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Videos'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    date: {
        type: Date
    },
    ipAddress: {
        type: String
    }
})

module.exports = mongoose.model('Views', viewSchema);