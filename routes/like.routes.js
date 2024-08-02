const express = require('express');
const {likeVideo,getLikedVideos} = require("../controllers/like.controller");
const {LIKE_ROUTES} = require("../constants/endpoint");
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

router.post(LIKE_ROUTES.ADD_LIKE,likeVideo);

router.get(LIKE_ROUTES.GET_LIKED_VIDEOS,getLikedVideos);

module.exports = router;