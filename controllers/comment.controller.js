const mongoose = require('mongoose');
const Video = require("../models/video.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const addComment = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const {content} = req.body;
    const userId = req.user?._id;

    if(!content){
        throw new ApiError(400, "Comment content is required");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        user: userId
    });

    return res.status(201).json(new ApiResponse(200,comment,"Comment added successfully"));
});

const getVideoComments = asyncHandler(async (req,res)=>{
    const {videoId} = req.params;
    
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }

    const comments = await Comment.find({video: videoId})
        .populate("owner", "username")
        .select("content");

    const totalCount = await Comment.countDocuments({video: videoId});

    return res.status(200).json(new ApiResponse(200,{
        videoId,
        comments,
        totalCount
    },
    "Comments Retrived Successfully"
));
})

module.exports = {
    addComment,
    getVideoComments
}