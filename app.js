require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/user.routes');

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

module.exports = app;