if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
};


const express = require("express");
const app  =express();//here we define app as the express
const mongoose = require('mongoose');

const dburl = process.env.CLOUD_URL;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //this link for the local host or run in the server
const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
const path = require("path");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/Expresserror.js");
const session = require("express-session");
const flash = require("connect-flash");

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const Mongostore = require('connect-mongo');

main().then(()=>{
    console.log("connected to database");
}).catch(err => console.log(err));


async function main() {
    await mongoose.connect(dburl);
}



//set the directory and middlewares
app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const store = Mongostore.create({
    mongoUrl: dburl,
    crypto:{
        secret : process.env.SECRET,
    },
    touchAfter: 24*3600,
  });


store.on("error",()=>{
    console.log("ERROR In MONGO SESSION STORE" , err);
});

const sessionoptions = {
    store,
    secret : process.env.SECRET,
    resave :false ,
    saveUninitialized :true,
    cookie:{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
    }
};


app.use(session(sessionoptions));
app.use(flash());

//for the password auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

// app.get("/demouser" ,async(req,res)=>{
//     let fakeUser = new User({
//         email : "bera@gmail.com",
//         username : "meetbera007",
//     });

//     let registereduser = await User.register(fakeUser,"abc123");
//     res.send(registereduser);
// })
//
app.use("/listing" ,listingRouter);
app.use("/listing/:id/reviews",reviewRouter);       
app.use("/",userRouter);       

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND!!!"));    
});



//for handle the error simply we need to use th emiddleware like that
app.use((err,req,res,next)=>{
    let {statusCode=500 ,message= "something went wrong!"} =err;
    if(statusCode == 404){
        res.render("./notfound404",{ statusCode });
    }
    else{
        res.status(statusCode).render("./error",{ err });
    }

    // res.status(statusCode).send(message);
});



app.listen(8080,()=>{  
    console.log("server is listning to the port 8080");
}); // here we set the port number of the server;

