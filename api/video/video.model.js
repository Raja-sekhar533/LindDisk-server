const mongoose = require('mongoose');
const VideoSchema = mongoose.Schema({
    videourl: {
        type: String,
    },
    filetitle: {
        type: String
    },
    fileDescription: {
        type: String
    },
    fileSize: {
        type: String
    },
    date: {
        type: Date
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    views: {
        type: Number
    },
    revenue: {
        type: Number
    }
})

module.exports = mongoose.model('Videos', VideoSchema);