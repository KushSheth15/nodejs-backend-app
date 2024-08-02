const MAIN_ROUTES = {
    USER : "/api/v1/user",
    VIDEO:"/api/v1/video",
    COMMENT:"/api/v1/comment",
    LIKE:"/api/v1/like",
    SUBSCRIPTION:"/api/v1/subscription"
}

const USER_ROUTES = {
    REGISTER:'/register',
    LOGIN:'/login',
    LOGOUT:'/logout',
    CHANGE_PASSWORD:'/change-password',
    CURRENT_USER:'/current-user',
    UPDATE_ACCOUNT:'/update-account',
    UPDATE_AVATAR:'/avatar',
    UPDATE_COVERIMAGE:'/cover-image',
    REFRESH_TOKEN:'/refresh-token',
}

const VIDEO_ROUTES = {
    PUBLISH_VIDEO:'/publish',
    GET_VIDEO_BY_ID:'/getVideo/:videoId',
    GET_ALL_VIDEOS:'/getAllVideo'
}

const COMMENT_ROUTES = {
    ADD_COMMENTS:'/add-comment/:videoId',
    GET_COMMENTS:'/get-comment/:videoId'
}

const LIKE_ROUTES = {
    ADD_LIKE:"/:videoId",
    GET_LIKED_VIDEOS:"/liked-videos"
}

const SUBSCRIPTION_ROUTES = {
    SUBSCRIBE_USER:"/subscribe/:channelId",
    GET_SUBSCRIBERS:"/subscribers/:channelId"
}

module.exports = {
    MAIN_ROUTES,
    USER_ROUTES,
    VIDEO_ROUTES,
    COMMENT_ROUTES,
    LIKE_ROUTES,
    SUBSCRIPTION_ROUTES
}