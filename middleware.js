const Listing = require("./models/listing");
const Review = require("./models/review");


module.exports.isLoggedin = (req,res,next)=>{
    console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "Login required ! ");
        res.redirect("/login");
    }
    next();
}


//this middleware use when we try to access new page without login then we get the login page after login we should redirect to that page using this middleware
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (listing.owner &&  !listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error" , "😣 Don't try tempare others data ! ");
        return res.redirect(`/listing/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)){
        req.flash("error" , "You are not the author of the review !");
        return res.redirect(`/listing/${id}`);
    }
    next();
}