const express = require('express');
const {toggleSubscription,getUserChannelSubscribers} = require("../controllers/subscription.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/subscribe/:channelId",verifyJWT,toggleSubscription);

router.get("/subscribers/:channelId",getUserChannelSubscribers)

module.exports = router;