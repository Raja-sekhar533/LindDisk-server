const router = require("express").Router();
const controller = require("./video.controller");
const multer = require('multer');

// router.get("/", controller.getAllBrand);
// router.get("/:id", controller.getBrandbyId);
// router.post("/filter", controller.filterBrand);
// router.delete("/:id", controller.deleteBrandById);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage }, { fileFilter: fileFilter });
router.post('/', upload.single('linediskvideo'), controller.PostVideo);
router.get("/getvideos/:id", controller.getVideosById);
router.get("/getVideoById/:id", controller.getVideoById);
router.put("/updateById/:id", controller.UpdateById);
router.delete("/deleteVideoById/:id", controller.deleteVideo);
router.get('/getallvideos/:id', controller.getAllVideos);
router.post('/addView', controller.addViewCount);
router.get("/revenue/:id", controller.getTotalRevenue);
router.post("/savetomydisk/:id", controller.savetomydisk);
router.post("/isVideoSaved", controller.isVideoSaved);
module.exports = router;