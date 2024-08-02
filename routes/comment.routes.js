const express = require('express');
const {addComment,getVideoComments} = require("../controllers/comment.controller");
const {COMMENT_ROUTES} = require("../constants/endpoint");
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

router.post(COMMENT_ROUTES.ADD_COMMENTS,verifyJWT,addComment);

router.get(COMMENT_ROUTES.GET_COMMENTS,getVideoComments);

module.exports = router;