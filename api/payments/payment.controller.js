const PaymentModel = require("./payment.model");
const videoModel = require("../video/video.model");
const authModel = require("../auth/auth.model.js");
const skt = require('../notifications/notif.controller');
const jwt = require('jsonwebtoken');
const paymentModel = require("./payment.model");
module.exports = {
    postPaymentRequest: async(req, res) => {
        const token = req.params.id;
        const decoded = jwt.decode(token, "LineDisk");
        const _id = decoded.subject
        const data = req.body.data;
        const paymentReq = new PaymentModel();
        paymentReq.userId = _id;
        paymentReq.mobileUPI = data.mobileUpi;
        paymentReq.amount = data.amount;
        paymentReq.status = 'Auditing';
        paymentReq.paymentType = req.body.PaymentType;
        paymentReq.date = new Date();

        try {
            const confirm = paymentReq.save();
            if (confirm) {
                const revenue = await authModel.findById(_id)

                const addrevenue = await authModel.findByIdAndUpdate(_id, { $set: { revenue: revenue.revenue - data.amount } }, { new: true });
                skt.postPaymentRequest(revenue)
                res.status(200).json({ status: true });
            }
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getPaymentsById: async(req, res) => {
        const token = req.params.id;
        const decoded = jwt.decode(token, "LineDisk");
        const _id = decoded.subject
        try {
            const paymentDetails = await paymentModel.find({ userId: _id });
            if (paymentDetails) {
                res.status(200).json({ status: true, data: paymentDetails })
            } else {
                res.status(200).json({ status: false })
            }
        } catch (e) {
            res.status(400).send(e.message);
        }
    },
    updateById: async(req, res) => {
        const token = req.params.id;
        const decoded = jwt.decode(token, "LineDisk");
        const _id = decoded.subject;

        try {
            if (_id) {
                const pId = req.body.pId;
                let pStatus = await PaymentModel.findByIdAndUpdate(pId, { $set: { status: req.body.status } }, { new: true });
                if (pStatus) {
                    res.status(200).json({ status: true })
                } else {
                    res.status(200).json({ status: false })
                }
            }
        } catch (e) {
            res.status(400).send(e.message);
        }
    },
    getAllPayments: async(req, res) => {
        const token = req.params.id;
        const decoded = jwt.decode(token, "LineDisk");
        const _id = decoded.subject;
        try {
            if (_id) {
                let paymentDetails = await paymentModel.find();
                res.status(200).json({ data: paymentDetails })
            }
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
}