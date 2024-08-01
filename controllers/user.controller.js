const asyncHandler = require('../utils/asyncHandler');
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const ApiError = require('../utils/apiError');
const User = require("../models/user.model");
const uploadOnCloudinary = require("../utils/cloudinary");
const ApiResponse = require("../utils/apiResponse");
const { default: mongoose } = require('mongoose');

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array().map(err => err.msg).join(', '));
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new ApiError(409, 'Username or email already exists');
    }

    const avatarLocal = req.files?.avatar[0]?.path;

    let coverImageLocal;
    if (req.files && Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0) {
        coverImageLocal = req.files.coverImage[0].path;
    }

    if (!avatarLocal) {
        throw new ApiError(400, 'Avatar is required');
    };

    const avatar = await uploadOnCloudinary(avatarLocal);
    const coverImage = coverImageLocal ? await uploadOnCloudinary(coverImageLocal) : null;

    if (!avatar) {
        throw new ApiError(400, 'Avatar file is required');
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, 'Failed to register user');
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));

});

const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;
    if (!(username || email)) {
        throw new ApiError(400, 'Username or email is required');
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    },
        {
            new: true,
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = User.findById(decodedToken?.id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user.id)
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken },
                "Access Token refreshed"
            )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
});

const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized request");
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken");

    return res.status(200).json({
        status: 200,
        data: user,
        message: "Current User fetched successfully"
    });
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, username } = req.body;
    if (!fullName || !email || !username) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullName,
            email,
            username
        }
    },
        {
            new: true
        });

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Failed to upload avatar ");
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    },
        {
            new: true
        });

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"));

});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image is required");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, "Failed to upload Cover Image");
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverImage: coverImage.url
        }
    },
        {
            new: true
        });

    return res.status(200).json(new ApiResponse(200, user, "Cover Image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username?.trim()) {
        throw new ApiError(404, "username is missing");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase(),
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"

            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelSubscribedCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelSubscribedCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "Channel does not exists")
    }

    return res.status(200).json(new ApiResponse(200, channel[0], "User Channel Profile fetched successfully"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                },
                                {
                                    $addFields: {
                                        owner: {
                                            $first: "$owner"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, user[0].watchHistory, "Watch History fetched successfully"));
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};