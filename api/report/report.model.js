const mongoose = require('mongoose');
const ReportSchema = mongoose.Schema({
    videourl: {
        type: String,
    },
    filetitle: {
        type: String
    },
})

module.exports = mongoose.model('Reports', ReportSchema);