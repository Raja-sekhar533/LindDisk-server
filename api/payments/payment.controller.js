const PaymentModel = require("./payment.model");
const videoModel = require("../video/video.model");
const authModel = require("../auth/auth.model.js");
const paymentModel = require("./payment.model");
module.exports = {
    postPaymentRequest: async(req, res) => {
        const token = req.params.id;
        const decoded = jwt.decode(token, "LineDisk");
        const _id = decoded.subject
        const data = req.body.data;
        console.log("#@#@#@" + req.body.paymentType)
        const paymentReq = new PaymentModel();
        paymentReq.userId = _id;
        paymentReq.mobileUPI = data.mobileUpi;
        paymentReq.amount = data.amount;
        paymentReq.status = 'InProgress';
        paymentReq.paymentType = req.body.PaymentType;
        paymentReq.date = new Date();

        try {
            const confirm = paymentReq.save();
            if (confirm) {
                const revenue = await authModel.findById(_id)

                const addrevenue = await authModel.findByIdAndUpdate(_id, { $set: { revenue: revenue.revenue - data.amount } }, { new: true });
                console.log(addrevenue);

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
    }
}