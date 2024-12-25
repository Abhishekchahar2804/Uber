const express= require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello World');
});


module.exports = app;
