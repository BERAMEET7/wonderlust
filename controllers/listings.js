const Listing = require("../models/listing");
const ExpressError = require("../utils/Expresserror.js");

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index",{ allListings });
};

module.exports.rendernewform = (req, res) => {
    res.render("listings/new");
}

module.exports.newListingdata =  async(req,res)=>{ 
    if(!req.body.listing){
        throw new ExpressError(400,"SEND VALID DATA FOR THE REGISTRATION ON THE WANDRLUST.....");
    }
let { title, description, price, location, country, image} = req.body.listing; 
let url = req.file.path;
let filename = req.file.filename;
const Listingnew = { title, description, price, location, country, image: { url: url,filename:filename } };
const newListing = new Listing(Listingnew);
newListing.owner = req.user._id;
await newListing.save();
req.flash("success" , "New listing created!")
res.redirect("/listing");
};

module.exports.showlisting = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({
        path : "reviews",
        populate : {
            path: "author",
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Your Requested Listing Doesn't Exists!");
        res.redirect("/listing");
    }
    res.render("listings/show",{listing});
};

module.exports.editlistingrequest =  async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You Try To Edit Doesn't Exists!");
        res.redirect(`/listing/${id}`);
    }

    let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace("/upload","/upload/h_200");
    res.render("listings/edit",{listing,originalimageurl});
};

module.exports.editedlistingdata = async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"SEND VALID DATA FOR THE REGISTRATION ON THE WANDRLUST.....");
    };

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});


    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url: url, filename: filename };
        await listing.save(); // Save the listing only when a new file is uploaded
    }
    
    req.flash("success" , "Listing Update Successfully!")
    res.redirect(`/listing/${id}`);
};

module.exports.deletelisting = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listing");
};