const express = require('express');
const { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage,downloadUserCSV } = require('../controllers/user.controller');
const {USER_ROUTES} = require("../constants/endpoint");
const upload = require('../middlewares/multer.middleware');
const verifyJWT = require("../middlewares/auth.middleware");
const userValidator = require("../validators/userValidator");
const router = express.Router();

// Ensure the upload middleware is set correctly
router.post(USER_ROUTES.REGISTER, upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]),userValidator, registerUser);

router.post(USER_ROUTES.LOGIN, loginUser);

// Secured routes
router.post(USER_ROUTES.LOGOUT, verifyJWT, logoutUser);

router.post(USER_ROUTES.REFRESH_TOKEN, refreshAccessToken);

router.post(USER_ROUTES.CHANGE_PASSWORD, verifyJWT, changeCurrentPassword);

router.get(USER_ROUTES.CURRENT_USER, verifyJWT, getCurrentUser);

router.patch(USER_ROUTES.UPDATE_ACCOUNT, verifyJWT, updateAccountDetails);

router.patch(USER_ROUTES.UPDATE_AVATAR, verifyJWT, upload.single("avatar"), updateUserAvatar);

router.patch(USER_ROUTES.UPDATE_COVERIMAGE, verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.get(USER_ROUTES.DOWNLOAD_CSV, verifyJWT,downloadUserCSV);

module.exports = router;
