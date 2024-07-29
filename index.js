require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1>');
});

const PORT = process.env.PORT;

connectDB().then(() => {
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT} 🚀`); 
    });
}).catch((err)=>{
    console.log('Connection Failed: ' + err.message);
});
