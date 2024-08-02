require('dotenv').config();
const mongoose = require('mongoose');

const {DB_NAME} = require("../constants/constants");

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.log("MONGODB connection error: " + error.message);
        process.exit(1);
    }
};

module.exports = connectDB;