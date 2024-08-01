const express = require('express');
const {addComment,getVideoComments} = require("../controllers/comment.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

router.post('/add-comment/:videoId',verifyJWT,addComment);

router.get('/get-comment/:videoId',getVideoComments);

module.exports = router;