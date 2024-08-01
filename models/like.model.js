const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    isLike: {
        type:Boolean,
        default: false
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;