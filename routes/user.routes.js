const express = require('express');
const { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, updateAccountDetails, updateUserAvatar, updateUserCoverImage } = require('../controllers/user.controller');
const upload = require('../middlewares/multer.middleware');
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

// Ensure the upload middleware is set correctly
router.post('/register', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), registerUser);

router.post('/login', loginUser);

// Secured routes
router.post("/logout", verifyJWT, logoutUser);

router.post('/refresh-token', refreshAccessToken);

router.post('/change-password', verifyJWT, changeCurrentPassword);

router.get('/current-user', verifyJWT, getCurrentUser);

router.patch('/update-account', verifyJWT, updateAccountDetails);

router.patch('/avatar', verifyJWT, upload.single("avatar"), updateUserAvatar);

router.patch("/cover-image", verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.get("/c/:username", verifyJWT, getUserChannelProfile);

router.get("/history", verifyJWT, getWatchHistory);
module.exports = router;
