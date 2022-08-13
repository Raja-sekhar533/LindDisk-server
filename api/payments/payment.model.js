const mongoose = require('mongoose');
const PaymentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    mobileUPI: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['InProgress', 'Approved', 'Rejected']
    },
    paymentType: {
        type: String,
        enum: ['GPAY', 'PHPAY', 'PTMPAY']
    },
    date: {
        type: Date
    }
})

module.exports = mongoose.model('Payments', PaymentSchema);