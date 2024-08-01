const express = require('express');
const {likeVideo,getLikedVideos} = require("../controllers/like.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/:videoId",likeVideo);

router.get("/liked-videos",getLikedVideos);

module.exports = router;