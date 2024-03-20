const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createreview = async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(402, "Listing not found");
    }
    if (!req.body.review) {
        throw new ExpressError(422, "SEND VALID COMMENT....");
    }
let newReview =new Review(req.body.review);
newReview.author = req.user._id;
console.log(newReview);
listing.reviews.push(newReview);

await newReview.save();
await listing.save();

req.flash("success" , "new review added!");
res.redirect(`/listing/${listing.id}`);
};

module.exports.destroyreview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    req.flash("success" , "reviw deleted successfully !");
    res.redirect(`/listing/${id}`);
};