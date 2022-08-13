const router = require("express").Router();
const controller = require("./report.controller");


router.post('/sendReport', controller.sendReport);


module.exports = router;