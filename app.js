const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
require("dotenv").config();
const session = require('express-session');


// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

// db
mongoose
    .connect(process.env.DBS, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log("DB Connected"));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(expressValidator());
app.use(session({           //{secret : process.env.SESSION,maxAge : 60000,httpOnly : true}
    key : "user_id",
    secret : process.env.SESSION,
    resave : false,
    saveUninitialized : false,
    cookie:{
        expires : 600000
    }
}));

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

//pass another routes pass error
app.use((req,res,next)=>{
    const err = new Error("404 page not found...")
    err.status = 404
    next(err)
});

//Error handler
app.use((err,req,res,next)=>{
    res.status(err.status || 500) //500 internal server error
    res.send({
        error:{
            status : err.status || 500,
            message : err.message
        }
    })
})

//use session
app.get('/session',(req,res,next)=>{
    if(req.session.views){
        req.session.views++
        //req.sanitizeHeaders('Content-Type','text/html')
        res.write('<p>expire in :'+(req.session.cookie.maxAge /1000) + 's</p>')
        res.end();
    }else{
        req.session.views = 1
        res.end('welcome to the session demo.refresh!!');
    }
})

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
