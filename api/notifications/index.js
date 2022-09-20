const router = require("express").Router();
const controller = require("./notif.controller");


router.post('/addNotification/:id', controller.AddNotofication);
router.get('/getNotificationsById/:id', controller.getNotificationsById);
router.get('/updateNotificationsById/:id', controller.updateNotificationsById);



module.exports = router;