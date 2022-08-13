const router = require("express").Router();
const controller = require("./payment.controller");


router.post('/paymentReq/:id', controller.postPaymentRequest);
router.get("/getPaymentsById/:id", controller.getPaymentsById);

module.exports = router;