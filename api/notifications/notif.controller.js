const PaymentModel = require("../payments/payment.model");
const notification = require('./notification.model');
const jwt = require('jsonwebtoken');

module.exports = {
    AddNotofication: async(req, res) => {
        const token = req.params.id;
        const decoded = jwt.decode(token, "LineDisk");
        const _id = decoded.subject;
        try {
            const data = req.body;
            console.log(data, "datasasdkjkasdb")
            const paymentReq = new notification();
            paymentReq.adminId = _id;
            paymentReq.userId = data.userId;
            paymentReq.message = data.message;
            paymentReq.read = 'No';
            paymentReq.date = new Date();

            const notif = paymentReq.save();
            if (notif) {
                res.status(200).send({ status: true })
            } else {
                res.status(200).send({ status: true })
            }

        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    getNotificationsById: async(req, res) => {
        console.log(req.params.id)
        if (req.params.id != "null") {
            const token = req.params.id;
            const decoded = jwt.decode(token, "LineDisk");
            const _id = decoded.subject;
            try {
                let notifications = await notification.find({ userId: _id });
                if (notifications) {
                    res.status(200).json({ status: true, data: notifications })
                } else {
                    res.status(200).json({ status: false })
                }
            } catch (err) {
                res.status(400).send(err.message);
            }
        }
    },

    updateNotificationsById: async(req, res) => {
        const token = req.params.id;

        try {
            let updateNotif = await notification.findByIdAndUpdate(token, { $set: { read: 'Yes' } }, { new: true });
            if (updateNotif) {
                res.status(200).json({ status: true });
            } else {
                res.status(200).json({ status: false });
            }
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
}