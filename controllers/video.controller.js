const mongoose = require('mongoose');
const Video = require("../models/video.model");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");


const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { videoFile, thumbnail } = req.files;

    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    const owner = await User.findById(req.user?._id).select('username');
    if (!owner) {
        throw new ApiError(404, "User not found");
    }

    let videoUrl, thumbnailUrl, duration;
    try {
        const videoResult = await uploadOnCloudinary(videoFile[0].path);
        if (!videoResult) throw new ApiError(500, 'Failed to upload video to Cloudinary');
        videoUrl = videoResult.url;
        duration = videoResult.duration;

        const thumbnailResult = await uploadOnCloudinary(thumbnail[0].path);
        if (!thumbnailResult) throw new ApiError(500, 'Failed to upload thumbnail to Cloudinary');
        thumbnailUrl = thumbnailResult.url;
    } catch (error) {
        throw new ApiError(500, error.message);
    }

    const newVideo = await Video.create({
        videoFile:videoUrl,
        thumbnail: thumbnailUrl,
        title,
        description,
        duration,
        owner
    });

    return res.status(201).json(new ApiResponse(200,newVideo,"Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, 'Invalid video ID');
    }

    const video = await Video.findById(videoId).populate('owner', 'username');

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(new ApiResponse(200, video, "Video retrieved successfully"));
});

const getAllVideos = asyncHandler(async (req,res)=>{
    const {page=1,limit=10,query="",sortBy='createdAt',sortType='desc',userId} = req.query;

    const pageNumber = parseInt(page,10);
    const pageSize = parseInt(limit,10);

    const filter = {};

    if(query){
        filter.$or = [
            {title:{$regex:query,$options:'i'}},
            {description:{$regex:query,$options:'i'}}
        ];
    }

    if(userId){
        filter.owner = mongoose.Types.ObjectId(userId);
    }

    const sort = {};
    sort[sortBy] = sortType==='asc'? 1 : -1;

    const videos = await Video.find(filter)
        .populate('owner','username')
        .sort(sort)
        .skip((pageNumber - 1)*pageSize)
        .limit(pageSize);

    const totalCount = await Video.countDocuments(filter);

    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json(new ApiResponse(200,{
        videos,
        pagination:{
            totalItems:totalCount,
            totalPages,
            currentPage:pageNumber,
            pageSize
        }
    },'Videos retrieved successfully'));
});

const downloadVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, 'Invalid video ID');
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, 'Video not found');
    }

    const videoUrl = video.videoFile;

    res.setHeader('Content-Disposition',`attachment; filename="${video.title}.mp4"`);
    res.setHeader('Content-Type','application/octet-stream');

    return res.redirect(videoUrl);
});

module.exports = {
    publishVideo,
    getVideoById,
    getAllVideos,
    downloadVideo
}