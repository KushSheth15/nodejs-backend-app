const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const toggleSubscription = asyncHandler(async (req,res)=>{
    const {channelId} = req.params;
    const subscriberId = req.user._id;

    let subscription = await Subscription.findOne({ channel:channelId,subscriber:subscriberId});

    if(subscription){
        await Subscription.deleteOne({_id:subscription._id});
        return res.status(200).json(new ApiResponse(200,null,'Unsubscribed Successfully'));
    }else{
        subscription = new Subscription({
            channel: channelId,
            subscriber: subscriberId
        });
        await subscription.save();
        return res.status(200).json(new ApiResponse(200,subscription,'Subscribed Successfully'));
    }
});

const getUserChannelSubscribers = asyncHandler(async (req,res)=>{
    const {channelId} = req.params;

    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(404, 'Channel not found');
    }

    const subscribers = await Subscription.find({channel: channelId}).populate('subscriber', 'username');

    return res.status(200).json(new ApiResponse(200,subscribers,'Subscribers retrieved successfully'));
})

module.exports = {
    toggleSubscription,
    getUserChannelSubscribers
}