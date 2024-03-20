const express = require("express");
const app  =express();//here we define app as the express
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));


//if we don't use resave option tofa;se and the saveUNinitialized option to true
const sessionoptions = {
    secret : "mysupersecretstring" ,
    resave :false ,
    saveUninitialized :true
};

app.use(session(sessionoptions));
app.use(flash());


app.get("/register" , (req,res)=>{
    let {name = "anonymus"} = req.query;
    req.session.name = name;
   
    if (name === "anonymus") {
        req.flash("error" ,"User not registered !");
    }
    else{
        req.flash("success" ,"user registered successfully ! ");
    }
   
    res.redirect("/hello");
})

app.get("/hello" , (req,res)=>{
    res.locals.successmsg = req.flash("success")
    res.locals.errormsg = req.flash("error")
    res.render("page",{name : req.session.name });
})
// app.get("/reqcount" ,(req,res)=>{
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count}times`)
// })

// app.get("/test" ,(req,res)=>{
//     res.send("test Sucessful !");
// })


app.listen(3000,()=>{  
    console.log("server is listning to the port 8080");
}); // here we set the port number of the server;
    