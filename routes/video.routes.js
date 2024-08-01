const express = require('express');
const {publishVideo,getVideoById,getAllVideos} = require("../controllers/video.controller");
const upload = require('../middlewares/multer.middleware');
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/publish", verifyJWT , upload.fields([
        { name:"videoFile",maxCount:1},
        {name:"thumbnail",maxCount:1}
    ]),
    publishVideo
);

router.get("/getVideo/:videoId",getVideoById);

router.get("/getAllVideo",getAllVideos);

module.exports = router;