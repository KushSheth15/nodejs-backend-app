require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/user.routes');
const videoRouter = require('./routes/video.routes');
const commentRouter = require('./routes/comment.routes');
const likeRouter = require("./routes/like.routes");

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.use("/api/v1/user",userRouter);
app.use("/api/v1/video",videoRouter);
app.use("/api/v1/comment",commentRouter);
app.use("/api/v1/like",likeRouter);

module.exports = app;