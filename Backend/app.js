const express= require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser= require('cookie-parser');

const app = express();

const connectDB = require('./db/db');
connectDB();

const UserRouter = require('./routers/user.router');
const CaptainRouter = require('./routers/captain.router');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/users',UserRouter);
app.use('/captains',CaptainRouter);

app.get('/',(req,res)=>{
    res.send('Hello World');
});


module.exports = app;
