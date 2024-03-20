const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const Passport = require("passport");
const { isLoggedin, saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/users.js");

router.route("/signup")
    .get(usercontroller.rendersignup)
    .post(usercontroller.signup);

router.route("/login")
    .get(usercontroller.renderlogin)
    .post(saveRedirectUrl,
        Passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        usercontroller.login
    );
    
router.get("/logout",usercontroller.logout);



module.exports = router;