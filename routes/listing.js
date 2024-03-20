    const express = require("express");
    const router = express.Router();
    const wrapAsync = require("../utils/wrapAsync.js");
    const ExpressError = require("../utils/Expresserror.js");
    const Listing = require("../models/listing.js");
    const {isLoggedin, isOwner} = require("../middleware.js");
    const listingController = require("../controllers/listings.js");
    const multer  = require('multer');
   
    const {storage } = require("../cloudConfig.js");
    const upload = multer({storage});
    // const cookieparser  = require("cookie-parser");
    // router.use(cookieParser("hellohaiham"));


    router.route("/")
        .get(wrapAsync(listingController.index))// index route
        .post(isLoggedin,upload.single('listing[image][url]'),wrapAsync(listingController.newListingdata)); //post request of the listing to post the new listing


    //create riute for the lisitng.new get request from indexfile
    router.get("/new",isLoggedin, listingController.rendernewform);
    
    router.route("/:id")
        .get(wrapAsync(listingController.showlisting))//show route request (nay one can show this route)
        .put(isLoggedin,upload.single('listing[image][url]'),isOwner,wrapAsync(listingController.editedlistingdata))//put request to update the data of the listing if you are owner and logged in
        .delete(isLoggedin,isOwner,wrapAsync(listingController.deletelisting)); //delete request

   
    //edit route to go to the edit the data
    router.get("/:id/edit",isLoggedin,wrapAsync(listingController.editlistingrequest));

    module.exports = router;