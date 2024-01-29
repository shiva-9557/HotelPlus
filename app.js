if(process.env.NODE_ENV != "production"){
require('dotenv').config();}


const express = require("express");  //for using express
const app = express();                      //app using express
const path = require("path");  // Import the 'path' module
const port = 8080;                  // connection to local line
const methodOverride = require("method-override"); //it use to over ride the method like "post" and convert it to "delete","put","patch"
const mongoose = require("mongoose"); //requiring mondoose to use it 
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");



const flash=require("connect-flash");

main().//making connection then we can use database-whatsapp but we can use dbs before connection made because mongoose uses operational buffer
    then(res => {
        console.log("connected to database");
    })
    .catch(err => {
        console.log("error occour while connetion");
    });

// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// };

const dbUrl = process.env.ATLASDB_URL;
// let x=dbUrl;

async function main() {
    const dbUrl = process.env.ATLASDB_URL;
    await mongoose.connect(dbUrl);
}; 

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

app.use(express.urlencoded({ extended: true }));// Parse URL-encoded bodies (as sent by HTML forms)//convert plane text to object

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));  // it is use if views directory is not in same directory as of index.js

app.use(express.static(path.join(__dirname, "public")));   //__dirname represents the directory name of the current module (the module file that contains the code), 
                                                            //and path.join is used to concatenate this with the "public" directory to create an absolute path,
                                                            //if we do not use this it will not get public directory.

app.use(methodOverride("_method"));//so that app can use it
app.engine('ejs',ejsMate);

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE ",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};



app.use(session(sessionOptions));
app.use(flash());
//passport uses sessions such that no login on same web browser
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("./listings/error.ejs", { message });
});



app.listen(port,()=>{
    console.log("connected");
});