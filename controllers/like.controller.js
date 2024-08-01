const Like = require("../models/like.model");
const Video = require("../models/video.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const likeVideo = asyncHandler(async (req,res)=>{
    const { videoId } = req.params;

    const userId = req.user?._id;

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, 'Video not found');
    }
    
    const like = await Like.findOne({video:videoId,likedBy:userId});

    if(like){
        like.isLike = !like.isLike;
        await like.save();

        if(like.isLike){
            return res.status(200).json(new ApiResponse(200,like,"Like added successfully"))
        }else{
            await Like.deleteOne({_id:like._id});
            return res.status(200).json(new ApiResponse(200,null,"Like removed successfully"))
        }
    }else{
        const like = new Like({
            video: videoId,
            likedBy: userId,
            isLike: true
        });
        await like.save();
        return res.status(200).json(new ApiResponse(200,like,"Like added successfully"))
    }
});

const getLikedVideos = asyncHandler(async (req,res)=>{
    const userId = req.user?._id;

    const likedVideos = await Like.find({likedBy: userId})
        .populate({
            path: 'video',
            select: 'title'
        });

    const totalCount = likedVideos.length;

    return res.status(200).json(new ApiResponse(200,{
        likedVideos,
        totalCount
    },"Liked videos fetched successfully"));
})

module.exports = {
    likeVideo,
    getLikedVideos
}