const express= require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app = express();

const connectDB = require('./db/db');
connectDB();

const UserRouter = require('./routers/user.router');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users',UserRouter);

app.get('/',(req,res)=>{
    res.send('Hello World');
});


module.exports = app;
