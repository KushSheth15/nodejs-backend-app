const express = require('express');
const { registerUser,loginUser,logoutUser } = require('../controllers/user.controller');
const upload = require('../middlewares/multer.middleware');
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

// Ensure the upload middleware is set correctly
router.post('/register', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), registerUser);

router.post('/login',loginUser);

// Secured routes
router.post("/logout",verifyJWT,logoutUser);

module.exports = router;
