const User = require("../models/user");

module.exports.rendersignup = (req,res)=>{
    res.render("users/signup");
};

module.exports.renderlogin = (req,res)=>{
    if (req.isAuthenticated()) {
        req.flash("error" , "You are already logged In");
        return res.redirect("/listing");
    }
    res.render("users/login");
};

module.exports.signup =  async(req,res)=>{
    try {
        let { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "Email already exists");
            return res.redirect("/signup");
        }

        const newUser = new User({ email, username });

        let registereduser = await User.register(newUser, password);
        console.log(registereduser);

        req.flash("success", "welcome to wanderlust");
        res.redirect("/login");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};

module.exports.login = async(req,res)=>{
    req.flash("success" , "welcome to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if (err) {
            return next();
        }
        req.flash("error" , "Logged out!");
        res.redirect("/listing");
    });
};