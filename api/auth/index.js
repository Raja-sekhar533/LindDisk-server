const router = require("express").Router();
const controller = require("./auth.controller");


router.post('/signup', controller.Signup);
router.post('/login', controller.login);
router.post('/adminlogin', controller.AdminLogin);
router.post('/adminsignup', controller.AddAdmin);
router.get('/getRevenueById/:id', controller.getRevenueById);


module.exports = router;