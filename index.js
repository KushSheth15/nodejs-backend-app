require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT;

app.get('/', (req, res) =>{
    res.send('Hello from the server'); 
})

connectDB().then(() => {
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT} 🚀`); 
    });
}).catch((err)=>{
    console.log('Connection Failed: ' + err.message);
});
