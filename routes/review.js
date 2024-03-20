const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isReviewAuthor } = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");



//Reviews
// review post request
router.post("/",isLoggedin,wrapAsync(reviewcontroller.createreview));
//review delete request
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewcontroller.destroyreview)); 

module.exports = router;