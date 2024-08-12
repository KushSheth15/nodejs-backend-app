require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/user.routes');
const videoRouter = require('./routes/video.routes');
const commentRouter = require('./routes/comment.routes');
const likeRouter = require("./routes/like.routes");
const subscribeRouter = require('./routes/subsciption.routes');

const {MAIN_ROUTES} = require("./constants/endpoint");

const app = express();

app.get('/', (req, res) =>{
    res.send('Hello from the server'); 
})

app.use(cors({
    origin:process.env.CORS_ORIGIN
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.use(MAIN_ROUTES.USER,userRouter);
app.use(MAIN_ROUTES.VIDEO,videoRouter);
app.use(MAIN_ROUTES.COMMENT,commentRouter);
app.use(MAIN_ROUTES.LIKE,likeRouter);
app.use(MAIN_ROUTES.SUBSCRIPTION,subscribeRouter);

module.exports = app;