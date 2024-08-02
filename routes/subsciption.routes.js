const express = require('express');
const {toggleSubscription,getUserChannelSubscribers} = require("../controllers/subscription.controller");
const {SUBSCRIPTION_ROUTES} = require("../constants/endpoint");
const verifyJWT = require("../middlewares/auth.middleware");
const router = express.Router();

router.post(SUBSCRIPTION_ROUTES.SUBSCRIBE_USER,verifyJWT,toggleSubscription);

router.get(SUBSCRIPTION_ROUTES.GET_SUBSCRIBERS,getUserChannelSubscribers)

module.exports = router;