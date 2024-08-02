const express = require('express');
const {publishVideo,getVideoById,getAllVideos,downloadVideo} = require("../controllers/video.controller");
const {VIDEO_ROUTES} = require("../constants/endpoint");
const upload = require('../middlewares/multer.middleware');
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

router.post(VIDEO_ROUTES.PUBLISH_VIDEO, verifyJWT , upload.fields([
        { name:"videoFile",maxCount:1},
        {name:"thumbnail",maxCount:1}
    ]),
    publishVideo
);

router.get(VIDEO_ROUTES.GET_VIDEO_BY_ID,getVideoById);

router.get(VIDEO_ROUTES.GET_ALL_VIDEOS,getAllVideos);

router.get(VIDEO_ROUTES.DOWNLOAD_VIDEO,downloadVideo);

module.exports = router;