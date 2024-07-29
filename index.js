require('dotenv').config();
const express = require('express');

const app = express();


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1>');
});

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`); 
})