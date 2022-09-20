const router = require("express").Router();
const controller = require("./payment.controller");


router.post('/paymentReq/:id', controller.postPaymentRequest);
router.get("/getPaymentsById/:id", controller.getPaymentsById);
router.post("/updateById/:id", controller.updateById);
router.get('/getAllPayments/:id', controller.getAllPayments);

module.exports = router;